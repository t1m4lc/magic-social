import { useServerStripe } from "#stripe/server";

// Fallback pricing data when Stripe price doesn't exist
// This is useful for displaying the Ultimate plan before it's fully configured in Stripe
const createFallbackPrice = (planId: string, amount: number) => ({
  id: `fallback_${planId}`,
  unit_amount: amount * 100, // Convert to cents
  currency: "eur",
  recurring: {
    interval: "month",
    interval_count: 1,
  },
  metadata: {
    fallback: "true",
    plan: planId,
  },
});

const fetchPriceWithFallback = async (
  stripe: any,
  priceId: string | undefined,
  planId: string,
  fallbackAmount: number
) => {
  if (!priceId) {
    console.warn(`No price ID configured for ${planId}, using fallback`);
    return createFallbackPrice(planId, fallbackAmount);
  }

  try {
    return await stripe.prices.retrieve(priceId);
  } catch (error: any) {
    console.warn(
      `Failed to fetch ${planId} price from Stripe, using fallback:`,
      error?.message || error
    );
    return createFallbackPrice(planId, fallbackAmount);
  }
};

export default defineCachedEventHandler(
  async (event) => {
    try {
      const stripe = await useServerStripe(event);

      const priceIds = {
        pro: process.env.STRIPE_PRO_PRICE_ID,
        ultimate: process.env.STRIPE_ULTIMATE_PRICE_ID,
      };

      // Pro plan is required, Ultimate can be fallback
      if (!priceIds.pro) {
        throw createError({
          statusCode: 500,
          statusMessage: "Missing Pro plan Stripe price configuration",
        });
      }

      const [proPrice, ultimatePrice] = await Promise.all([
        fetchPriceWithFallback(stripe, priceIds.pro, "pro", 5),
        fetchPriceWithFallback(stripe, priceIds.ultimate, "ultimate", 25),
      ]);

      return {
        pro: proPrice,
        ultimate: ultimatePrice,
      };
    } catch (error: any) {
      console.error("Failed to fetch Stripe prices:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch pricing information",
      });
    }
  },
  {
    maxAge: 300, // Cache for 5 minutes
    group: "stripe-prices",
  }
);

import { defineEventHandler } from "h3";
import { useServerStripe } from "#stripe/server";
import type Stripe from "stripe";

// checkout.session.completed
// invoice.payment_succeeded
// customer.subscription.created
// checkout.session.completed

export const config = {
  bodyParser: false,
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = await useServerStripe(event);

  const sig = event.node.req.headers["stripe-signature"] as string;
  const rawBody = await readRawBody(event);

  let stripeEvent: Stripe.Event;
  try {
    console.log("[webhook] rawBody:", rawBody);
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody!,
      sig,
      config.stripeWebhookSecret
    );
    console.log("[webhook] stripeEvent:", stripeEvent.type, stripeEvent.id);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return send(event, 400, "Webhook Error");
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    console.log(
      "[webhook] checkout.session.completed session:",
      session.id,
      session.subscription
    );
    if (session.subscription) {
      // Fetch the subscription from Stripe for testing
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      console.log(
        "[webhook] subscription fetched:",
        subscription.id,
        subscription.status
      );
      return { subscription };
    }
    console.log("[webhook] No subscription on session.");
    return { message: "No subscription on session." };
  }

  console.log("[webhook] Event not handled:", stripeEvent.type);
  return { received: true };
});

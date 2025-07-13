import type { limit, planType, priceId } from "../types/price";

const { stripeProPriceId } = useRuntimeConfig();

export const planMap: Record<priceId, planType> = {
  price_1RkIx3LuCK4UmVgSWcLFnoDi: "pro",
  price_1RjePcLuCK4UmVgSQNCesBGM: "pro", // TEST MODE
};

export const FREE_COUNT = 5;

// TODO manage this with settings table server side
export const dailyLimitMap: Record<planType, limit> = {
  free: FREE_COUNT,
  pro: 150,
  ultimate: 1500,
};

export const URLS = {
  CHROME_WEBSTORE:
    "https://chromewebstore.google.com/detail/magic-social/jmhegjhgbgnnlpohnmicbploiiohnhdg",
};

export const ACTIVE_DISCOUNT_CODE = "promo_1RkJ6ELuCK4UmVgSmR8Mrdv9";

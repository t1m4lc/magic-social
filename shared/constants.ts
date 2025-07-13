import type { limit, planType, priceId } from "../types/price";

export const planMap: Record<priceId, planType> = {
  price_1Ri8kwLuCK4UmVgSsh5T3laq: "pro",
  price_1RiCFZQ6AECzZeTtcdGuhaKb: "pro", // TEST
  price_1RjePcLuCK4UmVgSQNCesBGM: "pro", // TEST
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

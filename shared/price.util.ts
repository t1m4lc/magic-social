import { dailyLimitMap, FREE_COUNT, planMap } from "./constants";
import type { limit, planType, priceId } from "../types/price";

export const getPlanTypeWithPriceId = (id: priceId | null): planType => {
  if (!id) return "free";
  return planMap[id] || "free";
};

const getDailyLimitWithPlanType = (type: planType): limit => {
  return dailyLimitMap[type] || FREE_COUNT;
};

export const getDailyLimitWithPriceId = (id: priceId | null): limit => {
  if (!id) return FREE_COUNT;
  const type = getPlanTypeWithPriceId(id);
  return getDailyLimitWithPlanType(type);
};

type priceId = string;
type limit = number;
type planType = "free" | "pro" | "ultimate";

const planMap: Record<priceId, planType> = {
  price_1Ri8kwLuCK4UmVgSsh5T3laq: "pro",
  price_1RiCFZQ6AECzZeTtcdGuhaKb: "pro", // TEST
  price_1Riak1LuCK4UmVgSstfwkQzG: "pro", // TEST
};

export const dailyLimitMap: Record<planType, limit> = {
  free: 5,
  pro: 150,
  ultimate: 1500,
};

export const getPlanTypeWithPriceId = (id: priceId): planType => {
  return planMap[id] ?? "free";
};

const getDailyLimitWithPlanType = (type: planType): limit => {
  return dailyLimitMap[type] ?? 0;
};

export const getDailyLimitWithPriceId = (id: priceId | null): limit => {
  if (!id) return 0;
  const type = getPlanTypeWithPriceId(id);
  return getDailyLimitWithPlanType(type);
};

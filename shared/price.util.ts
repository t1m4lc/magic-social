type priceId = string;
export type planType = "free" | "pro" | "ultimate";

const planMap: Record<priceId, planType> = {
  price_1Ri8kwLuCK4UmVgSsh5T3laq: "pro",
  price_1RiCFZQ6AECzZeTtcdGuhaKb: "pro", // TEST
};

export const convertPriceIdToPlanType = (priceId: priceId): planType => {
  return planMap[priceId] ?? "free";
};

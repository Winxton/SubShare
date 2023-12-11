export const SET_SUBSCRIPTION_COST = "SET_SUBSCRIPTION_COST";

export const setSubscriptionCost = (cost: number | null) => ({
  type: SET_SUBSCRIPTION_COST as typeof SET_SUBSCRIPTION_COST,
  payload: cost,
});

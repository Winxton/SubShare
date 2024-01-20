import { Friend } from "../models/Friend";
export const getSubscriptionCost = (groups,userEmail ) => {
  let totalCost = 0;

  groups.forEach((group) => {
    group.friends.forEach((friend) => {
      if (friend.email === userEmail) {
        totalCost += parseFloat(friend.subscription_cost.toString());
      }
    });
  });

  return `$${totalCost.toFixed(2)}`;
};
export function updateFriendSubscriptionCost(
  friends: Friend[],
  email?: string,
  amounts?: Number
): Friend[] {
  return friends.map((friend) => {
    if (friend.email === email) {
      const newSubscriptionCost = amounts;

      return {
        ...friend,
        subscription_cost: newSubscriptionCost as number,
      };
    }
    return friend;
  });
}
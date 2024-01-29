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
export function subscriptionCosts(friends: Friend[], amount: number): Friend[] {
  let updatedFriends: Friend[];
    // Split the total cost equally among friends
    updatedFriends = friends.map(friend => ({
      ...friend,
      subscription_cost: amount
    }));

  return updatedFriends;
  }
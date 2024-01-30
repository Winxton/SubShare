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
export function subscriptionCosts(friends, amount: number, email?:string ) {
  return friends.map(friend => {
    if (!email || friend.email === email) {
      // Update the subscription_cost for the friend
      return { ...friend, subscription_cost: amount };
    }
    // Return the friend unchanged if the email doesn't match
    return friend;
  });
}


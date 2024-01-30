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
export function subscriptionCosts(friends, pricePerMember, splitMode, customAmounts = {}) {
  let updatedFriends = [];

  if (splitMode === "equally") {
    // Split the total cost equally among friends
    updatedFriends = friends.map(friend => ({
      ...friend,
      subscription_cost: pricePerMember
    }));
  } else if (splitMode === "byAmount") {
    // Use custom amounts for each friend
    updatedFriends = friends.map(friend => ({
      ...friend,
      subscription_cost: customAmounts[friend.email] || 0
    }));
  }

  return updatedFriends;
}
export function calculateSavings(groups, userEmail) {
  return groups.reduce((acc, group) => {
    // Check if the group has a valid subscription and friends list
    if (!group.subscription || !group.friends) return acc;

    const costOfSubscriptionService = group.subscription.cost;
    // Find the user's subscription cost in the group
    const userSubscriptionCost = group.friends.find(friend => friend.email === userEmail)?.subscription_cost;

    // If the user is not part of the group, continue with the accumulated value
    if (userSubscriptionCost === undefined) return acc;

    // Calculate the savings and accumulate
    const savings = costOfSubscriptionService - userSubscriptionCost;
    return acc + savings;
  }, 0); // Start accumulating from 0
}



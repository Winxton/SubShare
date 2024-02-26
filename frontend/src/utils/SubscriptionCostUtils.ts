import { Friend } from "../models/Friend";

export const getSubscriptionCost = (groups, userEmail) => {
  let totalCost = 0;

  groups.forEach((group) => {
    group.friends.forEach((friend) => {
      if (friend.email === userEmail) {
        totalCost += parseFloat(friend.subscription_cost.toString());
      }
    });
  });

  return totalCost;
};

export function updateSubscriptionCost(
  friends: Friend[],
  splitMode: "equally" | "byAmount", // Assuming these are the two modes you're working with
  email: string | null, // Email can be null if splitMode is 'Equally'
  amount: number // Assuming amount is always provided as a number
): Friend[] {
  if (splitMode === "equally") {
    // Return a new array with updated subscription costs for all friends
    return friends.map((friend) => ({ ...friend, subscription_cost: amount }));
  } else {
    // Return a new array with updated subscription cost for the friend with the matching email
    return friends.map((friend) => {
      if (friend.email === email) {
        return { ...friend, subscription_cost: amount };
      }
      return friend;
    });
  }
}

export function calculateSavings(groups, userEmail) {
  return groups.reduce((acc, group) => {
    // Check if the group has a valid subscription and friends list
    if (!group.subscription || !group.friends) return acc;

    const costOfSubscriptionService = group.subscription.cost;
    // Find the user's subscription cost in the group
    const userSubscriptionCost = group.friends.find(
      (friend) => friend.email === userEmail
    )?.subscription_cost;

    // If the user is not part of the group, continue with the accumulated value
    if (userSubscriptionCost === undefined) return acc;

    // Calculate the savings and accumulate
    const savings = costOfSubscriptionService - userSubscriptionCost;
    return acc + savings;
  }, 0); // Start accumulating from 0
}

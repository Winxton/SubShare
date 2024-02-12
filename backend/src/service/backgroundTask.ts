import cron from "node-cron";
import { getGroup } from "./repository/database";
// Schedule recurring task to run daily
cron.schedule("0 0 * * *", async () => {
  try {
    // Get current date
    const currentDate = new Date();

    // Retrieve active groups with their billing dates
    const activeGroups = await supabase
      .from("groups")
      .select("id, billing_date")
      .eq("active", true) // Assuming there's an 'active' column indicating active groups
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      });

    // Iterate through active groups
    for (const group of activeGroups) {
      // Extract billing date from the group
      const billingDate = new Date(group.billing_date);

      // Check if the current date matches the billing date for the group
      if (currentDate.getDate() === billingDate.getDate()) {
        // Retrieve members of the group
        const groupMembers = await supabase
          .from("members")
          .select("id, group_id, subscription_cost, balance")
          .eq("group_id", group.id)
          .and("accepted", "=", true)
          .then(({ data, error }) => {
            if (error) throw error;
            return data;
          });

        // Update user balances based on subscription costs
        for (const member of groupMembers) {
          const updatedBalance = member.balance + member.subscription_cost;

          // Update user balance in the database
          await supabase
            .from("members")
            .update({ balance: updatedBalance })
            .eq("id", member.id)
            .then(({ error }) => {
              if (error) throw error;
            });

          // Send notification to user about balance increase
          // Implement notification logic here
          console.log(
            `Notification sent to user ${member.id}: Balance increased by ${member.subscription_cost}`
          );
        }
      }
    }

    console.log("User balances updated successfully.");
  } catch (error) {
    console.error("Error updating user balances:", error.message);
  }
});

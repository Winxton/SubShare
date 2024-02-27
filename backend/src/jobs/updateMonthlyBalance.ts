const supabase = require("../repository/supabase.ts");
const { sendMemberBalanceEmail } = require("../service/emails.ts");

/*Finds values of next_billing_date which equals to today, increases next_billing_date by 30 days and updates the member's balance */
async function updateMemberBalancesOnBillingDate() {
  const SUBSCRIPTION_INTERVAL_DAYS = 30;

  const { data, error } = await supabase
    .from("groups")
    .select("id, name, next_billing_date");

  if (error) {
    console.error("Error querying Supabase:", error);
    return;
  }

  // Get today's date
  const today = new Date();

  // Iterate through the query results
  data.forEach(async (group) => {
    const nextBillingDate = new Date(group.next_billing_date);

    //getDate and getMonth starts count from 0 somehow so added 1
    if (nextBillingDate <= today) {
      // Increase 'next_billing_date' by 30 days
      nextBillingDate.setDate(
        nextBillingDate.getDate() + SUBSCRIPTION_INTERVAL_DAYS
      );

      // Update 'next_billing_date' in the database
      await supabase
        .from("groups")
        .update({ next_billing_date: nextBillingDate })
        .eq("id", group.id);

      await updateMemberBalances(group.id, group.name);
    }
  });
}

async function updateMemberBalances(groupId, groupName) {
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, balance, subscription_cost")
    .eq("group_id", groupId); // Using 'group_id' to identify members to increase 'Balance' in 'members' table

  if (membersError) {
    console.error("Error querying Members:", membersError);
    return;
  }

  members.forEach(async (member) => {
    const newBalance = member.balance + member.subscription_cost;

    await supabase
      .from("members")
      .update({ balance: newBalance })
      .eq("id", member.id);

    await sendMemberBalanceEmail(
      member.name,
      member.email,
      groupName,
      member.subscription_cost,
      member.balance
    );
  });
}

updateMemberBalancesOnBillingDate();

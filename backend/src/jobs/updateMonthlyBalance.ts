const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
/*Finds values of next_billing_date which equals to today, increases next_billing_date by 30 days and updates the member's balance */
async function queryDatabase() {
  const { data, error } = await supabase
    .from("groups")
    .select("id, next_billing_date");

  if (error) {
    console.error("Error querying Supabase:", error);
    return;
  }

  // Get today's date
  const today = new Date();

  // Iterate through the query results
  for (let i = 0; i < data.length; i++) {
    const group = data[i];

    const nextBillingDate = new Date(group.next_billing_date);

    //getDate and getMonth starts count from 0 somehow so added 1
    if (
      nextBillingDate.getDate() + 1 === today.getDate() &&
      nextBillingDate.getMonth() + 1 === today.getMonth() + 1 &&
      nextBillingDate.getFullYear() === today.getFullYear()
    ) {
      // Increase 'next_billing_date' by 30 days
      nextBillingDate.setDate(nextBillingDate.getDate() + 30);

      // Update 'next_billing_date' in the database
      await supabase
        .from("groups")
        .update({ next_billing_date: nextBillingDate })
        .eq("id", group.id);

      await updateMemberBalances(group.id);
    }
  }
}
async function updateMemberBalances(groupId) {
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, balance, subscription_cost")
    .eq("group_id", groupId); // Using 'group_id' to identify members to increase 'Balance' in 'members' table

  if (membersError) {
    console.error("Error querying Members:", membersError);
    return;
  }

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    const newBalance = member.balance + member.subscription_cost;

    await supabase
      .from("members")
      .update({ balance: newBalance })
      .eq("id", member.id);
  }
}
queryDatabase();

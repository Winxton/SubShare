import * as dotenv from "dotenv";
const path = require("path");
const SUBSCRIPTION_INTERVAL_DAYS = 30;
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { Friend, Group, Subscription } from "../models/models";
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Get User by Token

export async function getUser(accessToken: string) {
  const userResp = await supabase.auth.getUser(accessToken);

  const { data, error } = userResp;
  if (error) {
    console.log(error);
  }
  return data.user;
}

// Get Groups
export async function getGroup(userEmail: string, groupId: string) {
  // Get group from the database
  const { data: groups, error } = await supabase
    .from("groups")
    .select("*")
    .limit(1)
    .eq("id", groupId);

  if (error || groups.length === 0) {
    console.error("Error getting group:", error);
    return null;
  }

  const group = groups[0];
  const members = await getMembers(group.id);

  // Make sure I am in the group
  const myself = members.find((member) => member.email === userEmail);
  if (!myself) {
    console.error("User is not in group. Cannot get group.");
    return null;
  }

  return new Group(
    new Subscription(
      group.name,
      group.image,
      group.cost,
      group.billing_date // Include billing_date when creating Subscription
    ),
    members || [],
    group.id
  );
}

export async function createGroup(
  userId,
  name,
  cost,
  createdDate,
  image,
  billing_date,
  next_billing_date
) {
  const resp = await supabase
    .from("groups")
    .insert([
      {
        user_id: userId,
        name: name,
        cost: cost,
        created_date: createdDate,
        image: image,
        billing_date: billing_date,
        next_billing_date: next_billing_date,
      },
    ])
    .select();

  if (resp.error) {
    console.error("Error creating group:", resp.error);
    return null;
  }

  const createdGroupId = resp.data[0];

  return createdGroupId;
}
export async function createMember(
  groupId,
  email,
  isowner,
  active,
  accepted_date,
  balance,
  subscription_cost
) {
  const resp = await supabase.from("members").insert([
    {
      group_id: groupId,
      email: email,
      isowner: isowner,
      active: active,
      accepted_date: accepted_date,
      balance: balance,
      subscription_cost: subscription_cost,
    },
  ]);
  if (resp.error) {
    console.error("Error creating member:", resp.error);
    return null;
  }

  return resp.data;
}
//add comment
export async function getMemberGroups(
  userEmail: string,
  active: boolean
): Promise<Group[] | null> {
  try {
    // Fetch groups based on the user's email in the members table
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("group_id")
      .eq("email", userEmail)
      .is("active", active);
    if (memberError) {
      throw new Error(`Error getting groups for user: ${memberError.message}`);
    }

    const groupIds = memberData?.map((member) => member.group_id) || [];

    // Fetch the actual groups based on the retrieved group ids
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .in("id", groupIds)
      .order("created_date", { ascending: false });

    if (groupError) {
      throw new Error(`Error getting group data: ${groupError.message}`);
    }

    const groups = groupData || [];

    // Fetch members for each group
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const members = await getMembers(group.id);
        return new Group(
          new Subscription(
            group.name,
            group.image,
            group.cost,
            group.billing_date
          ),
          members || [],
          group.id
        );
      })
    );

    return groupsWithMembers;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMembers(GroupId): Promise<Friend[]> {
  const resp = await supabase
    .from("members")
    .select("*")
    .eq("group_id", GroupId);

  if (resp.error) {
    console.error("Error getting groups:", resp.error);
    return [];
  }

  const members = resp.data;

  return members.map((member) => {
    return new Friend(
      member.name,
      member.image,
      member.email,
      member.subscription_cost,
      member.isowner,
      member.active
    );
  });
}

// database.ts
export async function deleteGroup(groupId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);

    if (error) {
      console.error("Error deleting group:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting group:", error);
    return false;
  }
}

//Function to update the active status of a group in the database
export async function disbandGroup(groupId: string): Promise<boolean> {
  try {
    const resp = await supabase
      .from("members")
      .update({ active: false })
      .eq("group_id", groupId);

    if (resp.error) {
      console.error("Error updating group:", resp.error);

      return false;
    }
    return resp;
  } catch (error) {
    console.error("Error updating group:", error);
    return false;
  }
}

/*Finds values of next_billing_date which equals to today, increases next_billing_date by 30 days and updates the member's balance */
async function updateMemberBalancesOnBillingDate() {
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
      nextBillingDate.setDate(
        nextBillingDate.getDate() + SUBSCRIPTION_INTERVAL_DAYS
      );

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

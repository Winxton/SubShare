import * as dotenv from "dotenv";
const path = require("path");
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
    new Subscription(group.name, group.image, group.cost),
    members || [],
    group.id
  );
}

export async function createGroup(userId, name, cost, createdDate, image) {
  const resp = await supabase
    .from("groups")
    .insert([
      {
        user_id: userId,
        name: name,
        cost: cost,
        created_date: createdDate,
        image: image,
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
  isOwner,
  accepted,
  accepted_date,
  balance
) {
  const resp = await supabase.from("members").insert([
    {
      group_id: groupId,
      email: email,
      isowner: isOwner,
      accepted: accepted,
      accepted_date: accepted_date,
      balance: balance,
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
  accepted: boolean | null
): Promise<Group[] | null> {
  try {
    // Fetch groups based on the user's email in the members table
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("group_id")
      .eq("email", userEmail)
      .is("accepted", accepted);

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
          new Subscription(group.name, group.image, group.cost),
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
    return new Friend(member.name, member.image, member.email);
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

//Function to update the accepted status of a group in the database
export async function acceptInvitedGroup(email: string, groupID: string) {
  try {
    // Update the 'accepted' field of the member with the specified email and group ID
    const resp = await supabase
      .from("members")
      .update({ accepted: true })
      .eq("email", email)
      .eq("group_id", groupID);

    if (resp.error) {
      console.error("Error updating group:");

      return false;
    }
    // Check if the update was successful

    return resp;
  } catch (error) {
    console.error("Error updating group:", error);
    return false;
  }
}

//Function to update the decline status of a group in the database

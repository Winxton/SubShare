import * as dotenv from "dotenv";
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { Friend, Group, Subscription } from "./models";
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Get User by Token

export async function getUser(accessToken: string) {
  const userResp = await supabase.auth.getUser(accessToken);

  const { data, error } = userResp;
  if(error){
    console.log(error)
  }
  return data.user;
}

// Get Groups

export async function createGroup(userId, name, cost, createdDate, image) {
  const resp = await supabase.from("groups").insert([
    {
      user_id: userId,
      name: name,
      cost: cost,
      created_date: createdDate,
      image: image,
    },
  ]).select();

  if (resp.error) {
    console.error("Error creating group:", resp.error);
    return null;
  }

  const createdGroupId = resp.data[0];

  return createdGroupId;
}
export async function createMember(groupId, email, isOwner, accepted, accepted_date, balance) {
  const resp = await supabase.from("members").insert([
    {
      group_id: groupId,
      email: email,
      isowner: isOwner,
      accepted: accepted, 
      accepted_date: accepted_date,
      balance: balance
    },
  ]);
if (resp.error) {
  console.error("Error creating member:", resp.error);
  return null;
}

return resp.data;
}

export async function getGroups(userId): Promise<Group[] | null> {
  const resp = await supabase
    .from("groups")
    .select("*")
    .eq("user_id", userId)
    .order("created_date", { ascending: false });

  if (resp.error) {
    console.error("Error getting groups:", resp.error);
    return null;
  }

  const groups = resp.data;

  if (!groups) {
    return null;
  }

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
}

export async function getMembers(GroupId): Promise<Friend[] | null> {
  
  const resp = await supabase
    .from("members")
    .select("*")
    .eq("group_id", GroupId)

  if (resp.error) {
    console.error("Error getting groups:", resp.error);
    return null;
  }

  const members = resp.data;

  return members.map((member) => {
    return new Friend (member.name, member.image, member.email);
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

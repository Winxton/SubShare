import * as dotenv from "dotenv";
dotenv.config();

import { Group, Subscription } from "./models";
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
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
  ]);

  if (resp.error) {
    console.error("Error creating group:", resp.error);
    return null;
  }

  return resp.data;
}
export async function createMember(email, isOwner, accepted, accepted_date, balance) {
  const resp = await supabase.from("members").insert([
    {
      email: email,
      isOwner: isOwner,
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

  return groups.map((group) => {
    return new Group(new Subscription(group.name, group.image, group.cost), []);
  });
}

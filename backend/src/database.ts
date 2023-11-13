import * as dotenv from "dotenv";
dotenv.config();

const { createClient } = require("@supabase/supabase-js");
const APP_URL = "http://localhost:3000";

interface User {
  email: string;
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: APP_URL,
    },
  });
  console.log(data);
  console.log(error);
}

// Inserting a user
async function insertUser(supabase, email) {
  const { data, error } = await supabase.from("users").insert([{ email }]);
}

// Selecting all users
async function selectUsers(supabase) {
  const { data, error } = await supabase.from("users").select("*");

  const users = data as User[];
  users.map((user) => console.log(user.email));
}

// Get User by Token
export async function getUser(accessToken: string) {
  const userResp = await supabase.auth.getUser(accessToken);

  const { data, error } = userResp;

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

export async function getGroups(userId) {
  const resp = await supabase
    .from("groups")
    .select("*")
    .eq("user_id", userId)
    .order("created_date", { ascending: false });

  if (resp.error) {
    console.error("Error getting groups:", resp.error);
    return null;
  }

  return resp.data;
}

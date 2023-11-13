import * as dotenv from "dotenv";
dotenv.config();

const { createClient } = require("@supabase/supabase-js");
const APP_URL = "http://localhost:3000";

interface User {
  email: string;
}

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

async function getUser(supabase, accessToken) {
  const userResp = await supabase.auth.getUser(accessToken);
  const { user, error } = userResp;

  if (user) {
    console.log(user);
  } else {
    console.log("Error");
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

getUser(
  supabase,
  "eyJhbGciOiJIUzI1NiIsImtpZCI6Im1DbWhuRHpRM1djOWE2OE0iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk5OTEwNDcyLCJpYXQiOjE2OTk5MDY4NzIsImlzcyI6Imh0dHBzOi8vdXduYWpvdGFzeGVpdHFpdWRjbmouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImVjZTg0ODkxLTQxZTQtNDg3Zi1hZWJhLWM3ZmI1YjE2OTIyNSIsImVtYWlsIjoid2lueHRvbkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE2OTk5MDY4NzJ9XSwic2Vzc2lvbl9pZCI6IjE4MTQ3MTU4LTNiZWItNDVlMi1iY2MyLWMxYjcyNTQ1ZDNiYiJ9.BGUIFweIQwZMMLGZTYdvP7lO684IiG3FyIuooA_l3nU"
);

// selectUsers(supabase);
// signInWithEmail("winxton@gmail.com");

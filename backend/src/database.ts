import * as dotenv from 'dotenv';
dotenv.config();

const { createClient } = require("@supabase/supabase-js");
const APP_URL = 'http://localhost:3000'

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

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
selectUsers(supabase);

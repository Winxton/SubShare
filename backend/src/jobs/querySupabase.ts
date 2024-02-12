// jobs/querySupabase.js
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function queryDatabase() {
  const { data, error } = await supabase.from("groups").select("*");

  if (error) {
    console.error("Error querying Supabase:", error);
    return;
  }

  console.log("Query result:", data);
}

queryDatabase();

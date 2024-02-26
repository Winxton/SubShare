const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const { createClient } = require("@supabase/supabase-js");

// Create the supabase client to connect to the DB
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = supabase;

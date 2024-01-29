// start.js
const dotenv = require("dotenv");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  
  // Your production-specific code here
  // Environment variables should already be set on the server
} else {
  // Your development or other environment code here
  // Load environment variables from the specified file
  const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });


  if (result.error) {
    throw result.error;
  }
}

// Start the React application
require("react-scripts/scripts/start");

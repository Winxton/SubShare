// start.js
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the specified file
const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (result.error) {
  throw result.error;
}

// Start the React application
require("react-scripts/scripts/start");

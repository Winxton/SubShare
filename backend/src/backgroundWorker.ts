const Bree = require("bree");
const path = require("path");
const { updateMemberBalancesOnBillingDate } = require("./repository/database");

const bree = new Bree({
  root: path.join(__dirname, ".."), // Assuming the service directory is one level above the repository directory
  jobs: [
    {
      name: "updateMonthlyBalance",
      path: "./src/repository/database.ts",
      cron: "*/5 * * * *", // Run every 5 sec
      func: () => {
        updateMemberBalancesOnBillingDate();
      },
    },
  ],
});
module.exports = bree;

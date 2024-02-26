const Bree = require("bree");

const bree = new Bree({
  root: false, // Assuming the service directory is one level above the repository directory
  jobs: [
    {
      name: "updateMonthlyBalance",
      path: "./src/jobs/updateMonthlyBalance.ts",
      cron: "*/1 * * * *", // Run every min
    },
  ],
});

module.exports = bree;

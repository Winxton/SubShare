const Bree = require("bree");

const bree = new Bree({
  root: false,
  jobs: [
    {
      name: "updateMonthlyBalance",
      path: `./src/jobs/updateMonthlyBalance.ts`,
      cron: "0 8 * * *", // Run at 8 AM every day
    },
  ],
});
module.exports = bree;

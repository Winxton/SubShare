// scheduler.ts
import Bree from "bree";

const bree = new Bree({
  // TypeScript can infer types here, so no changes needed for job configuration
  jobs: [
    {
      name: "querySupabase",
      // Ensure the path is correct and points to the compiled JavaScript file if your job is written in TypeScript
      path: `${__dirname}/jobs/querySupabase.ts`,
      interval: "5s", // This job will run every 5 seconds
    },
  ],
});

bree.start(); // Start the scheduler

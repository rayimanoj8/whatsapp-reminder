import express from "express";
import { config } from "./src/config.js";
import { initializeCronJob } from "./src/cron/scheduler.js";
import routes from "./src/routes/index.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(routes);

// Initialize cron job for daily reminders
initializeCronJob();

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});

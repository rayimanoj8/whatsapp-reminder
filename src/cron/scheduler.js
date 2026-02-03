import cron from "node-cron";
import { config } from "../config.js";
import { sendWorkStatusMessage } from "../services/whatsapp.js";

/**
 * Initialize cron job for daily work status reminder
 */
export function initializeCronJob() {
    // Schedule cron job to run every day at configured time
    cron.schedule(config.CRON_SCHEDULE, () => {
        console.log("⏰ Running scheduled job: Sending work status message...");
        sendWorkStatusMessage();
    }, {
        scheduled: true,
        timezone: config.TIMEZONE
    });

    console.log(`📅 Cron job scheduled: Work status message will be sent daily at ${config.CRON_SCHEDULE} (${config.TIMEZONE})`);
}

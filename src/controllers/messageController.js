import { storeMessage, getLatestMessage } from "../storage/messageStore.js";
import { processWebhookAndUpdateTimesheet } from "../services/timesheetService.js";

/**
 * Receive webhook POST handler
 */
export async function receiveWebhook(req, res) {
    try {
        // Store the latest message with timestamp
        const message = storeMessage(req.body);

        console.log("📩 Latest message received:", message);

        // Process webhook and update timesheet asynchronously
        // Don't wait for it to complete to send response quickly
        processWebhookAndUpdateTimesheet(message)
            .then((result) => {
                if (result.success) {
                    console.log("✅ Timesheet updated:", result.details);
                } else {
                    console.log("⚠️ Timesheet update skipped or failed:", result.message);
                }
            })
            .catch((error) => {
                console.error("❌ Error updating timesheet:", error);
            });

        res.status(200).json({
            success: true,
            message: "Webhook received successfully",
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({
            success: false,
            message: "Error processing webhook",
            error: error.message,
        });
    }
}

/**
 * Get latest message handler
 */
export function getLatestWebhook(req, res) {
    try {
        const latestMessage = getLatestMessage();

        if (latestMessage) {
            res.status(200).json({
                success: true,
                latestMessage: latestMessage,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "No messages received yet",
                latestMessage: null,
            });
        }
    } catch (error) {
        console.error("Error reading latest message:", error);
        res.status(500).json({
            success: false,
            message: "Error reading latest message",
            error: error.message,
        });
    }
}

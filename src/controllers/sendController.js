import { sendWorkStatusMessage } from "../services/whatsapp.js";

/**
 * Manual trigger to send work status message
 */
export async function sendMessage(req, res) {
    try {
        console.log("📤 Manual trigger: Sending work status message...");
        const result = await sendWorkStatusMessage();

        res.status(200).json({
            success: true,
            message: "Work status message sent successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send work status message",
            error: error.response?.data || error.message
        });
    }
}

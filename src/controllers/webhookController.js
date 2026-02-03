import { config } from "../config.js";

/**
 * Webhook verification handler (GET /webhook)
 */
export function verifyWebhook(req, res) {
    try {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === config.VERIFY_TOKEN) {
                // Respond with 200 OK and challenge token from the request
                console.log("✅ Webhook verified successfully!");
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                console.log("❌ Webhook verification failed!");
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error during webhook verification:", error);
        res.sendStatus(500);
    }
}

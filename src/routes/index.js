import express from "express";
import { verifyWebhook } from "../controllers/webhookController.js";
import { receiveWebhook, getLatestWebhook } from "../controllers/messageController.js";
import { sendMessage } from "../controllers/sendController.js";

const router = express.Router();

// Webhook verification (GET)
router.get("/webhook", verifyWebhook);

// Receive webhook notifications (POST)
router.post("/webhook", receiveWebhook);

// Get latest message
router.get("/webhooks", getLatestWebhook);

// Manual trigger to send message
router.get("/send-message", sendMessage);

// Health check
router.get("/", (req, res) => {
    res.send("WhatsApp Reminder Service Running");
});

export default router;

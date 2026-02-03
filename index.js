// index.js
import express from "express";

const app = express();
app.use(express.json());

// Store only the latest message from WhatsApp
let latestMessage = null;

// Webhook POST endpoint - receives WhatsApp notifications
app.post("/webhook", (req, res) => {
  try {
    // Store the latest message with timestamp
    latestMessage = {
      timestamp: new Date().toISOString(),
      data: req.body,
    };

    console.log("Latest message received:", latestMessage);

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
});

// GET endpoint - returns the latest message
app.get("/webhooks", (req, res) => {
  try {
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
});

app.get("/", (req, res) => {
  res.send("WhatsApp Reminder Service Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

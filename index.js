// index.js
import express from "express";

const app = express();
app.use(express.json());

// Store only the latest message from WhatsApp
let latestMessage = null;

// WhatsApp verify token - change this to your own secret token
const VERIFY_TOKEN = "iloveyoumanoj";

// Webhook verification endpoint (required by WhatsApp)
app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Respond with 200 OK and challenge token from the request
        console.log("Webhook verified successfully!");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        console.log("Webhook verification failed!");
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("Error during webhook verification:", error);
    res.sendStatus(500);
  }
});

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

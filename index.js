// index.js
import express from "express";

const app = express();
app.use(express.json());

// In-memory storage for webhooks (works on Vercel)
// Note: Data will be lost on redeployment, but persists during runtime
let webhookData = { webhooks: [] };

// Webhook POST endpoint - receives data and stores in memory
app.post("/webhook", (req, res) => {
  try {
    // Add new webhook data with timestamp
    const webhookEntry = {
      timestamp: new Date().toISOString(),
      data: req.body,
      headers: req.headers,
      query: req.query,
    };

    webhookData.webhooks.push(webhookEntry);

    res.status(200).json({
      success: true,
      message: "Webhook data saved successfully",
      entry: webhookEntry,
      total: webhookData.webhooks.length,
    });
  } catch (error) {
    console.error("Error saving webhook data:", error);
    res.status(500).json({
      success: false,
      message: "Error saving webhook data",
      error: error.message,
    });
  }
});

// GET endpoint - returns all webhook data from memory
app.get("/webhooks", (req, res) => {
  try {
    res.status(200).json({
      ...webhookData,
      total: webhookData.webhooks.length,
    });
  } catch (error) {
    console.error("Error reading webhook data:", error);
    res.status(500).json({
      success: false,
      message: "Error reading webhook data",
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

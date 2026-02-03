// index.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const WEBHOOK_FILE = path.join(process.cwd(), "webhooks.json");

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(WEBHOOK_FILE)) {
  fs.writeFileSync(WEBHOOK_FILE, JSON.stringify({ webhooks: [] }, null, 2));
}

// Webhook POST endpoint - receives data and writes to JSON file
app.post("/webhook", (req, res) => {
  try {
    // Read existing data
    const fileData = fs.readFileSync(WEBHOOK_FILE, "utf8");
    const jsonData = JSON.parse(fileData);

    // Add new webhook data with timestamp
    const webhookEntry = {
      timestamp: new Date().toISOString(),
      data: req.body,
      headers: req.headers,
      query: req.query,
    };

    jsonData.webhooks.push(webhookEntry);

    // Write back to file
    fs.writeFileSync(WEBHOOK_FILE, JSON.stringify(jsonData, null, 2));

    res.status(200).json({
      success: true,
      message: "Webhook data saved successfully",
      entry: webhookEntry,
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

// GET endpoint - returns all webhook data from JSON file
app.get("/webhooks", (req, res) => {
  try {
    const fileData = fs.readFileSync(WEBHOOK_FILE, "utf8");
    const jsonData = JSON.parse(fileData);

    res.status(200).json(jsonData);
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

// index.js
import express from "express";
import cron from "node-cron";
import axios from "axios";

const app = express();
app.use(express.json());

// Store only the latest message from WhatsApp
let latestMessage = null;

// WhatsApp verify token - change this to your own secret token
const VERIFY_TOKEN = "iloveyoumanoj";

// WhatsApp API Configuration
const WHATSAPP_API_URL = "https://graph.facebook.com/v24.0/919127057960368/messages";
const WHATSAPP_TOKEN = "EAAMe53a7MrEBQjIEBddIS3FNp8NUfXc61f2bDaLBuLFi1IAvMGALHqZCTYkUTYF5ZBWZCjB5i3okGKYnAAmdAzHtZBNnCbZCIhbPHEHefXhXRDPFeoJRtDxc2eJnnTx94iGbfF6KZAQZAlEIOWZBkGdqrRyl6QERCN2RQI6Y29d6godMkvSILqlJugdMipqvma3oNRpbfrtX4NlEzhkbYH9fuKZBsivlrTsHZBMa4CrQRXBqHN2B9d1cQKAigwqLSZA3b9f0rWENneZAkYPZCIxgqo5jJsmTA";
const RECIPIENT_PHONE = "916304742913";

// Function to send WhatsApp message
async function sendWorkStatusMessage() {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: RECIPIENT_PHONE,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: "Good morning 👋\nPlease select your work status for today"
          },
          action: {
            button: "Choose option",
            sections: [
              {
                title: "Work status",
                rows: [
                  {
                    id: "WFH",
                    title: "Work from home",
                    description: "Remote work"
                  },
                  {
                    id: "WFO",
                    title: "Work from office",
                    description: "Office attendance"
                  },
                  {
                    id: "HALF_DAY",
                    title: "Half day leave",
                    description: "Working half day"
                  },
                  {
                    id: "LEAVE",
                    title: "Leave today",
                    description: "On leave"
                  }
                ]
              }
            ]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Work status message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error.response?.data || error.message);
    throw error;
  }
}

// Schedule cron job to run every day at 10:30 AM IST
// Cron format: minute hour day month weekday
// 30 10 * * * = At 10:30 AM every day
cron.schedule("30 10 * * *", () => {
  console.log("⏰ Running scheduled job: Sending work status message...");
  sendWorkStatusMessage();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // IST timezone
});

console.log("📅 Cron job scheduled: Work status message will be sent daily at 10:30 AM IST");

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

// Manual trigger endpoint for testing
app.get("/send-message", async (req, res) => {
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
});

app.get("/", (req, res) => {
  res.send("WhatsApp Reminder Service Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

# WhatsApp Work Status Reminder

An Express.js server that automatically sends daily WhatsApp messages asking for work status and receives webhook notifications.

## Features

- ✅ **Automated Daily Messages** - Sends work status reminder every day at 10:30 AM IST
- ✅ **Automatic Timesheet Filling** - Automatically updates Google Sheets based on user replies
- ✅ WhatsApp webhook verification endpoint
- ✅ Receives and stores the latest WhatsApp message
- ✅ GET endpoint to retrieve the latest message
- ✅ Manual trigger endpoint for testing
- ✅ Deployed on Vercel (serverless-compatible)

## API Endpoints

### 1. Webhook Verification (GET)
**Endpoint:** `GET /webhook`

Used by WhatsApp to verify your webhook URL.

**Query Parameters:**
- `hub.mode` - Should be "subscribe"
- `hub.verify_token` - Your verify token (must match `VERIFY_TOKEN` in code)
- `hub.challenge` - Challenge string from WhatsApp

**Example:**
```bash
curl "https://your-app.vercel.app/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token_here&hub.challenge=test123"
```

**Response:** Returns the challenge string if verification succeeds

---

### 2. Receive Webhook (POST)
**Endpoint:** `POST /webhook`

Receives WhatsApp notifications and stores the latest message.

**Example:**
```bash
curl -X POST https://your-app.vercel.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "whatsapp", "message": "Hello!", "sender": "+1234567890"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook received successfully"
}
```

---

### 3. Get Latest Message (GET)
**Endpoint:** `GET /webhooks`

Returns the most recent message received from WhatsApp.

**Example:**
```bash
curl https://your-app.vercel.app/webhooks
```

**Response:**
```json
{
  "success": true,
  "latestMessage": {
    "timestamp": "2026-02-03T18:32:43.479Z",
    "data": {
      "from": "whatsapp",
      "message": "Hello!",
      "sender": "+1234567890"
    }
  }
}
```

---

### 4. Send Message Manually (GET)
**Endpoint:** `GET /send-message`

Manually trigger the work status message (for testing without waiting for the scheduled time).

**Example:**
```bash
curl https://your-app.vercel.app/send-message
```

**Response:**
```json
{
  "success": true,
  "message": "Work status message sent successfully",
  "data": {
    "messaging_product": "whatsapp",
    "contacts": [...],
    "messages": [...]
  }
}
```

---

## Automated Daily Messages

The server automatically sends a WhatsApp interactive message every day at **10:30 AM IST** asking for work status with the following options:

- 🏠 Work from home
- 🏢 Work from office  
- ⏰ Half day leave
- 🌴 Leave today

### Cron Schedule

The cron job is configured in `index.js`:
```javascript
cron.schedule("30 10 * * *", () => {
  sendWorkStatusMessage();
}, {
  timezone: "Asia/Kolkata"
});
```

To change the schedule time, modify the cron expression:
- Format: `minute hour day month weekday`
- Example: `"0 9 * * *"` = 9:00 AM daily
- Example: `"30 14 * * 1-5"` = 2:30 PM on weekdays only

---

## Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd whatsapp-TF
```

### 2. Install dependencies
```bash
npm install
```

### 3. Update the verify token
Edit `index.js` and change the `VERIFY_TOKEN` to your own secret token:
```javascript
const VERIFY_TOKEN = "your_secret_token_here";
```

### 4. Run locally
```bash
node index.js
```

Server will run on `http://localhost:3000`

---

## WhatsApp Setup

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a WhatsApp Business App
3. In the WhatsApp settings, add your webhook URL:
   - **Callback URL:** `https://your-app.vercel.app/webhook`
   - **Verify Token:** Your `VERIFY_TOKEN` value
4. Subscribe to webhook events

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy!

Your webhook will be available at: `https://your-app.vercel.app/webhook`

---

## Environment Variables (Optional)

For production, you can use environment variables instead of hardcoding the verify token:

```javascript
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "your_verify_token_here";
```

Then set the environment variable in Vercel dashboard.

---

## Notes

- The server uses **in-memory storage**, so data will be lost on redeployment
- Only the **latest message** is stored (previous messages are overwritten)
- For persistent storage, consider using a database like MongoDB, PostgreSQL, or Vercel KV

---

## Google Sheets Integration

The system automatically fills a Google Sheets timesheet based on user replies to the WhatsApp messages.

### How It Works

1. **User Receives Message**: Every day at 10:30 AM, users receive a WhatsApp message asking for their work status
2. **User Replies**: User selects an option (e.g., "Work from home", "Office", "Leave")
3. **Webhook Processes Reply**: The webhook receives the reply and extracts:
   - User's name
   - Selected status
   - Current date
4. **Sheet Updated**: The system automatically updates the Google Sheet with the appropriate code

### Status Codes

| Status | Code | Description |
|--------|------|-------------|
| Work from home | H | Working from home |
| Office | W | Working from office |
| Leave | L | On leave |
| Half day | HD | Half day work |
| Sick leave | SL | Sick leave |
| Casual leave | CL | Casual leave |
| Holiday | HO | Public holiday |
| Absent | A | Absent |

### Sheet Structure

The Google Sheet should have:
- **Column A**: Employee ID
- **Column B**: Name
- **Columns C-AF**: Days 1-31 of the month

### Setup Google Sheets

1. Create a Google Cloud project and enable Google Sheets API
2. Create a service account and download the credentials
3. Save credentials as `service-account.json` in the project root
4. Share your Google Sheet with the service account email
5. Update the spreadsheet ID in `src/services/timesheetService.js`

For detailed setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

### Testing

Test the webhook processing with:
```bash
node test-webhook-processing.js
```

For more details, see [WEBHOOK_INTEGRATION.md](WEBHOOK_INTEGRATION.md)

---

## License

MIT

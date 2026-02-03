# WhatsApp Webhook Server

A simple Express.js server to receive WhatsApp webhook notifications and store the latest message.

## Features

- ✅ WhatsApp webhook verification endpoint
- ✅ Receives and stores the latest WhatsApp message
- ✅ GET endpoint to retrieve the latest message
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

## License

MIT

# Google Sheets Integration Guide

This guide will help you set up Google Sheets API integration to update cells programmatically.

## 🚀 Quick Start

Once configured, you can update Google Sheets cells with three simple inputs:
- **Row**: Row number (e.g., 1, 2, 3...)
- **Column**: Column letter (e.g., A, B, C...) or number (1, 2, 3...)
- **Value**: The value to insert

## 📋 Prerequisites

1. A Google Cloud Project
2. Google Sheets API enabled
3. A Service Account with credentials
4. Your Google Spreadsheet ID

---

## 🔧 Setup Instructions

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "WhatsApp Sheet Integration")
4. Click **"Create"**

### Step 2: Enable Google Sheets API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Enter a name (e.g., "sheet-updater")
4. Click **"Create and Continue"**
5. Skip the optional steps and click **"Done"**

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **JSON** format
5. Click **"Create"** - a JSON file will download

**⚠️ Keep this file secure! It contains sensitive credentials.**

### Step 5: Share Your Google Sheet

1. Open your Google Sheet
2. Click the **"Share"** button
3. Copy the **service account email** from the JSON file (looks like: `sheet-updater@project-id.iam.gserviceaccount.com`)
4. Paste it in the share dialog
5. Give it **"Editor"** access
6. Click **"Send"**

### Step 6: Get Your Spreadsheet ID

Your spreadsheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

Copy the `SPREADSHEET_ID_HERE` part.

### Step 7: Configure Environment Variables

1. Create a `.env` file in your project root (or use your hosting platform's environment variables)
2. Add the following:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_spreadsheet_id_from_step_6
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"..."}
```

For `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`:
- Open the JSON file you downloaded in Step 4
- Copy the **entire contents** (it should be a single line JSON object)
- Paste it as the value

**Example:**
```bash
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"sheet-updater@my-project.iam.gserviceaccount.com","client_id":"123456789"}
```

---

## 📡 API Endpoints

### 1. Update a Single Cell

**Endpoint:** `POST /sheet/update`

**Request Body:**
```json
{
  "row": 1,
  "column": "A",
  "value": "Hello World"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/sheet/update \
  -H "Content-Type: application/json" \
  -d '{"row": 1, "column": "A", "value": "Hello World"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Cell updated successfully",
  "data": {
    "success": true,
    "range": "A1",
    "updatedCells": 1,
    "updatedRange": "A1"
  }
}
```

**Column Options:**
- Use letters: `"A"`, `"B"`, `"AA"`, `"AB"`, etc.
- Use numbers: `1`, `2`, `27`, `28`, etc. (1=A, 2=B, 27=AA, 28=AB)

---

### 2. Update Multiple Cells (Batch)

**Endpoint:** `POST /sheet/update-batch`

**Request Body:**
```json
{
  "updates": [
    { "row": 1, "column": "A", "value": "Name" },
    { "row": 1, "column": "B", "value": "Age" },
    { "row": 2, "column": "A", "value": "John" },
    { "row": 2, "column": "B", "value": "25" }
  ]
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/sheet/update-batch \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"row": 1, "column": "A", "value": "Name"},
      {"row": 1, "column": "B", "value": "Age"}
    ]
  }'
```

---

### 3. Read a Cell Value

**Endpoint:** `GET /sheet/read?row=1&column=A`

**Example with cURL:**
```bash
curl "http://localhost:3000/sheet/read?row=1&column=A"
```

**Response:**
```json
{
  "success": true,
  "message": "Cell read successfully",
  "data": {
    "success": true,
    "range": "A1",
    "value": "Hello World"
  }
}
```

---

## 🧪 Testing

### Test with Postman or Thunder Client

1. **Update Cell A1:**
   - Method: `POST`
   - URL: `http://localhost:3000/sheet/update`
   - Body (JSON):
     ```json
     {
       "row": 1,
       "column": "A",
       "value": "Test Value"
     }
     ```

2. **Read Cell A1:**
   - Method: `GET`
   - URL: `http://localhost:3000/sheet/read?row=1&column=A`

3. **Batch Update:**
   - Method: `POST`
   - URL: `http://localhost:3000/sheet/update-batch`
   - Body (JSON):
     ```json
     {
       "updates": [
         {"row": 1, "column": 1, "value": "Header 1"},
         {"row": 1, "column": 2, "value": "Header 2"},
         {"row": 2, "column": 1, "value": "Data 1"},
         {"row": 2, "column": 2, "value": "Data 2"}
       ]
     }
     ```

---

## 🎯 Use Cases

### 1. Log WhatsApp Responses to Sheets

Automatically save WhatsApp message responses to a Google Sheet for tracking.

### 2. Create Daily Reports

Update cells with daily work status, attendance, or other metrics.

### 3. Build a Dashboard

Use Google Sheets as a simple database and create charts/dashboards.

### 4. Automate Data Entry

Replace manual data entry with API calls.

---

## 🔒 Security Best Practices

1. **Never commit** the service account JSON file to Git
2. **Never expose** the credentials in client-side code
3. **Use environment variables** for all sensitive data
4. **Limit service account permissions** to only what's needed
5. **Rotate credentials** periodically

---

## 🐛 Troubleshooting

### Error: "Failed to initialize Google Sheets API"
- Check that `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` is valid JSON
- Ensure the JSON is properly formatted (no extra quotes or escaping issues)

### Error: "The caller does not have permission"
- Make sure you shared the Google Sheet with the service account email
- Verify the service account has "Editor" access

### Error: "Spreadsheet not found"
- Double-check the `GOOGLE_SHEET_ID` in your `.env` file
- Ensure the spreadsheet exists and is accessible

### Error: "Invalid credentials"
- Regenerate the service account key
- Make sure you copied the entire JSON content

---

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)
- [A1 Notation Guide](https://developers.google.com/sheets/api/guides/concepts#cell)

---

## 💡 Tips

- **Column Numbers:** 1=A, 2=B, ..., 26=Z, 27=AA, 28=AB, etc.
- **Formulas:** You can insert formulas as values (e.g., `"=SUM(A1:A10)"`)
- **Data Types:** The API auto-detects numbers, dates, and booleans
- **Batch Updates:** More efficient than multiple single updates

---

## 🎉 You're All Set!

Your Google Sheets integration is ready. Start updating cells with simple API calls!

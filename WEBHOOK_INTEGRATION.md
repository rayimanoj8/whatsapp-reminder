# WhatsApp Webhook to Google Sheets Integration

This document explains how the WhatsApp webhook integration automatically fills the timesheet in Google Sheets based on user replies.

## Overview

When a user replies to a WhatsApp message with their work status (e.g., "Work from home", "Office", etc.), the webhook receives the response and automatically updates the Google Sheet with the appropriate code for today's date.

## Webhook Response Structure

The webhook receives a JSON response in the following format:

```json
{
  "success": true,
  "latestMessage": {
    "timestamp": "2026-02-06T18:38:03.980Z",
    "data": {
      "object": "whatsapp_business_account",
      "entry": [
        {
          "id": "874445508925764",
          "changes": [
            {
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "15551760287",
                  "phone_number_id": "919127057960368"
                },
                "contacts": [
                  {
                    "profile": {
                      "name": "Manoj Rayi"
                    },
                    "wa_id": "916304742913"
                  }
                ],
                "messages": [
                  {
                    "from": "916304742913",
                    "id": "wamid.HBgMOTE2MzA0NzQyOTEzFQIAEhggQUNCOTQ4REMxRUVGREQxNTUxNjQwMjVDMEM5NkFBQzkA",
                    "timestamp": "1770403081",
                    "type": "interactive",
                    "interactive": {
                      "type": "list_reply",
                      "list_reply": {
                        "id": "WFH",
                        "title": "Work from home",
                        "description": "Remote work"
                      }
                    }
                  }
                ]
              },
              "field": "messages"
            }
          ]
        }
      ]
    }
  }
}
```

## Status Code Mapping

The system maps WhatsApp reply IDs to timesheet codes:

| Reply ID | Title | Timesheet Code | Description |
|----------|-------|----------------|-------------|
| WFH | Work from home | H | Working from home |
| OFFICE | Office | W | Working from office |
| LEAVE | Leave | L | On leave |
| HALF_DAY | Half day | HD | Half day work |
| SICK_LEAVE | Sick leave | SL | Sick leave |
| CASUAL_LEAVE | Casual leave | CL | Casual leave |
| HOLIDAY | Holiday | HO | Public holiday |
| ABSENT | Absent | A | Absent |

## Google Sheet Structure

The Google Sheet is expected to have the following structure:

| Column | Content |
|--------|---------|
| A | Employee ID |
| B | Name |
| C | Day 1 |
| D | Day 2 |
| E | Day 3 |
| ... | ... |
| AF | Day 31 |

## How It Works

1. **Webhook Receives Message**: When a user replies to a WhatsApp message, the webhook endpoint (`POST /webhook`) receives the response.

2. **Extract User Information**: The system extracts:
   - User's name from `contacts[0].profile.name`
   - Reply ID from `messages[0].interactive.list_reply.id`
   - Reply title from `messages[0].interactive.list_reply.title`

3. **Find User Row**: The system searches for the user's name in column B (Name column) of the Google Sheet.

4. **Calculate Column**: Based on today's date (day of the month), the system calculates which column to update:
   - Day 1 → Column C (column 3)
   - Day 2 → Column D (column 4)
   - Day N → Column N+2

5. **Update Cell**: The system updates the cell at the intersection of the user's row and today's column with the appropriate timesheet code.

## API Endpoints

### POST /webhook
Receives WhatsApp webhook messages and processes them.

**Request**: WhatsApp webhook payload (see structure above)

**Response**:
```json
{
  "success": true,
  "message": "Webhook received successfully"
}
```

### GET /webhook/latest
Retrieves the latest webhook message received.

**Response**:
```json
{
  "success": true,
  "latestMessage": {
    "timestamp": "2026-02-06T18:38:03.980Z",
    "data": { ... }
  }
}
```

## Implementation Files

- **`src/services/timesheetService.js`**: Core service that processes webhooks and updates the Google Sheet
- **`src/controllers/messageController.js`**: Webhook endpoint handlers
- **`src/routes/index.js`**: API route definitions

## Testing

Use the test script to verify the webhook processing:

```bash
node test-webhook-processing.js
```

This will:
1. Send a sample webhook payload
2. Process the webhook
3. Update the Google Sheet
4. Display the result

## Example Output

When a webhook is successfully processed:

```
📝 Processing webhook for timesheet update...
📋 User: Manoj Rayi
📋 Reply: Work from home (WFH)
📋 Timesheet code: H
📊 Using sheet: Feb
✅ Found "Manoj Rayi" at Row: 2
📅 Today is day 7 of the month
📍 Updating Row: 2, Column: 9
Updating range: Feb!I2 with value: H
✅ Cell updated successfully

✅ Timesheet updated successfully
```

## Error Handling

The system handles various error cases:

- **User not found**: If the user's name is not in the sheet, an error is logged
- **Invalid webhook data**: If required fields are missing, an error is returned
- **Unknown reply ID**: If the reply ID is not in the STATUS_MAP, an error is thrown
- **Google Sheets API errors**: Any API errors are caught and logged

## Adding New Status Codes

To add a new status code:

1. Open `src/services/timesheetService.js`
2. Add a new entry to the `STATUS_MAP` object:
   ```javascript
   const STATUS_MAP = {
       // ... existing entries
       "NEW_STATUS": "NS",  // New status code
   };
   ```
3. Make sure the WhatsApp interactive list includes this new option with the same ID

## Configuration

The Google Sheet ID is configured in `src/services/timesheetService.js`:

```javascript
const spreadsheetId = "1xgm3gZgN7kOrFkrnI9T1-ozejMe0NDx_bOuLswxRtRE";
```

To use a different sheet, update this value.

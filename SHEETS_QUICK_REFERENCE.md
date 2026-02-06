# 📊 Google Sheets Integration - Quick Reference

## 🎯 What You Can Do

Fill Google Sheets cells by providing:
1. **Row** - Row number (1, 2, 3, ...)
2. **Column** - Column letter (A, B, C, ...) or number (1, 2, 3, ...)
3. **Value** - The content to insert

---

## 🚀 Quick Start (3 Steps)

### 1. Set Up Google Sheets API
```bash
# Follow the detailed guide
cat GOOGLE_SHEETS_SETUP.md
```

### 2. Configure Environment Variables
```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

### 3. Start the Server
```bash
npm start
```

---

## 📡 API Usage

### Update a Cell (cURL)
```bash
curl -X POST http://localhost:3000/sheet/update \
  -H "Content-Type: application/json" \
  -d '{
    "row": 1,
    "column": "A",
    "value": "Hello World"
  }'
```

### Update a Cell (JavaScript/Fetch)
```javascript
fetch('http://localhost:3000/sheet/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    row: 1,
    column: 'A',
    value: 'Hello World'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Update a Cell (Python)
```python
import requests

response = requests.post('http://localhost:3000/sheet/update', json={
    'row': 1,
    'column': 'A',
    'value': 'Hello World'
})

print(response.json())
```

---

## 🌐 Web Interface

Open in your browser:
```
http://localhost:3000/sheet-updater.html
```

A beautiful web interface to test updates without writing code!

---

## 🧪 Test the Integration

```bash
# Run automated tests
npm run test-sheets
```

This will:
- ✅ Update cell A1
- ✅ Read cell A1
- ✅ Create a sample table with batch update

---

## 📝 Column Reference

| Number | Letter | Number | Letter | Number | Letter |
|--------|--------|--------|--------|--------|--------|
| 1      | A      | 10     | J      | 19     | S      |
| 2      | B      | 11     | K      | 20     | T      |
| 3      | C      | 12     | L      | 21     | U      |
| 4      | D      | 13     | M      | 22     | V      |
| 5      | E      | 14     | N      | 23     | W      |
| 6      | F      | 15     | O      | 24     | X      |
| 7      | G      | 16     | P      | 25     | Y      |
| 8      | H      | 17     | Q      | 26     | Z      |
| 9      | I      | 18     | R      | 27     | AA     |

---

## 💡 Examples

### Example 1: Update Cell B5
```json
{
  "row": 5,
  "column": "B",
  "value": "Sales Data"
}
```

### Example 2: Insert Formula
```json
{
  "row": 10,
  "column": "C",
  "value": "=SUM(C1:C9)"
}
```

### Example 3: Batch Update (Create Header Row)
```json
{
  "updates": [
    {"row": 1, "column": "A", "value": "Date"},
    {"row": 1, "column": "B", "value": "Status"},
    {"row": 1, "column": "C", "value": "Notes"}
  ]
}
```

---

## 🔗 All Endpoints

| Method | Endpoint              | Purpose                  |
|--------|-----------------------|--------------------------|
| POST   | `/sheet/update`       | Update single cell       |
| POST   | `/sheet/update-batch` | Update multiple cells    |
| GET    | `/sheet/read`         | Read cell value          |

---

## ⚡ Common Use Cases

### 1. Log WhatsApp Messages
Automatically save incoming WhatsApp messages to a sheet for tracking.

### 2. Daily Status Tracker
Update cells with daily work status (WFH, Office, Leave).

### 3. Automated Reports
Generate reports by updating cells with calculated data.

### 4. Data Collection
Collect form responses or survey data into organized sheets.

---

## 🛠️ Troubleshooting

### "Failed to initialize Google Sheets API"
→ Check your `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` is valid JSON

### "The caller does not have permission"
→ Share your Google Sheet with the service account email

### "Spreadsheet not found"
→ Verify `GOOGLE_SHEET_ID` is correct

---

## 📚 More Information

- **Full Setup Guide**: `GOOGLE_SHEETS_SETUP.md`
- **Main README**: `README.md`
- **Test Script**: `test-sheets.js`

---

## 🎉 You're Ready!

Start updating your Google Sheets programmatically! 🚀

import { google } from "googleapis";

/**
 * Maps WhatsApp reply IDs to timesheet codes
 */
const STATUS_MAP = {
    "WFH": "O",           // Work from home
    "OFFICE": "W",        // Office
    "LEAVE": "L",         // Leave
    "HALF_DAY": "HL",     // Half day
};

/**
 * Get Google Sheets client
 */
async function getSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "service-account.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}

/**
 * Find the row number for a given name in the sheet
 */
async function findNameRow(sheets, spreadsheetId, sheetName, name) {
    try {
        // Get all data from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            console.log("No data found in the sheet.");
            return null;
        }

        // Search for the name in the second column (index 1) where names are stored
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const cellValue = row[1]; // Second column (B)

            // Check if the cell contains the name (case-insensitive)
            if (cellValue && cellValue.toString().toLowerCase().includes(name.toLowerCase())) {
                console.log(`✅ Found "${name}" at Row: ${rowIndex + 1}`);
                return rowIndex + 1; // 1-indexed
            }
        }

        console.log(`❌ Name "${name}" not found in the sheet.`);
        return null;
    } catch (error) {
        console.error("Error finding name row:", error.message);
        throw error;
    }
}

/**
 * Convert column number to letter (A, B, C, etc.)
 */
function columnToLetter(col) {
    let letter = "";
    while (col > 0) {
        let temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }
    return letter;
}

/**
 * Update a cell in the Google Sheet
 */
async function updateCell(sheets, spreadsheetId, sheetName, row, column, value) {
    try {
        const range = `${sheetName}!${columnToLetter(column)}${row}`;
        console.log(`Updating range: ${range} with value: ${value}`);

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [[value]],
            },
        });

        console.log("✅ Cell updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating cell:", error.message);
        throw error;
    }
}

/**
 * Process WhatsApp webhook and update timesheet
 */
export async function processWebhookAndUpdateTimesheet(webhookData) {
    try {
        console.log("📝 Processing webhook for timesheet update...");

        // Extract data from webhook
        const entry = webhookData?.data?.entry?.[0];
        if (!entry) {
            throw new Error("Invalid webhook data: missing entry");
        }

        const change = entry.changes?.[0];
        if (!change) {
            throw new Error("Invalid webhook data: missing changes");
        }

        const value = change.value;
        const messages = value.messages?.[0];
        const contacts = value.contacts?.[0];

        if (!messages || !contacts) {
            throw new Error("Invalid webhook data: missing messages or contacts");
        }

        // Extract user name
        const userName = contacts.profile?.name;
        if (!userName) {
            throw new Error("Invalid webhook data: missing user name");
        }

        // Extract interactive reply
        if (messages.type !== "interactive") {
            console.log("⚠️ Message type is not interactive, skipping timesheet update");
            return {
                success: false,
                message: "Message type is not interactive",
            };
        }

        const listReply = messages.interactive?.list_reply;
        if (!listReply) {
            throw new Error("Invalid webhook data: missing list reply");
        }

        const replyId = listReply.id;
        const replyTitle = listReply.title;

        console.log(`📋 User: ${userName}`);
        console.log(`📋 Reply: ${replyTitle} (${replyId})`);

        // Map reply ID to timesheet code
        const timesheetCode = STATUS_MAP[replyId];
        if (!timesheetCode) {
            throw new Error(`Unknown reply ID: ${replyId}`);
        }

        console.log(`📋 Timesheet code: ${timesheetCode}`);

        // Get Google Sheets client
        const sheets = await getSheetsClient();
        const spreadsheetId = "1xgm3gZgN7kOrFkrnI9T1-ozejMe0NDx_bOuLswxRtRE";

        // Get sheet metadata
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetName = metadata.data.sheets[0].properties.title;
        console.log(`📊 Using sheet: ${sheetName}`);

        // Find the row for the user
        const row = await findNameRow(sheets, spreadsheetId, sheetName, userName);
        if (!row) {
            throw new Error(`User "${userName}" not found in the sheet`);
        }

        // Calculate column based on today's date
        const today = new Date();
        const dayOfMonth = today.getDate(); // Returns 1-31

        // Sheet structure:
        // Column 1 (A) = Employee ID or similar
        // Column 2 (B) = "Name"
        // Column 3 (C) = Day "1"
        // Column 4 (D) = Day "2"
        // So for day N, column = N + 2
        const column = dayOfMonth + 2;

        console.log(`📅 Today is day ${dayOfMonth} of the month`);
        console.log(`📍 Updating Row: ${row}, Column: ${column}`);

        // Update the cell
        await updateCell(sheets, spreadsheetId, sheetName, row, column, timesheetCode);

        return {
            success: true,
            message: "Timesheet updated successfully",
            details: {
                userName,
                status: replyTitle,
                code: timesheetCode,
                row,
                column,
                day: dayOfMonth,
            },
        };
    } catch (error) {
        console.error("❌ Error processing webhook:", error.message);
        return {
            success: false,
            message: "Error processing webhook",
            error: error.message,
        };
    }
}

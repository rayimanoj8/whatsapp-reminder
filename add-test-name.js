import { google } from "googleapis";

async function addNameToSheet() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "service-account.json",
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = "1xgm3gZgN7kOrFkrnI9T1-ozejMe0NDx_bOuLswxRtRE";

        // Get sheet metadata
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetName = metadata.data.sheets[0].properties.title;
        console.log(`📊 Sheet name: ${sheetName}\n`);

        // Get current data to find the next empty row
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });

        const rows = response.data.values || [];
        const nextRow = rows.length + 1;

        console.log(`Adding "Manoj Rayi" to row ${nextRow}, column B (Name column)`);

        // Add the name to column B (second column)
        const range = `${sheetName}!B${nextRow}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [["Manoj Rayi"]],
            },
        });

        console.log(`✅ Successfully added "Manoj Rayi" to row ${nextRow}`);

        // Also add an employee ID in column A
        const idRange = `${sheetName}!A${nextRow}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: idRange,
            valueInputOption: "RAW",
            requestBody: {
                values: [["EMP001"]],
            },
        });

        console.log(`✅ Successfully added employee ID "EMP001" to row ${nextRow}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

addNameToSheet();

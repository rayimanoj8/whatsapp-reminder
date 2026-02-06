import { google } from "googleapis";

async function checkSheetNames() {
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

        // Get all data from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            console.log("No data found in the sheet.");
            return;
        }

        console.log("📋 Names in the first column:");
        console.log("================================");
        rows.forEach((row, index) => {
            if (row[0]) {
                console.log(`Row ${index + 1}: "${row[0]}"`);
            }
        });

        console.log("\n📅 First row (headers):");
        console.log("================================");
        if (rows[0]) {
            rows[0].forEach((cell, index) => {
                console.log(`Column ${index + 1}: "${cell}"`);
            });
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkSheetNames();

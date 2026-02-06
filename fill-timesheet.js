import { google } from "googleapis";


async function updateSheet(row, column, value) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "service-account.json",
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = "1xgm3gZgN7kOrFkrnI9T1-ozejMe0NDx_bOuLswxRtRE";

        // First, get the spreadsheet metadata to check sheet names
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        console.log("Available sheets:");
        metadata.data.sheets.forEach(sheet => {
            console.log(`  - ${sheet.properties.title}`);
        });

        // Use the first sheet's actual name
        const sheetName = metadata.data.sheets[0].properties.title;
        console.log(`\nUsing sheet: ${sheetName}`);

        // Convert column number to letter
        function columnToLetter(col) {
            let letter = "";
            while (col > 0) {
                let temp = (col - 1) % 26;
                letter = String.fromCharCode(temp + 65) + letter;
                col = (col - temp - 1) / 26;
            }
            return letter;
        }

        const range = `${sheetName}!${columnToLetter(column)}${row}`;
        console.log(`Updating range: ${range}`);

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [[value]],
            },
        });

        console.log("✅ Updated successfully");
    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

async function findTextLocation(searchText) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "service-account.json",
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = "1xgm3gZgN7kOrFkrnI9T1-ozejMe0NDx_bOuLswxRtRE";

        // Get the spreadsheet metadata to check sheet names
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        // Use the first sheet's actual name
        const sheetName = metadata.data.sheets[0].properties.title;
        console.log(`Searching in sheet: ${sheetName}`);

        // Get all data from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName, // Gets all data from the sheet
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            console.log("No data found in the sheet.");
            return null;
        }

        // Search for the text
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cellValue = row[colIndex];

                // Check if the cell contains the search text (case-sensitive)
                if (cellValue && cellValue.toString().includes(searchText)) {
                    const location = {
                        row: rowIndex + 1, // 1-indexed
                        column: colIndex + 1, // 1-indexed
                        value: cellValue
                    };

                    console.log(`✅ Found "${searchText}" at Row: ${location.row}, Column: ${location.column}`);
                    console.log(`   Cell value: "${location.value}"`);

                    return location;
                }
            }
        }

        console.log(`❌ Text "${searchText}" not found in the sheet.`);
        return null;

    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

async function getLocationByNameAndDate(name) {
    try {
        // Find the row where the name is located
        const nameLocation = await findTextLocation(name);

        if (!nameLocation) {
            console.log(`❌ Name "${name}" not found in the sheet.`);
            return null;
        }

        // Get today's date (day of the month)
        const today = new Date();
        const dayOfMonth = today.getDate(); // Returns 1-31

        // Calculate column: 
        // Column 1 = "Name"
        // Column 2 = Day "1"
        // Column 3 = Day "2"
        // So for day N, column = N + 1
        const column = dayOfMonth + 2;

        const result = {
            row: nameLocation.row,
            column: column,
            day: dayOfMonth
        };

        console.log(`\n📍 Location for "${name}" on day ${dayOfMonth}:`);
        console.log(`   Row: ${result.row}, Column: ${result.column}`);

        return result;

    } catch (error) {
        console.error("❌ Error:", error.message);
        throw error;
    }
}


// Example usage:
const location = await getLocationByNameAndDate("Manoj Rayi");
updateSheet(location.row, location.column, "H");
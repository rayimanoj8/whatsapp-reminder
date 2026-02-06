import { google } from 'googleapis';
import config from '../config.js';

/**
 * Initialize Google Sheets API client
 */
const getGoogleSheetsClient = () => {
    try {
        // Parse the service account credentials from environment variable
        const credentials = JSON.parse(config.googleSheets.credentials);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        console.error('Error initializing Google Sheets client:', error.message);
        throw new Error('Failed to initialize Google Sheets API');
    }
};

/**
 * Convert column number to letter (1 -> A, 2 -> B, 27 -> AA, etc.)
 */
const columnNumberToLetter = (columnNumber) => {
    let letter = '';
    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return letter;
};

/**
 * Update a cell in Google Sheets
 * @param {number} row - Row number (1-indexed)
 * @param {number|string} column - Column number (1-indexed) or letter (A, B, C, etc.)
 * @param {string} value - Value to set
 * @returns {Promise<Object>} - Update result
 */
export const updateCell = async (row, column, value) => {
    try {
        const sheets = getGoogleSheetsClient();
        const spreadsheetId = config.googleSheets.spreadsheetId;

        // Convert column to letter if it's a number
        let columnLetter;
        if (typeof column === 'number') {
            columnLetter = columnNumberToLetter(column);
        } else {
            columnLetter = column.toString().toUpperCase();
        }

        // Construct the A1 notation (e.g., "A1", "B5", "AA10")
        const range = `${columnLetter}${row}`;

        // Update the cell
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED', // Allows formulas and auto-formatting
            requestBody: {
                values: [[value]],
            },
        });

        return {
            success: true,
            range,
            updatedCells: response.data.updatedCells,
            updatedRange: response.data.updatedRange,
        };
    } catch (error) {
        console.error('Error updating Google Sheet:', error.message);
        throw error;
    }
};

/**
 * Update multiple cells in Google Sheets
 * @param {Array<{row: number, column: number|string, value: string}>} updates - Array of updates
 * @returns {Promise<Object>} - Batch update result
 */
export const updateMultipleCells = async (updates) => {
    try {
        const sheets = getGoogleSheetsClient();
        const spreadsheetId = config.googleSheets.spreadsheetId;

        // Prepare batch update data
        const data = updates.map(({ row, column, value }) => {
            let columnLetter;
            if (typeof column === 'number') {
                columnLetter = columnNumberToLetter(column);
            } else {
                columnLetter = column.toString().toUpperCase();
            }

            return {
                range: `${columnLetter}${row}`,
                values: [[value]],
            };
        });

        // Perform batch update
        const response = await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data,
            },
        });

        return {
            success: true,
            totalUpdatedCells: response.data.totalUpdatedCells,
            totalUpdatedRows: response.data.totalUpdatedRows,
            responses: response.data.responses,
        };
    } catch (error) {
        console.error('Error batch updating Google Sheet:', error.message);
        throw error;
    }
};

/**
 * Read a cell value from Google Sheets
 * @param {number} row - Row number (1-indexed)
 * @param {number|string} column - Column number (1-indexed) or letter
 * @returns {Promise<string>} - Cell value
 */
export const readCell = async (row, column) => {
    try {
        const sheets = getGoogleSheetsClient();
        const spreadsheetId = config.googleSheets.spreadsheetId;

        let columnLetter;
        if (typeof column === 'number') {
            columnLetter = columnNumberToLetter(column);
        } else {
            columnLetter = column.toString().toUpperCase();
        }

        const range = `${columnLetter}${row}`;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const value = response.data.values?.[0]?.[0] || '';

        return {
            success: true,
            range,
            value,
        };
    } catch (error) {
        console.error('Error reading Google Sheet:', error.message);
        throw error;
    }
};

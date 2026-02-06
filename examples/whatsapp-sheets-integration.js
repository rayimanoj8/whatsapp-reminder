/**
 * Example: Integrate WhatsApp Messages with Google Sheets
 * 
 * This example shows how to automatically save WhatsApp responses
 * to a Google Sheet for tracking and analysis.
 */

import { updateCell, updateMultipleCells } from './src/services/googleSheets.js';

/**
 * Example 1: Save a single WhatsApp message to the next available row
 */
export async function saveMessageToSheet(message, sender, timestamp) {
    try {
        // Determine the next row (you might want to track this in a database)
        const nextRow = 2; // Start from row 2 (row 1 is headers)

        // Update cells with message data
        const updates = [
            { row: nextRow, column: 'A', value: timestamp },
            { row: nextRow, column: 'B', value: sender },
            { row: nextRow, column: 'C', value: message }
        ];

        const result = await updateMultipleCells(updates);
        console.log('✅ Message saved to sheet:', result);

        return result;
    } catch (error) {
        console.error('❌ Failed to save message:', error);
        throw error;
    }
}

/**
 * Example 2: Create a daily work status tracker
 */
export async function logWorkStatus(date, name, status) {
    try {
        // Find the next available row (simplified - in production, query the sheet)
        const nextRow = 2;

        const updates = [
            { row: nextRow, column: 'A', value: date },
            { row: nextRow, column: 'B', value: name },
            { row: nextRow, column: 'C', value: status },
            { row: nextRow, column: 'D', value: new Date().toISOString() }
        ];

        const result = await updateMultipleCells(updates);
        console.log('✅ Work status logged:', result);

        return result;
    } catch (error) {
        console.error('❌ Failed to log status:', error);
        throw error;
    }
}

/**
 * Example 3: Initialize sheet with headers
 */
export async function initializeSheetHeaders() {
    try {
        const headers = [
            { row: 1, column: 'A', value: 'Timestamp' },
            { row: 1, column: 'B', value: 'Sender' },
            { row: 1, column: 'C', value: 'Message' },
            { row: 1, column: 'D', value: 'Status' }
        ];

        const result = await updateMultipleCells(headers);
        console.log('✅ Headers initialized:', result);

        return result;
    } catch (error) {
        console.error('❌ Failed to initialize headers:', error);
        throw error;
    }
}

/**
 * Example 4: Update a specific cell based on WhatsApp response
 */
export async function updateStatusCell(row, status) {
    try {
        const result = await updateCell(row, 'D', status);
        console.log(`✅ Updated row ${row} status to: ${status}`);

        return result;
    } catch (error) {
        console.error('❌ Failed to update status:', error);
        throw error;
    }
}

/**
 * Example 5: Create a weekly summary
 */
export async function createWeeklySummary(weekData) {
    try {
        const updates = [];
        let row = 1;

        // Add header
        updates.push({ row: row++, column: 'A', value: 'Weekly Summary' });
        updates.push({ row: row++, column: 'A', value: 'Day' });
        updates.push({ row: row - 1, column: 'B', value: 'WFH' });
        updates.push({ row: row - 1, column: 'C', value: 'Office' });
        updates.push({ row: row - 1, column: 'D', value: 'Leave' });

        // Add data
        for (const day of weekData) {
            updates.push({ row: row, column: 'A', value: day.date });
            updates.push({ row: row, column: 'B', value: day.wfh });
            updates.push({ row: row, column: 'C', value: day.office });
            updates.push({ row: row, column: 'D', value: day.leave });
            row++;
        }

        const result = await updateMultipleCells(updates);
        console.log('✅ Weekly summary created:', result);

        return result;
    } catch (error) {
        console.error('❌ Failed to create summary:', error);
        throw error;
    }
}

/**
 * Example Usage in Your WhatsApp Webhook Handler
 * 
 * Add this to your messageController.js:
 */

/*
import { saveMessageToSheet } from '../examples/whatsapp-sheets-integration.js';

export const receiveWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    // Store in memory (existing code)
    messageStore.latestMessage = {
      timestamp: new Date().toISOString(),
      data: webhookData
    };
    
    // NEW: Also save to Google Sheets
    if (webhookData.message && webhookData.sender) {
      await saveMessageToSheet(
        webhookData.message,
        webhookData.sender,
        new Date().toISOString()
      );
    }
    
    res.json({
      success: true,
      message: "Webhook received and saved to sheet"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
*/

/**
 * Example: Daily Status Automation
 * 
 * When someone responds to the daily status message,
 * automatically log it to Google Sheets:
 */

/*
// In your WhatsApp message handler
const statusMapping = {
  'wfh': 'Work from Home',
  'office': 'Work from Office',
  'halfday': 'Half Day Leave',
  'leave': 'Leave'
};

export async function handleStatusResponse(userId, statusCode) {
  const status = statusMapping[statusCode] || 'Unknown';
  const date = new Date().toLocaleDateString();
  
  await logWorkStatus(date, userId, status);
}
*/

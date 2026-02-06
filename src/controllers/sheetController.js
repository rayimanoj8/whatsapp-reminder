import { updateCell, updateMultipleCells, readCell } from '../services/googleSheets.js';

/**
 * Update a single cell in Google Sheets
 * POST /sheet/update
 * Body: { row: number, column: number|string, value: string }
 */
export const updateSheetCell = async (req, res) => {
    try {
        const { row, column, value } = req.body;

        // Validate inputs
        if (!row || !column || value === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: row, column, and value are required',
            });
        }

        // Validate row is a positive number
        if (!Number.isInteger(Number(row)) || Number(row) < 1) {
            return res.status(400).json({
                success: false,
                error: 'Row must be a positive integer',
            });
        }

        // Update the cell
        const result = await updateCell(Number(row), column, String(value));

        res.json({
            success: true,
            message: 'Cell updated successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error in updateSheetCell:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update cell',
        });
    }
};

/**
 * Update multiple cells in Google Sheets
 * POST /sheet/update-batch
 * Body: { updates: [{ row: number, column: number|string, value: string }] }
 */
export const updateSheetCellsBatch = async (req, res) => {
    try {
        const { updates } = req.body;

        // Validate inputs
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'updates must be a non-empty array',
            });
        }

        // Validate each update
        for (const update of updates) {
            if (!update.row || !update.column || update.value === undefined) {
                return res.status(400).json({
                    success: false,
                    error: 'Each update must have row, column, and value',
                });
            }
        }

        // Update the cells
        const result = await updateMultipleCells(updates);

        res.json({
            success: true,
            message: 'Cells updated successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error in updateSheetCellsBatch:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update cells',
        });
    }
};

/**
 * Read a cell value from Google Sheets
 * GET /sheet/read?row=1&column=A
 */
export const readSheetCell = async (req, res) => {
    try {
        const { row, column } = req.query;

        // Validate inputs
        if (!row || !column) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameters: row and column',
            });
        }

        // Validate row is a positive number
        if (!Number.isInteger(Number(row)) || Number(row) < 1) {
            return res.status(400).json({
                success: false,
                error: 'Row must be a positive integer',
            });
        }

        // Read the cell
        const result = await readCell(Number(row), column);

        res.json({
            success: true,
            message: 'Cell read successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error in readSheetCell:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to read cell',
        });
    }
};

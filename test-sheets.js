#!/usr/bin/env node

/**
 * Quick test script for Google Sheets integration
 * Usage: node test-sheets.js
 */

const API_BASE = 'http://localhost:3000';

async function testUpdateCell() {
    console.log('\n📝 Testing: Update Cell A1 with "Test Value"...');

    try {
        const response = await fetch(`${API_BASE}/sheet/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                row: 1,
                column: 'A',
                value: 'Test Value'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Success:', data.message);
            console.log('   Range:', data.data.range);
            console.log('   Updated cells:', data.data.updatedCells);
        } else {
            console.log('❌ Failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

async function testReadCell() {
    console.log('\n📖 Testing: Read Cell A1...');

    try {
        const response = await fetch(`${API_BASE}/sheet/read?row=1&column=A`);
        const data = await response.json();

        if (data.success) {
            console.log('✅ Success:', data.message);
            console.log('   Range:', data.data.range);
            console.log('   Value:', data.data.value);
        } else {
            console.log('❌ Failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

async function testBatchUpdate() {
    console.log('\n📊 Testing: Batch Update (Creating a simple table)...');

    try {
        const response = await fetch(`${API_BASE}/sheet/update-batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                updates: [
                    { row: 1, column: 'A', value: 'Name' },
                    { row: 1, column: 'B', value: 'Age' },
                    { row: 1, column: 'C', value: 'City' },
                    { row: 2, column: 'A', value: 'Alice' },
                    { row: 2, column: 'B', value: '25' },
                    { row: 2, column: 'C', value: 'New York' },
                    { row: 3, column: 'A', value: 'Bob' },
                    { row: 3, column: 'B', value: '30' },
                    { row: 3, column: 'C', value: 'London' }
                ]
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Success:', data.message);
            console.log('   Total updated cells:', data.data.totalUpdatedCells);
            console.log('   Total updated rows:', data.data.totalUpdatedRows);
        } else {
            console.log('❌ Failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Google Sheets Integration Test Suite');
    console.log('========================================');
    console.log('Make sure your server is running on', API_BASE);

    await testUpdateCell();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testReadCell();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testBatchUpdate();

    console.log('\n========================================');
    console.log('✨ Tests completed!');
    console.log('\n💡 Tip: Check your Google Sheet to see the updates!');
}

runTests();

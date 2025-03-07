const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');

// Google Sheets Setup
const SHEET_ID = '1yGixoVBp1CzbTmyJzofSyCc-vpT7C0UJ1j4TtjVo1sk'; // Your Google Sheet ID
const SHEET_NAME = 'Pricehunter Emails'; // Your Sheet Name
const CREDENTIALS_PATH = './google-credentials.json'; // JSON file path

// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Subscribe Endpoint (Save Email to Google Sheet)
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Fetch existing emails
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: SHEET_NAME
        });
        const existingEmails = response.data.values ? response.data.values.flat() : [];

        if (existingEmails.includes(email)) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }

        // Append new email
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: SHEET_NAME,
            valueInputOption: 'RAW',
            requestBody: { values: [[email]] }
        });

        res.json({ message: 'Subscription successful' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

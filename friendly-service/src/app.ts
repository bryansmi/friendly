import { SheetsService } from './services/sheetsService';
import { TwilioService } from './services/twilioService';

import twilioCredentials from './secrets/twilio/twilio-credentials.json';
import friendlySecrets from './secrets/friendly/friendly-secrets.json';
import { defined } from './utilities/defined';
import { ITwilioConfig, ISheetsConfig } from 'models/configurations';
import { Express } from 'express';
import express = require('express');

const TWILIO_CONFIG: ITwilioConfig = {
    accountSid: twilioCredentials.accountSid,
    authToken: twilioCredentials.authToken,
    sender: twilioCredentials.sender,
    bsPhoneNumber: friendlySecrets.bsPhoneNumber
};

const SHEETS_CONFIG: ISheetsConfig = {
    sheetId: '1WSbDRh81yQkdkYQdagZDNQ1HpDJn_obcYudJzRz2liY',
    sheetRange: 'Sheet1!A2:G',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
};

const app: Express = express();
const port: number = 1337;

function main(): void {
    app.use((req, res, next) => {
        req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
    });

    app.get('/', (req, res) => {
        res.send('Hello world!');
    });

    app.get('/birthdays', async (req, res) => {
        console.log('Starting Friendly...');
        const sheetsService = new SheetsService(SHEETS_CONFIG)
        const sheetData = await sheetsService.getSpreadsheetData('brain');

        const twilioService = new TwilioService(TWILIO_CONFIG);
        await twilioService.sendBirthdayStatusSMS(defined(sheetData));
        res.send('SMS sent to default phone number.');
    });

    app.listen(port, () => {
        console.log(`friendly-service server started at http://localhost:${ port }`);
    });
}

export = app;

// async function main(): Promise<any> {
//     console.log('Starting Friendly...');
//     console.log(`accountSid: ${TWILIO_CONFIG.accountSid}`);
//     console.log(`authToken: ${TWILIO_CONFIG.authToken}`);

//     const sheetsService = new SheetsService(SHEETS_CONFIG)
//     const sheetData = await sheetsService.getSpreadsheetData('brain');

//     const twilioService = new TwilioService(TWILIO_CONFIG);
//     await twilioService.sendBirthdayStatusSMS(defined(sheetData));
// }
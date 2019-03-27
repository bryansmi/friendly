import { SheetsService } from './services/sheetsService';
import { TwilioService } from './services/twilioService';

import twilioCredentials from './secrets/twilio/twilio-credentials.json';
import friendlySecrets from './secrets/friendly/friendly-secrets.json';
import { defined } from './utilities/defined';
import { ITwilioConfig, ISheetsConfig } from 'models/configurations';

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

async function main(): Promise<any> {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${TWILIO_CONFIG.accountSid}`);
    console.log(`authToken: ${TWILIO_CONFIG.authToken}`);

    const sheetsService = new SheetsService(SHEETS_CONFIG);
    const sheetData = await sheetsService.getSpreadsheetData('brain');

    const twilioService = new TwilioService(TWILIO_CONFIG);
    await twilioService.sendBirthdayStatusSMS(defined(sheetData));
}


main()
.then((res) => {
    console.log('Success: Finishing friendly-service.');
    return 0;
})
.catch((err) => {
    console.log('Error: Something went wrong and friendly-service stopped.');
    console.error(err);
    return 1;
});

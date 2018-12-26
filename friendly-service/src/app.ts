import * as Twilio from 'twilio';
import { SheetsService } from './services/sheetsService';

import * as twilioCredentials from 'secrets/twilio/twilio-credentials.json';
import * as friendlySecrets from 'secrets/friendly-secrets.json';

export interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    sender: string;
    bsPhoneNumber: string;
}

export interface ISheetsConfig {
    scopes: string[];
    testSheetId: string;
    testSheetRange: string;
}

const TWILIO_CONFIG: ITwilioConfig = {
    accountSid: twilioCredentials.accountSid,
    authToken: twilioCredentials.authToken,
    sender: twilioCredentials.sender,
    bsPhoneNumber: friendlySecrets.bsPhoneNumber
};

const SHEETS_CONFIG: ISheetsConfig = {
    testSheetId: '1WSbDRh81yQkdkYQdagZDNQ1HpDJn_obcYudJzRz2liY',
    testSheetRange: 'Sheet1!A2:B',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
};

// tslint:disable-next-line:only-arrow-functions
async function main(): Promise<number> {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${TWILIO_CONFIG.accountSid}`);
    console.log(`authToken: ${TWILIO_CONFIG.authToken}`);

    const sheetsService = new SheetsService(SHEETS_CONFIG);
    const sheetData = await sheetsService.getSpreadsheetData('brain');

    sendBirthdayStatusSMS(sheetData);

    return 0;
}

// tslint:disable-next-line:only-arrow-functions
async function sendBirthdayStatusSMS(sheetData: Array<Array<string>>): Promise<any> {
    const client = new Twilio.Twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

    //TODO: get SMS body (upcoming birthdays etc)
    const messageContent = 'placeholder for birthdays';

    for (const row of sheetData) {
        const messageOptions = {
            body: messageContent,
            from: TWILIO_CONFIG.sender,
            to: TWILIO_CONFIG.bsPhoneNumber
        };

        try {
            const response = await client.messages.create(messageOptions);
            console.log(`MessageInstance: ${JSON.stringify(response)}`);
        } catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    }
}

main()
.then((res) => {
    console.log('Success: Finishing friendly-service.');
    console.log(res);
    return res as number;
})
.catch((err) => {
    console.log('Error: Something went wrong and friendly-service stopped.');
    console.error(err);
    return 1;
});

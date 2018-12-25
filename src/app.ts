import * as Twilio from 'twilio';
import { SheetsService } from './services/sheetsService';

export interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    sender: string;
}

export interface ISheetsConfig {
    scopes: string[];
    phoneNumberSheetId: string;
    phoneNumberSheetRange: string;
}

const TWILIO_CONFIG: ITwilioConfig = {
    accountSid: 'ACf1d0f71e7efbdc73ac92cc8045647b05',
    authToken: '840a4948f94105a1df507227878232a1',
    sender: '+12489651475'
};

const SHEETS_CONFIG: ISheetsConfig = {
    phoneNumberSheetId: 'foo',
    phoneNumberSheetRange: 'bar',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
};

// tslint:disable-next-line:only-arrow-functions
function main(): number {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${TWILIO_CONFIG.accountSid}`);
    console.log(`authToken: ${TWILIO_CONFIG.authToken}`);

    const sheetsService = new SheetsService(SHEETS_CONFIG);
    const number = sheetsService.getPhoneNumberForName('brain');
    sendTextMessage(['+12482077738']);

    return 0;
}

// tslint:disable-next-line:only-arrow-functions
async function sendTextMessage(numbers: string[]): Promise<any> {
    const client = new Twilio.Twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
    for (const number of numbers) {
        const messageOptions = {
            body: 'hello-test-message',
            from: TWILIO_CONFIG.sender,
            to: number
        };

        try {
            const response = await client.messages.create(messageOptions);
            console.log(`MessageInstance: ${response}`);
        } catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    }
}

main();

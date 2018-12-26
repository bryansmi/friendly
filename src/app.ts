import * as Twilio from 'twilio';
import { SheetsService } from './services/sheetsService';
import { strict } from 'assert';

export interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    sender: string;
}

export interface ISheetsConfig {
    scopes: string[];
    testSheetId: string;
    testSheetRange: string;
}

const TWILIO_CONFIG: ITwilioConfig = {
    accountSid: 'ACf1d0f71e7efbdc73ac92cc8045647b05',
    authToken: '840a4948f94105a1df507227878232a1',
    sender: '+12489651475'
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
    const result = await sheetsService.getPhoneNumberForName('brain');
    let phoneNumbers: Map<string, string> = new Map<string, string>();

    for (const foo of result) {
        phoneNumbers.set(foo[0], foo[1]);
    }

    // sendTextMessage(['+12482077738']);
    sendTextMessage(phoneNumbers);

    return 0;
}

// tslint:disable-next-line:only-arrow-functions
async function sendTextMessage(numbers: Map<string,string>): Promise<any> {
    const client = new Twilio.Twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
    for (const number of numbers) {
        const messageOptions = {
            body: 'hello-test-message',
            from: TWILIO_CONFIG.sender,
            to: number[1]
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
    console.log('--- MAIN.THEN ---');
    console.log(res);
    return res as number;
})
.catch((err) => {
    console.log('--- MAIN.CATCH ---');
    console.error(err);
    return 1;
});

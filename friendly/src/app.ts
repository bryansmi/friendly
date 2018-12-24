import * as Twilio from 'twilio';
import { MessageInteractionList, MessageInteractionInstance } from 'twilio/lib/rest/proxy/v1/service/session/participant/messageInteraction';

interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    sender: string;
}

const CONFIG: ITwilioConfig = {
    accountSid: 'ACf1d0f71e7efbdc73ac92cc8045647b05',
    authToken: '840a4948f94105a1df507227878232a1',
    sender: '+12489651475'
};

function main(): number {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${CONFIG.accountSid}`);
    console.log(`authToken: ${CONFIG.authToken}`);

    sendTextMessage(['+12482077738']);


    return 0;
}

async function sendTextMessage(numbers: string[]): Promise<any> {
    const client = new Twilio.Twilio(CONFIG.accountSid, CONFIG.authToken);
    for (let number of numbers) {
        const messageOptions = {
            body: 'hello-test-message',
            from: CONFIG.sender,
            to: number
        };

        try {
            await client.messages.create(messageOptions);
        } catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    }
}

main();

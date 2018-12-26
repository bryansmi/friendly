import { ITwilioConfig } from "app";
import { Twilio } from "twilio";

export class TwilioService {
    private config: ITwilioConfig;

    constructor(config: ITwilioConfig) {
        this.config = config;
    }

    async sendBirthdayStatusSMS(sheetData: Array<Array<string>>): Promise<any> {
        const client = new Twilio(this.config.accountSid, this.config.authToken);

        //TODO: get SMS body (upcoming birthdays etc)
        const messageContent = 'placeholder for birthdays';

        for (const row of sheetData) {
            const messageOptions = {
                body: messageContent,
                from: this.config.sender,
                to: this.config.bsPhoneNumber
            };

            try {
                const response = await client.messages.create(messageOptions);
                console.log(`MessageInstance: ${JSON.stringify(response)}`);
            } catch (error) {
                console.error(`Unable to send text message: ${error}`);
            }
        }
    }
}
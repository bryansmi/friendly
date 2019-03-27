import { Twilio } from "twilio";
import { getBirthdaySMSBody } from "../common/smsFormatter";
import { ITwilioConfig, IFriendlyData } from "models/configurations";

export class TwilioService {
    private config: ITwilioConfig;
    private client: Twilio;

    constructor(config: ITwilioConfig) {
        this.config = config;
        this.client = new Twilio(this.config.accountSid, this.config.authToken);
    }

    public async sendBirthdayStatusSMS(sheetData: Array<IFriendlyData>): Promise<void> {
        const messageContent = getBirthdaySMSBody(sheetData);
        if (messageContent === undefined) {
            return;
        }

        const messageOptions = {
            body: messageContent,
            from: this.config.sender,
            to: this.config.bsPhoneNumber
        };

        try {
            const response = await this.client.messages.create(messageOptions);
            console.log(`Twilio MessageInstance: ${JSON.stringify(response)}`);
        } catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    }
}
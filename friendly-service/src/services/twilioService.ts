import { ITwilioConfig, IFriendlyData } from "app";
import { Twilio } from "twilio";
import { defined } from "../utilities/defined";
import { getBirthdaySMSBody } from "common/smsFormatter";

export class TwilioService {
    private config: ITwilioConfig;
    private client: Twilio;

    constructor(config: ITwilioConfig) {
        this.config = config;
        this.client = new Twilio(this.config.accountSid, this.config.authToken);
    }

    public async sendBirthdayStatusSMS(sheetData: Array<IFriendlyData>): Promise<any> {
        const messageContent = defined(getBirthdaySMSBody(sheetData));

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
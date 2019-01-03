import { ITwilioConfig, IFriendlyData } from "app";
import { Twilio } from "twilio";
import { defined } from "../utilities/defined";

export class TwilioService {
    private config: ITwilioConfig;
    private client: Twilio;

    constructor(config: ITwilioConfig) {
        this.config = config;
        this.client = new Twilio(this.config.accountSid, this.config.authToken);
    }

    async sendBirthdayStatusSMS(sheetData: Array<IFriendlyData>): Promise<any> {
        let messageContent: string;

        try {
            messageContent = defined(this.getBirthdaySMSBody(sheetData));
        } catch (error) {
            console.log('Nothing birthday related today. No SMS sent.')
            return;
        }

        const messageOptions = {
            body: messageContent,
            from: this.config.sender,
            to: this.config.bsPhoneNumber
        };

        try {
            const response = await this.client.messages.create(messageOptions);
            console.log(`MessageInstance: ${JSON.stringify(response)}`);
        } catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    }

    private getBirthdaySMSBody(sheetData: Array<IFriendlyData>): string | undefined {
        let upcomingBirthdays: string = '';
        let currentBirthdays: string = '';

        for(let i = 0; i < sheetData.length; i++) {
            let today = new Date();
            let sevenDays = new Date(today.getTime() + 1000*60*60*24*7);
            let birthday = sheetData[i].birthday;

            if(birthday.getDate() === sevenDays.getDate() && birthday.getMonth() == sevenDays.getMonth()) {
                upcomingBirthdays += `${sheetData[i].name}, `;
            }

            if(birthday.getDate() === today.getDate() && birthday.getMonth() == today.getMonth()) {
                currentBirthdays += `${sheetData[i].name}, `;
            }
        }

        if(upcomingBirthdays === '' && currentBirthdays === '') {
            return undefined;
        }

        if(upcomingBirthdays === '') {
            return `There's some birthdays today! ${upcomingBirthdays} have birthdays today. 
            Make sure you wish them a happy birthday!`;
        } else if(currentBirthdays === '') {
            return `There's some birthdays coming up: ${currentBirthdays} have birthdays in seven (7) days. 
            Think about doing something nice be ready!`;
        } else {
            return `There's some birthdays today! ${currentBirthdays} have birthdays today. 
            Make sure you wish them a happy birthday!
            Upcoming birthdays: ${upcomingBirthdays}.`;
        }
    }
}
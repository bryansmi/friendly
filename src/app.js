"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const sheetsService_1 = require("./services/sheetsService");
const TWILIO_CONFIG = {
    accountSid: 'ACf1d0f71e7efbdc73ac92cc8045647b05',
    authToken: '840a4948f94105a1df507227878232a1',
    sender: '+12489651475'
};
const SHEETS_CONFIG = {
    phoneNumberSheetId: 'foo',
    phoneNumberSheetRange: 'bar',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    tokenPath: 'token.json',
};
// tslint:disable-next-line:only-arrow-functions
function main() {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${TWILIO_CONFIG.accountSid}`);
    console.log(`authToken: ${TWILIO_CONFIG.authToken}`);
    const sheetsService = new sheetsService_1.SheetsService(SHEETS_CONFIG);
    sheetsService.getPhoneNumberForName('brain');
    sendTextMessage(['+12482077738']);
    return 0;
}
// tslint:disable-next-line:only-arrow-functions
function sendTextMessage(numbers) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new twilio_1.default.Twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
        for (const number of numbers) {
            const messageOptions = {
                body: 'hello-test-message',
                from: TWILIO_CONFIG.sender,
                to: number
            };
            try {
                const response = yield client.messages.create(messageOptions);
                console.log(`MessageInstance: ${response}`);
            }
            catch (error) {
                console.error(`Unable to send text message: ${error}`);
            }
        }
    });
}
main();

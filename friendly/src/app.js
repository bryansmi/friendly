"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Twilio = __importStar(require("twilio"));
const CONFIG = {
    accountSid: 'ACf1d0f71e7efbdc73ac92cc8045647b05',
    authToken: '840a4948f94105a1df507227878232a1',
    sender: ''
};
function main() {
    console.log('Starting Friendly...');
    console.log(`accountSid: ${CONFIG.accountSid}`);
    console.log(`authToken: ${CONFIG.authToken}`);
    sendTextMessage();
    return 0;
}
function sendTextMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Twilio.Twilio(CONFIG.accountSid, CONFIG.authToken);
        const messageOptions = {
            body: 'hello-test-message',
            from: CONFIG.sender,
            to: '+12482077738'
        };
        // client.messages
        // .create(messageOptions)
        // .catch(err => console.error(err))
        // .then(msg => console.log(msg));
        try {
            yield client.messages.create(messageOptions);
        }
        catch (error) {
            console.error(`Unable to send text message: ${error}`);
        }
    });
}
main();

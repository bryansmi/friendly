"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const readline_1 = __importDefault(require("readline"));
class ClientCredentials {
    constructor(data) {
        this.id = data.installed.client_id;
        this.secret = data.installed.client_secret;
        this.redirectUris = data.installed.client_redirectUris;
    }
}
class SheetsService {
    constructor(config) {
        this.config = config;
        this.client = this.getAuthorizedSheetsClient();
    }
    getPhoneNumberForName(name) {
        const auth = this.client;
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            range: this.config.phoneNumberSheetRange,
            spreadsheetId: this.config.phoneNumberSheetId,
        }, (err, res) => {
            if (err) {
                return console.log('The API returned an error: ' + err);
            }
            const rows = res.data.values;
            if (rows.length) {
                console.log('Name, PhoneNumber:');
                // Print columns A and B, which correspond to indices 0 and 4.
                rows.map((row) => {
                    console.log(`${row[0]}, ${row[1]}`);
                });
            }
            else {
                console.log('No data found.');
            }
        });
    }
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     */
    getAuthorizedSheetsClient() {
        let client;
        let credentials;
        fs_1.default.readFile('../../secrets/google/credentials.json', (err, content) => {
            if (err) {
                throw new Error('Failed to load credentials from file: credentials.json');
            }
            const credentialContent = JSON.parse(content.toString());
            credentials = new ClientCredentials(credentialContent.installed);
        });
        if (credentials === undefined) {
            throw new Error('Something went wrong initializing the sheets client.');
        }
        client = new googleapis_1.google.auth.OAuth2(credentials.id, credentials.secret, credentials.redirectUris[0]);
        // Check if we have previously stored a token.
        fs_1.default.readFile(this.config.tokenPath, (err, content) => {
            if (err) {
                return this.getNewToken(client);
            }
            return client.setCredentials(JSON.parse(content.toString()));
        });
        return client;
    }
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} client The OAuth2 client to get token for.
     */
    getNewToken(client) {
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: this.config.scopes,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            client.getToken(code, (err, token) => {
                if (err) {
                    return console.error('Error while trying to retrieve access token', err);
                }
                client.setCredentials(token);
                // Store the token to disk for later program executions
                fs_1.default.writeFile(this.config.tokenPath, JSON.stringify(token), (err) => {
                    if (err) {
                        throw new Error(`Couldn't get new token for sheets client: ${err}`);
                    }
                    console.log('Token stored to', this.config.tokenPath);
                });
            });
        });
        return client;
    }
}
exports.SheetsService = SheetsService;

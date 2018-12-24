import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import readline from 'readline';
import { ISheetsConfig } from '../app';

interface IClientCredentials {
    id: string;
    secret: string;
    redirectUris: string[];
}

export class SheetsService {
    private tokenPath: string;
    private scopes: string[];
    private client: OAuth2Client;
    private phoneNumberSheetId: string;
    private phoneNumberSheetRange: string;

    constructor(config: ISheetsConfig) {
        this.tokenPath = config.tokenPath;
        this.scopes = config.scopes;
        this.phoneNumberSheetId = config.phoneNumberSheetId;
        this.phoneNumberSheetRange = config.phoneNumberSheetRange;
        this.client = this.getAuthorizedSheetsClient();
    }

    public getPhoneNumberForName(name: string) {
        const auth = this.client;
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            range: this.phoneNumberSheetRange,
            spreadsheetId: this.phoneNumberSheetId,
        }, (err: any, res: any) => {
            if (err) { return console.log('The API returned an error: ' + err); }
            const rows = res.data.values;
            if (rows.length) {
                console.log('Name, PhoneNumber:');
                // Print columns A and B, which correspond to indices 0 and 4.
                rows.map((row: any) => {
                    console.log(`${row[0]}, ${row[1]}`);
                });
            } else {
                console.log('No data found.');
            }
        });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     */
    private getAuthorizedSheetsClient(): OAuth2Client {
        let client: OAuth2Client;
        let credentials: IClientCredentials | undefined;

        fs.readFile('credentials.json', (err, content) => {
            if (err) { throw new Error('Failed to load credentials from file: credentials.json'); }
            const credentialContent = JSON.parse(content.toString());
            credentials = credentialContent.installed;
        });

        if (credentials === undefined) { throw new Error('Something went wrong initializing the sheets client.'); }

        client = new google.auth.OAuth2(credentials.id, credentials.secret, credentials.redirectUris[0]);
        // Check if we have previously stored a token.
        fs.readFile(this.tokenPath, (err, content) => {
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
    private getNewToken(client: OAuth2Client): OAuth2Client {
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            client.getToken(code, (err: any, token: any) => {
                if (err) { return console.error('Error while trying to retrieve access token', err); }
                client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.tokenPath, JSON.stringify(token), (err) => {
                    if (err) { throw new Error(`Couldn't get new token for sheets client: ${err}`); }
                    console.log('Token stored to', this.tokenPath);
                });
            });
        });

        return client;
    }

    // /**
    //  * Prints the names and majors of students in a sample spreadsheet:
    //  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    //  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
    //  */
    // listMajors(auth: any) {
    //     const sheets = google.sheets({ version: 'v4', auth });
    //     sheets.spreadsheets.values.get({
    //         spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    //         range: 'Class Data!A2:E',
    //     }, (err: any, res: any) => {
    //         if (err) return console.log('The API returned an error: ' + err);
    //         const rows = res.data.values;
    //         if (rows.length) {
    //             console.log('Name, Major:');
    //             // Print columns A and E, which correspond to indices 0 and 4.
    //             rows.map((row: any) => {
    //                 console.log(`${row[0]}, ${row[4]}`);
    //             });
    //         } else {
    //             console.log('No data found.');
    //         }
    //     });
    // }
}
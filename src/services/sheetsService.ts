import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import readline from 'readline';
import { ISheetsConfig } from '../app';
import rawCredentials from '../secrets/google/credentials.json';

interface IClientCredentials {
    id: string;
    secret: string;
    redirectUri: string;
}

class ClientCredentials implements IClientCredentials {
    id: string; 
    secret: string;
    redirectUri: string;

    constructor(data: any) {
        this.id = data.client_id;
        this.secret = data.client_secret;
        this.redirectUri = data.redirect_uris[0];
    }
}

export class SheetsService {
    private config: ISheetsConfig;
    private client: OAuth2Client;
    private tokenPath: string = '../secrets/google/token.json';

    constructor(config: ISheetsConfig) {
        this.config = config;
        this.client = this.getAuthorizedSheetsClient();
    }

    public getPhoneNumberForName(name: string) {
        const auth = this.client; 
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            range: this.config.phoneNumberSheetRange,
            spreadsheetId: this.config.phoneNumberSheetId,
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
        const credentials: ClientCredentials = new ClientCredentials(rawCredentials.installed);

        client = new google.auth.OAuth2(credentials.id, credentials.secret, credentials.redirectUri);
        // Check if we have previously stored a token.
        // fs.readFile(this.tokenPath, (err, content) => {
        //     if (err) {
        //         return this.getNewToken(client);
        //     }
        //     return client.setCredentials(JSON.parse(content.toString()));
        // });

        try {
            const content = fs.readFileSync(this.tokenPath);
            client.setCredentials(JSON.parse(content.toString()));
        } catch {
            return this.getNewToken(client);
        }

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
            scope: this.config.scopes,
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
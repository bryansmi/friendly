import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { ISheetsConfig, IFriendlyData } from '../app';
import { defined } from '../utilities/defined';

import * as googleCredentials from '../secrets/google/friendly-service-serviceaccount-creds.json';

class FriendlyData implements IFriendlyData {
    timestamp: Date;
    name: string;
    email: string;
    countryCode: number;
    phoneNumber: number;
    birthday: Date;
    mailingAddress: string;

    constructor(timestamp: Date, name: string, email: string, countryCode: number, 
        phoneNumber: number, birthday: Date, mailingAddress: string) 
    {
        this.timestamp = timestamp;
        this.name = name;
        this.email = email;
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.birthday = birthday;
        this.mailingAddress = mailingAddress;
    }
}

export class SheetsService {
    private config: ISheetsConfig;
    private client: JWT | undefined;

    constructor(config: ISheetsConfig) {
        this.config = config;
        this.client = this.authorizeSheetsClient(this.client);
    }

    public async getSpreadsheetData(name: string): Promise<Array<IFriendlyData>> {
        const auth = this.client; 
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetResult = await sheets.spreadsheets.values.get({
             range: this.config.testSheetRange,
             spreadsheetId: this.config.testSheetId});

        const values: Array<Array<string>> = defined(spreadsheetResult.data.values);
        let result = new Array<IFriendlyData>(values.length);

        for(let i = 0; i < values.length; i++) {
            let row = values[i];
            result[i] = new FriendlyData(new Date(row[0]), row[1], row[2], Number.parseInt(row[3]), 
            Number.parseInt(row[4]), new Date(row[5]), row[6]);
        }
        
        return defined(result);
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     */
    private authorizeSheetsClient(client: JWT | undefined): JWT {
        // const credentials: ClientCredentials = new ClientCredentials(rawCredentials.installed);
        // client = new google.auth.OAuth2(credentials.id, credentials.secret, credentials.redirectUri);

        const scope = ['https://www.googleapis.com/auth/spreadsheets'];

        if(client === undefined) {
            client = new google.auth.JWT(googleCredentials.client_email,
                undefined,
                googleCredentials.private_key,
                scope
            );
        } 

        try {
            client.authorize();
        } catch (error) {
            console.log(error);
        }

        return client;

        // try {
        //     const content = fs.readFileSync(this.tokenPath);
        //     client.setCredentials(JSON.parse(content.toString()));
        // } catch {
        //     return this.getNewToken(client);
        // }
    }

    // /**
    //  * Get and store new token after prompting for user authorization, and then
    //  * execute the given callback with the authorized OAuth2 client.
    //  * @param {google.auth.OAuth2} client The OAuth2 client to get token for.
    //  */
    // private getNewToken(client: JWT): OAuth2Client {
    //     const authUrl = client.generateAuthUrl({
    //         access_type: 'offline',
    //         scope: this.config.scopes,
    //     });
    //     console.log('Authorize this app by visiting this url:', authUrl);
    //     const rl = readline.createInterface({
    //         input: process.stdin,
    //         output: process.stdout,
    //     });
    //     // 4/vgBtMBY9hxWxYtwYuZFFYkVRFufbgxMwugROExfORLkqBdRuiDHSE_E
    //     // 4/vgAK3y7jzq0geTQrstdANruS-L3x13N77mJKzPZwMXNGcOz-1mJ5QxAv
    //     rl.question('Enter the code from that page here: ', (code) => {
    //         rl.close();
    //         client.getToken(code, (err: any, token: any) => {
    //             if (err) { return console.error('Error while trying to retrieve access token', err); }
    //             client.setCredentials(token);
    //             // Store the token to disk for later program executions
    //             fs.writeFile(this.tokenPath, JSON.stringify(token), (err) => {
    //                 if (err) { throw new Error(`Couldn't get new token for sheets client: ${err}`); }
    //                 console.log('Token stored to', this.tokenPath);
    //             });
    //         });
    //     });

    //     return client;
    // }

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
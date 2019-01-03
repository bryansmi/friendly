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

    private authorizeSheetsClient(client: JWT | undefined): JWT {
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
    }
}
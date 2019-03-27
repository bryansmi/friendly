export interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    sender: string;
    bsPhoneNumber: string;
}

export interface ISheetsConfig {
    scopes: string[];
    sheetId: string;
    sheetRange: string;
}

export interface IFriendlyData {
    timestamp: Date;
    name: string;
    email: string;
    countryCode: number;
    phoneNumber: number;
    birthday: Date;
    mailingAddress: string;
}

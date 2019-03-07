import { IFriendlyData } from "../../src/app";
import { getBirthdaySMSBody } from "../../src/common/smsFormatter";
import { expect } from "chai";
import "mocha";
import { SmsBodies } from "../../src/common/strings";

describe('test describe', () => {
    const today: Date = new Date();
    const sixDaysAferToday: Date = new Date(today.getTime() + 1000*60*60*24*6);
    const thirtyDaysAferToday: Date = new Date(today.getTime() + 1000*60*60*24*30);
    const testerToday: IFriendlyData = {
        timestamp: new Date(2019, 3, 1),
        name: "Tester Today",
        email: "email",
        countryCode: 1,
        phoneNumber: 2481234567,
        birthday: today,
        mailingAddress: "mailingAddress"
    };
    const testerSixDays: IFriendlyData = {
        timestamp: new Date(2019, 3, 1),
        name: "Tester Six Days",
        email: "email",
        countryCode: 1,
        phoneNumber: 2481234567,
        birthday: sixDaysAferToday,
        mailingAddress: "mailingAddress"
    };
    const testerThirtyDays: IFriendlyData = {
        timestamp: new Date(2019, 3, 1),
        name: "Tester Thirty Days",
        email: "email",
        countryCode: 1,
        phoneNumber: 2481234567,
        birthday: thirtyDaysAferToday,
        mailingAddress: "mailingAddress"
    };

    it('no birthdays should return undefined', () => {
        const friendlyData: IFriendlyData[] = [];
        const result = getBirthdaySMSBody(friendlyData);
        expect(result).to.equal(undefined);
    });

    it('no soon birthdays should return undefined', () => {
        const friendlyData: IFriendlyData[] = [testerThirtyDays];
        const result = getBirthdaySMSBody(friendlyData);
        expect(result).to.equal(undefined);
    });

    it('single birthday today should return birthdays-today message', () => {
        const friendlyData: IFriendlyData[] = [testerToday];
        const result = getBirthdaySMSBody(friendlyData);
        expect(result).to.equal(SmsBodies.birthdaysToday(friendlyData[0].name));
    });

    it('single birthday this week should return birthdays-soon message', () => {
        const friendlyData: IFriendlyData[] = [testerSixDays];
        const result = getBirthdaySMSBody(friendlyData);
        expect(result).to.equal(SmsBodies.birthdaysSoon(friendlyData[0].name));
    });

    it('birthdays today and this week should return birthdays-today-and-soon message', () => {
        const friendlyData: IFriendlyData[] = [testerToday, testerSixDays];
        const result = getBirthdaySMSBody(friendlyData);
        expect(result).to.equal(SmsBodies.birthdaysTodayAndSoon(friendlyData[0].name, friendlyData[1].name));
    });
});
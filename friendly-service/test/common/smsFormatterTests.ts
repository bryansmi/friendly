import { IFriendlyData } from "../../src/app";
import { getBirthdaySMSBody } from "../../src/common/smsFormatter";
import { expect } from "chai";
import "mocha";

describe('test describe', () => {
    const friendlyData: IFriendlyData[] = [{
        timestamp: new Date(2019, 3, 1),
        name: "name",
        email: "email",
        countryCode: 1,
        phoneNumber: 2481234567,
        birthday: new Date(1991, 3, 23),
        mailingAddress: "mailingAddress"
    },
    {
        timestamp: new Date(2019, 3, 2),
        name: "name",
        email: "email",
        countryCode: 1,
        phoneNumber: 2481234567,
        birthday: new Date(1991, 3, 23),
        mailingAddress: "mailingAddress"
    }];

    it('test it', () => {
      const result = getBirthdaySMSBody(friendlyData);
      expect(result).to.equal('Hello world!');
    });
});
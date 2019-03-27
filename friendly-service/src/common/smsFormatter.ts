import { IFriendlyData } from "app";
import { SmsBodies } from "./strings";
import moment from "moment";

export function getBirthdaySMSBody(sheetData: Array<IFriendlyData>): string | undefined {
    console.log("Creating SMS body...");
    let upcomingBirthdays: string = '';
    let currentBirthdays: string = '';

    if(sheetData.length === 0) {
        return undefined;
    }

    try {
        const today = moment();
        const sevenDayOffset = moment().add(7, 'days');
        for(let i = 0; i < sheetData.length; i++) {
            const birthday = moment(sheetData[i].birthday);

            if(birthday.dayOfYear() === today.dayOfYear()) {
                currentBirthdays += `${sheetData[i].name}, `;
            }

            const diff = sevenDayOffset.dayOfYear() - birthday.dayOfYear();
            if( diff < 7 && diff >= 0) {
                upcomingBirthdays += `${sheetData[i].name}, `;
            }

            if(i === sheetData.length - 1) {
                if(upcomingBirthdays === '' && currentBirthdays === '') {
                    return undefined;
                }

                upcomingBirthdays = upcomingBirthdays !== '' ? upcomingBirthdays.substring(0, upcomingBirthdays.length - 2) : upcomingBirthdays;
                currentBirthdays = currentBirthdays !== '' ? currentBirthdays.substring(0, currentBirthdays.length - 2) : currentBirthdays;
            }
        }

        if(upcomingBirthdays === '') {
            console.log(`Birthdays today: ${currentBirthdays}`);
            return SmsBodies.birthdaysToday(currentBirthdays);
        } else if(currentBirthdays === '') {
            console.log(`Birthdays soon: ${upcomingBirthdays}`);
            return SmsBodies.birthdaysSoon(upcomingBirthdays);
        } else {
            console.log(`Birthdays today and soon: ${currentBirthdays}, ${upcomingBirthdays}`);
            return SmsBodies.birthdaysTodayAndSoon(currentBirthdays, upcomingBirthdays);
        }
    } catch (error) {
        console.error(`Something went wrong formatting the SMS message: ${error}`);
        return undefined;
    }
}
import { IFriendlyData } from "app";
import { SmsBodies } from "./strings";

export function getBirthdaySMSBody(sheetData: Array<IFriendlyData>): string | undefined {
    let upcomingBirthdays: string = '';
    let currentBirthdays: string = '';

    if(sheetData.length === 0) {
        return undefined;
    }

    try {
        for(let i = 0; i < sheetData.length; i++) {
            const birthDay = sheetData[i].birthday.getDate();
            const birthMonth = sheetData[i].birthday.getMonth();

            let today = new Date();

            if(birthDay === today.getDate() && birthMonth === today.getMonth()) {
                currentBirthdays += `${sheetData[i].name}, `;
            }

            let sevenDays = new Date(today.getTime() + 1000*60*60*24*7);
            let sevenDay = sevenDays.getDate();
            let sevenDayAndBirthDayGap = sevenDay - birthDay;

            if(sevenDayAndBirthDayGap < 7 &&  sevenDayAndBirthDayGap > 0 && birthMonth === sevenDays.getMonth()) {
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
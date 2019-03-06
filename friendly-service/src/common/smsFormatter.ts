import { IFriendlyData } from "app";

export function getBirthdaySMSBody(sheetData: Array<IFriendlyData>): string | undefined {
    let upcomingBirthdays: string = '';
    let currentBirthdays: string = '';

    try {
        for(let i = 0; i < sheetData.length; i++) {
            let today = new Date();
            let sevenDays = new Date(today.getTime() + 1000*60*60*24*7);
            let birthday = sheetData[i].birthday;

            if(birthday.getDate() === sevenDays.getDate() && birthday.getMonth() == sevenDays.getMonth()) {
                upcomingBirthdays += `${sheetData[i].name}, `;
            }

            if(birthday.getDate() === today.getDate() && birthday.getMonth() == today.getMonth()) {
                currentBirthdays += `${sheetData[i].name}, `;
            }
        }

        if (upcomingBirthdays != '') {
            upcomingBirthdays.substring(0, upcomingBirthdays.length - 2);
        }
        if (currentBirthdays!= '') {
            currentBirthdays.substring(0, currentBirthdays.length - 2);
        }

        if(upcomingBirthdays === '' && currentBirthdays === '') {
            return undefined;
        }

        if(upcomingBirthdays === '') {
            return `There's some birthdays today! ${currentBirthdays} have birthdays today. 
            Make sure you wish them a happy birthday!`;
        } else if(currentBirthdays === '') {
            return `There's some birthdays coming up: ${upcomingBirthdays} have birthdays in seven (7) days. 
            Think about doing something nice be ready!`;
        } else {
            return `There's some birthdays today! ${currentBirthdays} have birthdays today. 
            Make sure you wish them a happy birthday!
            Upcoming birthdays: ${upcomingBirthdays}.`;
        }
    } catch (error) {
        console.error(`Something went wrong formatting the SMS message: ${error}`);
        return undefined;
    }
}
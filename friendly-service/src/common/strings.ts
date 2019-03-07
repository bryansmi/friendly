export class SmsBodies {
    public static birthdaysToday(birthdays: string): string { 
        return `There's some birthdays today! ${birthdays} have birthdays today. Make sure you wish them a happy birthday!`;
    }

    public static birthdaysSoon(birthdays: string): string {
        return `${birthdays} have birthdays in seven (7) days. Think about doing something nice!`;
    }

    public static birthdaysTodayAndSoon(birthdaysToday: string, birthdaysSoon: string): string {
        return `${this.birthdaysToday(birthdaysToday)}. Upcoming birthdays: ${birthdaysSoon}.`;
    }
}
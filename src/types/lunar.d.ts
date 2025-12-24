declare module 'lunar-javascript' {
    export class Solar {
        static fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): Solar;
        getLunar(): Lunar;
    }
    export class Lunar {
        getEightChar(): EightChar;
    }
    export class EightChar {
        getYearGan(): string;
        getYearZhi(): string;
        getMonthGan(): string;
        getMonthZhi(): string;
        getDayGan(): string;
        getDayZhi(): string;
        getHourGan(): string;
        getHourZhi(): string;
    }
}

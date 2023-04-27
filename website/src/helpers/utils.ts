export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

const DATE_UNITS: PartialRecord<Intl.RelativeTimeFormatUnit, number> = {
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
};

export const getMSecondsDiff = (date: Date | string): number => {
    const timestamp = date instanceof Date ? date : new Date(date);
    return Date.now() - timestamp.getTime();
};

export const getSecondsDiff = (date: Date | string): number => {
    return getMSecondsDiff(date) / 1000;
};

const getUnitAndValueDate = (secondsElapsed: number) => {
    for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
        if (secondsElapsed >= secondsInUnit || unit === "seconds") {
            const value = Math.floor(secondsElapsed / secondsInUnit) * -1;
            return { value, unit: unit as Intl.RelativeTimeFormatUnit };
        }
    }
};

export const getTimeAgo = (
    date: Date | string,
    language: string,
    options?: Intl.RelativeTimeFormatOptions,
): string => {
    const rtf = new Intl.RelativeTimeFormat(language, {
        numeric: "auto",
        style: "short",
        localeMatcher: "best fit",
        ...options,
    });
    const secondsElapsed = getSecondsDiff(date);
    const { value, unit } = getUnitAndValueDate(secondsElapsed) || {};
    if (!value || !unit) {
        if (secondsElapsed > 0) {
            return "Just now";
        }
        return date.toLocaleString();
    }

    return rtf.format(value, unit);
};

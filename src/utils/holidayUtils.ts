import holidayJp from '@holiday-jp/holiday_jp';

/**
 * 日本の祝日判定。
 * 利用ライブラリ差し替え時はこのファイルのみ変更する。
 */
export const isHoliday = (date: Date): boolean => {
    return holidayJp.isHoliday(date);
};

/**
 * 指定日の祝日名を返す。祝日でなければ null。
 */
export const getHolidayName = (date: Date): string | null => {
    const holidays = holidayJp.between(date, date);
    return holidays[0]?.name ?? null;
};

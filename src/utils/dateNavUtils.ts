import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns';

/** ジャンプ時に前後へ確保する余白日数（無限スクロールの余白） */
export const DATE_NAV_BUFFER_DAYS = 20;

export type DateRangeExtendResult = {
    items: Date[];
    firstItemIndex: number;
    /** Virtuoso に渡す絶対インデックス */
    scrollIndex: number;
    changed: boolean;
};

/**
 * 仮想リストの日付配列を、指定日が表示できるよう前後に伸ばす。
 * すでに範囲内なら配列はそのまま返す。
 */
export const extendItemsToDate = (
    items: Date[],
    firstItemIndex: number,
    targetDate: Date,
    bufferDays: number = DATE_NAV_BUFFER_DAYS,
): DateRangeExtendResult => {
    const target = startOfDay(targetDate);

    if (items.length === 0) {
        const start = addDays(target, -bufferDays);
        const length = bufferDays * 2 + 1;
        const nextItems = Array.from({ length }, (_, i) => addDays(start, i));
        return {
            items: nextItems,
            firstItemIndex,
            scrollIndex: firstItemIndex + bufferDays,
            changed: true,
        };
    }

    const prevFirst = startOfDay(items[0]!);
    const prevLast = startOfDay(items[items.length - 1]!);
    let nextItems = items;
    let nextFirstItemIndex = firstItemIndex;

    if (differenceInCalendarDays(prevFirst, target) > 0) {
        const daysToPrepend = differenceInCalendarDays(prevFirst, target) + bufferDays;
        const start = addDays(target, -bufferDays);
        const prepended = Array.from({ length: daysToPrepend }, (_, i) => addDays(start, i));
        nextItems = [...prepended, ...items];
        nextFirstItemIndex = firstItemIndex - daysToPrepend;
    } else if (differenceInCalendarDays(target, prevLast) > 0) {
        const daysToAppend = differenceInCalendarDays(target, prevLast) + bufferDays;
        const appended = Array.from({ length: daysToAppend }, (_, i) =>
            addDays(prevLast, i + 1),
        );
        nextItems = [...items, ...appended];
    }

    const relativeIndex = differenceInCalendarDays(target, startOfDay(nextItems[0]!));
    return {
        items: nextItems,
        firstItemIndex: nextFirstItemIndex,
        scrollIndex: nextFirstItemIndex + relativeIndex,
        changed: nextItems !== items,
    };
};

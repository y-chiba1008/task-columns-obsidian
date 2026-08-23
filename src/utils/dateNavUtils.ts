import { addDays, startOfDay } from 'date-fns';

/** ジャンプ時に前後へ確保する日数 */
export const DATE_NAV_BUFFER_DAYS = 30;

export type DateWindowResult = {
    items: Date[];
    firstItemIndex: number;
    /** Virtuoso に渡す絶対インデックス */
    scrollIndex: number;
};

/**
 * 指定日を中央にした日付ウィンドウを組み立てる。
 * 双方向無限スクロールのインデックスずれを避けるため、ジャンプのたびに作り直す。
 */
export const buildItemsAroundDate = (
    targetDate: Date,
    bufferDays: number = DATE_NAV_BUFFER_DAYS,
    firstItemIndex: number = 10000,
): DateWindowResult => {
    const target = startOfDay(targetDate);
    const start = addDays(target, -bufferDays);
    const items = Array.from({ length: bufferDays * 2 + 1 }, (_, i) =>
        startOfDay(addDays(start, i)),
    );

    return {
        items,
        firstItemIndex,
        scrollIndex: firstItemIndex + bufferDays,
    };
};

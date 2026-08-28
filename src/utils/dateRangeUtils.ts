import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns';

export type DateRangeState = {
    items: Date[];
    firstItemIndex: number;
};

/**
 * Ensure `target` exists in the date list, expanding the range if needed.
 * Returns the updated list, adjusted firstItemIndex, and absolute index for Virtuoso.
 */
export const ensureDateInRange = (
    state: DateRangeState,
    targetDate: Date,
): DateRangeState & { absoluteIndex: number } => {
    const target = startOfDay(targetDate);

    if (state.items.length === 0) {
        return {
            items: [target],
            firstItemIndex: state.firstItemIndex,
            absoluteIndex: state.firstItemIndex,
        };
    }

    const firstItem = state.items[0];
    const lastItem = state.items[state.items.length - 1];
    if (!firstItem || !lastItem) {
        return {
            items: [target],
            firstItemIndex: state.firstItemIndex,
            absoluteIndex: state.firstItemIndex,
        };
    }

    const first = startOfDay(firstItem);
    const last = startOfDay(lastItem);
    let items = state.items;
    let firstItemIndex = state.firstItemIndex;

    if (target.getTime() < first.getTime()) {
        const count = differenceInCalendarDays(first, target);
        const prepended = Array.from({ length: count }, (_, i) => addDays(target, i));
        items = [...prepended, ...items];
        firstItemIndex -= count;
    } else if (target.getTime() > last.getTime()) {
        const count = differenceInCalendarDays(target, last);
        const appended = Array.from({ length: count }, (_, i) => addDays(last, i + 1));
        items = [...items, ...appended];
    }

    const rangeStart = items[0];
    if (!rangeStart) {
        return {
            items: [target],
            firstItemIndex: state.firstItemIndex,
            absoluteIndex: state.firstItemIndex,
        };
    }

    const relativeIndex = differenceInCalendarDays(target, startOfDay(rangeStart));
    return {
        items,
        firstItemIndex,
        absoluteIndex: firstItemIndex + relativeIndex,
    };
};

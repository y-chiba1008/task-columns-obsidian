import { addDays, format, startOfDay } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListRange, TableVirtuoso, VirtuosoHandle } from 'react-virtuoso';
import type { DateScrollTableProps } from '../hooks/useDateScroll';
import { isToday } from '../utils/dateDisplayUtils';
import { ensureDateInRange } from '../utils/dateRangeUtils';
import DataRow from './DataRow';
import HeaderRow from './HeaderRow';

const INITIAL_FIRST_ITEM_INDEX = 10000;

const TaskTableScroll = ({
    navigationTarget,
    onReferenceDateChange,
    onNavigationComplete,
}: DateScrollTableProps) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const itemsRef = useRef<Date[]>([startOfDay(new Date())]);
    const firstItemIndexRef = useRef(INITIAL_FIRST_ITEM_INDEX);
    const isNavigatingRef = useRef(false);
    const isScrollingRef = useRef(false);
    const latestRangeRef = useRef<ListRange | null>(null);
    const pendingScrollIndexRef = useRef<number | null>(null);

    const [items, setItems] = useState<Date[]>(() => itemsRef.current);
    const [firstItemIndex, setFirstItemIndex] = useState(INITIAL_FIRST_ITEM_INDEX);
    const [scrollTrigger, setScrollTrigger] = useState(0);

    const syncItems = (nextItems: Date[], nextFirstItemIndex: number) => {
        itemsRef.current = nextItems;
        firstItemIndexRef.current = nextFirstItemIndex;
        setItems(nextItems);
        setFirstItemIndex(nextFirstItemIndex);
    };

    const updateReferenceFromRange = useCallback((range: ListRange) => {
        const relativeIndex = range.startIndex - firstItemIndexRef.current;
        const date = itemsRef.current[relativeIndex];
        if (!date) {
            return;
        }
        onReferenceDateChange(startOfDay(date));
    }, [onReferenceDateChange]);

    const scrollToDate = useCallback((targetDate: Date) => {
        const target = startOfDay(targetDate);
        const result = ensureDateInRange(
            {
                items: itemsRef.current,
                firstItemIndex: firstItemIndexRef.current,
            },
            target,
        );

        isNavigatingRef.current = true;
        pendingScrollIndexRef.current = result.relativeIndex;
        syncItems(result.items, result.firstItemIndex);
        setScrollTrigger((value) => value + 1);
    }, []);

    useEffect(() => {
        if (!navigationTarget) {
            return;
        }
        scrollToDate(navigationTarget);
        onNavigationComplete();
    }, [navigationTarget, onNavigationComplete, scrollToDate]);

    useEffect(() => {
        const index = pendingScrollIndexRef.current;
        if (index === null) {
            return;
        }

        pendingScrollIndexRef.current = null;

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                virtuosoRef.current?.scrollToIndex({
                    index,
                    align: 'start',
                    behavior: 'auto',
                });
            });
        });
    }, [scrollTrigger]);

    const prependItems = () => {
        if (isNavigatingRef.current) {
            return;
        }
        const prev = itemsRef.current;
        const firstDate = prev[0] ?? startOfDay(new Date());
        const newItems = Array.from({ length: 20 }, (_, i) => addDays(firstDate, -20 + i));
        syncItems([...newItems, ...prev], firstItemIndexRef.current - 20);
    };

    const appendItems = () => {
        if (isNavigatingRef.current) {
            return;
        }
        const prev = itemsRef.current;
        const lastDate = prev[prev.length - 1] ?? startOfDay(new Date());
        const newItems = Array.from({ length: 20 }, (_, i) => addDays(lastDate, 1 + i));
        syncItems([...prev, ...newItems], firstItemIndexRef.current);
    };

    const handleRangeChanged = useCallback((range: ListRange) => {
        latestRangeRef.current = range;
        if (isNavigatingRef.current || isScrollingRef.current) {
            return;
        }
        updateReferenceFromRange(range);
    }, [updateReferenceFromRange]);

    const handleIsScrolling = useCallback((scrolling: boolean) => {
        isScrollingRef.current = scrolling;
        if (scrolling) {
            return;
        }

        if (isNavigatingRef.current) {
            isNavigatingRef.current = false;
            return;
        }

        if (latestRangeRef.current) {
            updateReferenceFromRange(latestRangeRef.current);
        }
    }, [updateReferenceFromRange]);

    return (
        <TableVirtuoso
            className="task-columns-table-wrapper"
            ref={virtuosoRef}
            data={items}
            computeItemKey={(_index, date) => format(date, 'yyyy-MM-dd')}
            startReached={prependItems}
            endReached={appendItems}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={0}
            isScrolling={handleIsScrolling}
            rangeChanged={handleRangeChanged}
            components={{
                Table: (props) => (
                    <table
                        {...props}
                        className="task-columns-table"
                    />
                ),
                TableRow: ({ item, context: _context, ...props }) => {
                    const index = Number(props['data-index']);
                    const parityClass =
                        index % 2 === 0 ? 'task-columns-row-even' : 'task-columns-row-odd';
                    const todayClass = isToday(item) ? 'task-columns-row-today' : '';
                    return (
                        <tr
                            {...props}
                            className={[parityClass, todayClass].filter(Boolean).join(' ')}
                        />
                    );
                },
                TableFoot: (props) => <tfoot {...props} />,
            }}
            fixedHeaderContent={HeaderRow}
            itemContent={(_index, item) => <DataRow date={item} />}
            fixedFooterContent={() => (
                <tr className="task-columns-footer-row">
                    <DataRow date={null} />
                </tr>
            )}
        />
    );
};

export default TaskTableScroll;

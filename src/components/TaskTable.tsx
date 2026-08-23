import { addDays } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso';
import HeaderRow from './HeaderRow';
import DataRow from './DataRow';
import DateNavBar from './DateNavBar';
import { isToday } from '../utils/dateDisplayUtils';
import { extendItemsToDate } from '../utils/dateNavUtils';

const TaskTable = () => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const topDateRef = useRef<Date>(new Date());
    const pendingScrollIndexRef = useRef<number | null>(null);
    const [items, setItems] = useState<Date[]>([new Date()]);
    const [firstItemIndex, setFirstItemIndex] = useState(10000);

    const prependItems = () => {
        setFirstItemIndex(firstItemIndex - 20);
        setItems((prev) => {
            const firstDate = prev[0] ?? new Date();
            const newItems = Array.from({ length: 20 }, (_, i) => addDays(firstDate, -20 + i));
            return [...newItems, ...prev];
        });
    };

    const appendItems = () => {
        setItems((prev) => {
            const lastDate = prev[prev.length - 1] ?? new Date();
            const newItems = Array.from({ length: 20 }, (_, i) => addDays(lastDate, 1 + i));
            return [...prev, ...newItems];
        });
    };

    const scrollToAbsoluteIndex = useCallback((index: number, behavior: 'auto' | 'smooth') => {
        virtuosoRef.current?.scrollToIndex({
            index,
            align: 'start',
            behavior,
        });
    }, []);

    useEffect(() => {
        if (pendingScrollIndexRef.current === null) return;
        const index = pendingScrollIndexRef.current;
        pendingScrollIndexRef.current = null;
        // データ拡張後に Virtuoso がインデックスを取り込んでからスクロールする
        window.requestAnimationFrame(() => {
            scrollToAbsoluteIndex(index, 'auto');
        });
    }, [items, firstItemIndex, scrollToAbsoluteIndex]);

    const scrollToDate = useCallback(
        (targetDate: Date) => {
            topDateRef.current = targetDate;
            const result = extendItemsToDate(items, firstItemIndex, targetDate);

            if (!result.changed) {
                scrollToAbsoluteIndex(result.scrollIndex, 'smooth');
                return;
            }

            pendingScrollIndexRef.current = result.scrollIndex;
            if (result.firstItemIndex !== firstItemIndex) {
                setFirstItemIndex(result.firstItemIndex);
            }
            setItems(result.items);
        },
        [items, firstItemIndex, scrollToAbsoluteIndex],
    );

    return (
        <div className="task-columns-table-layout">
            <DateNavBar
                getAnchorDate={() => topDateRef.current}
                onNavigate={scrollToDate}
            />
            <TableVirtuoso
                className="task-columns-table-wrapper"
                ref={virtuosoRef}
                data={items}
                startReached={prependItems}
                endReached={appendItems}
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={0}
                rangeChanged={(range) => {
                    const relativeIndex = range.startIndex - firstItemIndex;
                    const date = items[relativeIndex];
                    if (date) {
                        topDateRef.current = date;
                    }
                }}
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
        </div>
    );
};

export default TaskTable;

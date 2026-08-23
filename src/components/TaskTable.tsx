import { addDays, startOfDay } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import HeaderRow from './HeaderRow';
import DataRow from './DataRow';
import DateNavBar from './DateNavBar';
import { isToday } from '../utils/dateDisplayUtils';
import { buildItemsAroundDate, DATE_NAV_BUFFER_DAYS } from '../utils/dateNavUtils';

type DateListState = {
    items: Date[];
    firstItemIndex: number;
    /** Virtuoso を再マウントして初期位置を確実に合わせる */
    listKey: number;
};

const createInitialState = (): DateListState => {
    const window = buildItemsAroundDate(new Date());
    return {
        items: window.items,
        firstItemIndex: window.firstItemIndex,
        listKey: 0,
    };
};

const TaskTable = () => {
    const topDateRef = useRef<Date>(startOfDay(new Date()));
    const suppressLoadMoreRef = useRef(false);
    const suppressTimerRef = useRef<number | null>(null);
    const [listState, setListState] = useState<DateListState>(createInitialState);

    const releaseSuppressSoon = () => {
        if (suppressTimerRef.current !== null) {
            window.clearTimeout(suppressTimerRef.current);
        }
        suppressTimerRef.current = window.setTimeout(() => {
            suppressLoadMoreRef.current = false;
            suppressTimerRef.current = null;
        }, 200);
    };

    const prependItems = () => {
        if (suppressLoadMoreRef.current) return;
        setListState((prev) => {
            const firstDate = prev.items[0] ?? new Date();
            const newItems = Array.from({ length: 20 }, (_, i) =>
                startOfDay(addDays(firstDate, -20 + i)),
            );
            return {
                ...prev,
                firstItemIndex: prev.firstItemIndex - 20,
                items: [...newItems, ...prev.items],
            };
        });
    };

    const appendItems = () => {
        if (suppressLoadMoreRef.current) return;
        setListState((prev) => {
            const lastDate = prev.items[prev.items.length - 1] ?? new Date();
            const newItems = Array.from({ length: 20 }, (_, i) =>
                startOfDay(addDays(lastDate, 1 + i)),
            );
            return {
                ...prev,
                items: [...prev.items, ...newItems],
            };
        });
    };

    const scrollToDate = useCallback((targetDate: Date) => {
        const target = startOfDay(targetDate);
        topDateRef.current = target;
        suppressLoadMoreRef.current = true;

        const window = buildItemsAroundDate(target);
        setListState((prev) => ({
            items: window.items,
            firstItemIndex: window.firstItemIndex,
            listKey: prev.listKey + 1,
        }));
        releaseSuppressSoon();
    }, []);

    return (
        <div className="task-columns-table-layout">
            <DateNavBar
                getAnchorDate={() => topDateRef.current}
                onNavigate={scrollToDate}
            />
            <TableVirtuoso
                key={listState.listKey}
                className="task-columns-table-wrapper"
                data={listState.items}
                startReached={prependItems}
                endReached={appendItems}
                firstItemIndex={listState.firstItemIndex}
                initialTopMostItemIndex={DATE_NAV_BUFFER_DAYS}
                rangeChanged={(range) => {
                    if (suppressLoadMoreRef.current) return;
                    const relativeIndex = range.startIndex - listState.firstItemIndex;
                    const date = listState.items[relativeIndex];
                    if (date) {
                        topDateRef.current = startOfDay(date);
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

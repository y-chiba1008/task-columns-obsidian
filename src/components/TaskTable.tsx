import { addDays, startOfDay } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso';
import HeaderRow from './HeaderRow';
import DataRow from './DataRow';
import DateNavigation from './DateNavigation';
import { isToday } from '../utils/dateDisplayUtils';
import { ensureDateInRange } from '../utils/dateRangeUtils';

const INITIAL_FIRST_ITEM_INDEX = 10000;

const TaskTable = () => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const itemsRef = useRef<Date[]>([startOfDay(new Date())]);
    const firstItemIndexRef = useRef(INITIAL_FIRST_ITEM_INDEX);

    const [items, setItems] = useState<Date[]>(() => itemsRef.current);
    const [firstItemIndex, setFirstItemIndex] = useState(INITIAL_FIRST_ITEM_INDEX);
    const [referenceDate, setReferenceDate] = useState(() => startOfDay(new Date()));

    const syncItems = (nextItems: Date[], nextFirstItemIndex: number) => {
        itemsRef.current = nextItems;
        firstItemIndexRef.current = nextFirstItemIndex;
        setItems(nextItems);
        setFirstItemIndex(nextFirstItemIndex);
    };

    const prependItems = () => {
        const prev = itemsRef.current;
        const firstDate = prev[0] ?? startOfDay(new Date());
        const newItems = Array.from({ length: 20 }, (_, i) => addDays(firstDate, -20 + i));
        syncItems([...newItems, ...prev], firstItemIndexRef.current - 20);
    };

    const appendItems = () => {
        const prev = itemsRef.current;
        const lastDate = prev[prev.length - 1] ?? startOfDay(new Date());
        const newItems = Array.from({ length: 20 }, (_, i) => addDays(lastDate, 1 + i));
        syncItems([...prev, ...newItems], firstItemIndexRef.current);
    };

    const scrollToDate = useCallback((targetDate: Date) => {
        const target = startOfDay(targetDate);
        const result = ensureDateInRange(
            {
                items: itemsRef.current,
                firstItemIndex: firstItemIndexRef.current,
            },
            target,
        );

        syncItems(result.items, result.firstItemIndex);
        setReferenceDate(target);

        window.requestAnimationFrame(() => {
            virtuosoRef.current?.scrollToIndex({
                index: result.absoluteIndex,
                align: 'start',
                behavior: 'auto',
            });
        });
    }, []);

    return (
        <div className="task-columns-table-area">
            <DateNavigation
                referenceDate={referenceDate}
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
                    const relativeIndex = range.startIndex - firstItemIndexRef.current;
                    const date = itemsRef.current[relativeIndex];
                    if (!date) {
                        return;
                    }
                    const next = startOfDay(date);
                    setReferenceDate((prev) => (prev.getTime() === next.getTime() ? prev : next));
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

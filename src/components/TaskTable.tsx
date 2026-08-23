import { addDays } from 'date-fns';
import { useRef, useState } from 'react';
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso';
import HeaderRow from './HeaderRow';
import DataRow from './DataRow';
import { isToday } from '../utils/dateDisplayUtils';

const TaskTable = () => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
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

    return (
        <TableVirtuoso
            className="task-columns-table-wrapper"
            ref={virtuosoRef}
            data={items}
            startReached={prependItems}
            endReached={appendItems}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={0}
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

export default TaskTable;

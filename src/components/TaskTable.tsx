import { addDays, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { TableVirtuoso, Virtuoso, VirtuosoHandle } from 'react-virtuoso'

interface TaskItem {
    content: string | undefined;
}
interface Folder {
    name: string;
    tasks: TaskItem[];
}
interface TasksOfDay {
    date: Date;
    folders: Folder[];
}

// ダミー初期データ
const folderNames = ['フォルダ1', 'フォルダ2'];
const folders = folderNames.map((name) => ({ name, tasks: [] }));
const initialData = Array.from({ length: 40 }, (_, i) => ({ date: addDays(new Date(), i), folders: folders }));

const TaskTable = () => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [items, setItems] = useState<TasksOfDay[]>(initialData);
    const [firstItemIndex, setFirstItemIndex] = useState(10000);

    const prependItems = () => {
        console.log('prependItems');
        setFirstItemIndex(firstItemIndex - 20);
        setItems((prev) => {
            const firstItem = prev[0] ?? { date: new Date(), folders: folders };
            const firstDate = firstItem.date;
            const newItems = Array.from({ length: 20 }, (_, i) => ({ date: addDays(firstDate, -20 + i), folders: folders }));
            return [...newItems, ...prev];
        });
    }

    const appendItems = () => {
        console.log('appendItems');
        setItems((prev) => {
            const lastItem = prev[prev.length - 1] ?? { date: new Date(), folders: folders };
            const lastDate = lastItem.date;
            const newItems = Array.from({ length: 20 }, (_, i) => ({ date: addDays(lastDate, 1 + i), folders: folders }));
            return [...prev, ...newItems];
        });
    }

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
                TableRow: (props) => (
                    <tr
                        {...props}
                        className="task-columns-row"
                    />
                )
            }}
            fixedHeaderContent={() => (
                <tr className="task-columns-header-row">
                    <th className="task-columns-header-cell task-columns-date-header">
                        <span className="task-columns-header-label">日付</span>
                        <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                    </th>

                    <th className="task-columns-header-cell task-columns-category-header">
                        <span className="task-columns-header-label">フォルダ1</span>
                        <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                    </th>
                    <th className="task-columns-header-cell task-columns-category-header">
                        <span className="task-columns-header-label">フォルダ2</span>
                        <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                    </th>
                </tr>
            )}
            itemContent={(index, item) => {
                return (
                    <>
                        <td className="task-columns-cell task-columns-date-cell">{format(item.date, 'yyyy/MM/dd')}</td>
                        <td className="task-columns-cell"></td>
                        <td className="task-columns-cell"></td>
                    </>
                );
            }}
        />
    );
};

export default TaskTable;
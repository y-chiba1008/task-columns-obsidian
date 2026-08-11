import { addDays, format } from "date-fns";
import { useRef, useState } from "react";
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso'
import HeaderRow from "./HeaderRow";
import { useVaultFilesStore } from "../stores/vaultFilesStore";
import TaskCell from "./TaskCell";

// ダミー初期データ
interface TaskItem {
    date: Date;
    folder: string;
    title: string;
}

const dummyFiles = [
    { date: new Date(2026, 7, 1), folder: 'カテゴリ1', title: 'ファイル1' },
    { date: new Date(2026, 7, 2), folder: 'カテゴリ1', title: 'ファイル2' },
    { date: new Date(2026, 7, 3), folder: 'カテゴリ1', title: 'ファイル3' },
    { date: new Date(2026, 7, 4), folder: 'カテゴリ1', title: 'ファイル4' },
    { date: new Date(2026, 7, 5), folder: 'カテゴリ2', title: 'ファイル5' },
    { date: new Date(2026, 7, 6), folder: 'カテゴリ2', title: 'ファイル6' },
    { date: new Date(2026, 7, 7), folder: 'カテゴリ2', title: 'ファイル7' },
    { date: new Date(2026, 7, 8), folder: 'カテゴリ2', title: 'ファイル8' },
    { date: new Date(2026, 7, 9), folder: 'カテゴリ3', title: 'ファイル9' },
];

const TaskTable = () => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const folders = useVaultFilesStore(state => state.folders);
    const [items, setItems] = useState<TaskItem[]>(dummyFiles);
    const [firstItemIndex, setFirstItemIndex] = useState(10000);

    const prependItems = () => {
        setFirstItemIndex(firstItemIndex - 20);
        setItems((prev) => {
            const firstItem = prev[0] ?? { date: new Date(), folder: 'カテゴリX', title: 'ファイルX' };
            const firstDate = firstItem.date;
            const newItems = Array.from({ length: 20 }, (_, i) => ({ date: addDays(firstDate, -20 + i), folder: 'カテゴリX', title: 'ファイルX' }));
            return [...newItems, ...prev];
        });
    }

    const appendItems = () => {
        setItems((prev) => {
            const lastItem = prev[prev.length - 1] ?? { date: new Date(), folder: 'カテゴリX', title: 'ファイルX' };
            const lastDate = lastItem.date;
            const newItems = Array.from({ length: 20 }, (_, i) => ({ date: addDays(lastDate, 1 + i), folder: 'カテゴリX', title: 'ファイルX' }));
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
                TableRow: (props) => {
                    const index = Number(props['data-index']);
                    const parityClass = index % 2 === 0 ? 'task-columns-row-even' : 'task-columns-row-odd';
                    return (
                        <tr
                            {...props}
                            className={`task-columns-row ${parityClass}`}
                        />
                    );
                }
            }}
            fixedHeaderContent={HeaderRow}
            itemContent={(_index, item) => {
                return (
                    <>
                        <td className="task-columns-cell task-columns-date-cell">{format(item.date, 'yyyy/MM/dd')}</td>
                        {folders.map((folder) => (
                            <TaskCell date={item.date} folder={folder.name} />
                        ))}
                    </>
                );
            }}
        />
    );
};

export default TaskTable;
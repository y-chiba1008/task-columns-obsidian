import { format } from "date-fns";
import { useVaultFilesStore } from "../stores/vaultFilesStore";
import TaskCell from "./TaskCell";
import { generateCellKey } from "../common";

const DataRow = ({date}: {date: Date | null}) => {
    const folders = useVaultFilesStore(state => state.folders);

    const dateString = date ? format(date, 'yyyy/MM/dd') : '日付なし';

    return (
        <>
            <th className="task-columns-cell task-columns-date-cell">{dateString}</th>
            {folders.map((folder) => (
                <TaskCell
                    date={date}
                    folder={folder.name}
                    key={generateCellKey(date, folder.name)} />
            ))}
        </>
    );
};

export default DataRow;
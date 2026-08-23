import { useVaultFilesStore } from '../stores/vaultFilesStore';
import TaskCell from './TaskCell';
import { generateCellKey } from '../utils/keyUtils';
import {
    dateToneClassName,
    formatDateLabel,
    getDateColorTone,
} from '../utils/dateDisplayUtils';

const DataRow = ({ date }: { date: Date | null }) => {
    const folders = useVaultFilesStore((state) => state.folders);

    const toneClass = date ? dateToneClassName(getDateColorTone(date)) : '';
    const label = date ? formatDateLabel(date) : null;
    const dateCellClass = [
        'task-columns-cell',
        'task-columns-date-cell',
        toneClass,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <th className={dateCellClass}>
                {label ? (
                    <>
                        <div className="task-columns-date-text">{label.dateText}</div>
                        {label.holidayName && (
                            <div className="task-columns-holiday-name">{label.holidayName}</div>
                        )}
                    </>
                ) : (
                    '日付なし'
                )}
            </th>
            {folders.map((folder) => (
                <TaskCell
                    date={date}
                    folder={folder.name}
                    key={generateCellKey(date, folder.name)}
                />
            ))}
        </>
    );
};

export default DataRow;

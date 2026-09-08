import { useVaultFilesStore } from '../stores/vaultFilesStore';
import Cell from './Cell';
import { generateGroupKey } from '../utils/keyUtils';
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
        'dated-notes-table-cell',
        'dated-notes-table-date-cell',
        toneClass,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <th className={dateCellClass}>
                {label ? (
                    <>
                        <div className="dated-notes-table-date-text">{label.dateText}</div>
                        {label.holidayName && (
                            <div className="dated-notes-table-holiday-name">{label.holidayName}</div>
                        )}
                    </>
                ) : (
                    '日付なし'
                )}
            </th>
            {folders.map((folder) => (
                <Cell
                    date={date}
                    folder={folder.name}
                    key={generateGroupKey(date, folder.name)}
                />
            ))}
        </>
    );
};

export default DataRow;

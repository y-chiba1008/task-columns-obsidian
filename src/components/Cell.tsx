import NoteModel from '../models/noteModel';
import { useOpenNote } from '../hooks/useOpenNote';
import { useVaultFilesStore } from '../stores/vaultFilesStore';
import { generateGroupKey } from '../utils/keyUtils';

const EMPTY_NOTES: NoteModel[] = [];

const Cell = ({ date, folder }: { date: Date | null, folder: string }) => {
    const groupKey = generateGroupKey(date, folder);
    const openNote = useOpenNote();
    const notes = useVaultFilesStore(
        (state) => state.noteGroups.get(groupKey) ?? EMPTY_NOTES,
    );

    return (
        <td className="dated-notes-table-cell" key={groupKey}>
            {notes.map((note) => (
                <div className="dated-notes-table-note" key={note.path}>
                    <span
                        className="dated-notes-table-note-text"
                        onClick={() => openNote(note.path)}
                    >
                        {note.title}
                    </span>
                </div>
            ))}
        </td>
    );
};

export default Cell;

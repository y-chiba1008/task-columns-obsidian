import { create } from 'zustand';
import FolderModel from '../models/folderModel';
import NoteModel from '../models/noteModel';

interface VaultFilesState {
    noteGroups: Map<string, NoteModel[]>;
    folders: FolderModel[];
    replaceAll: (notes: NoteModel[], folders: FolderModel[]) => void;
    removeByPath: (path: string) => void;
    upsertNote: (note: NoteModel) => void;
}

function groupNotesByGroupKey(notes: NoteModel[]): Map<string, NoteModel[]> {
    const groups = new Map<string, NoteModel[]>();
    for (const note of notes) {
        const list = groups.get(note.groupKey) ?? [];
        list.push(note);
        groups.set(note.groupKey, list);
    }
    for (const [key, list] of groups) {
        groups.set(key, NoteModel.sortNotes(list));
    }
    return groups;
}

function removeNoteByPath(
    noteGroups: Map<string, NoteModel[]>,
    path: string,
): Map<string, NoteModel[]> {
    const nextNoteGroups = new Map(noteGroups);

    for (const [groupKey, notes] of nextNoteGroups) {
        const filtered = notes.filter((note) => note.path !== path);
        if (filtered.length === notes.length) {
            continue;
        }
        if (filtered.length === 0) {
            nextNoteGroups.delete(groupKey);
        } else {
            nextNoteGroups.set(groupKey, filtered);
        }
    }

    return nextNoteGroups;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    noteGroups: new Map<string, NoteModel[]>(),
    folders: [],
    replaceAll: (notes, folders) => {
        set({
            noteGroups: groupNotesByGroupKey(notes),
            folders,
        });
    },

    removeByPath: (path) => {
        set((state) => ({
            noteGroups: removeNoteByPath(state.noteGroups, path),
        }));
    },

    upsertNote: (note) => {
        set((state) => {
            const nextNoteGroups = removeNoteByPath(state.noteGroups, note.path);
            const prevNotes = nextNoteGroups.get(note.groupKey) ?? [];
            nextNoteGroups.set(note.groupKey, NoteModel.sortNotes([...prevNotes, note]));
            return { noteGroups: nextNoteGroups };
        });
    },
}));

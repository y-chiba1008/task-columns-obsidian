import { generateGroupKey } from '../utils/keyUtils';

class NoteModel {
    constructor(
        public readonly path: string,
        public readonly datetime: Date | null,
        public readonly folder: string,
        public readonly title: string,
    ) { }

    public get groupKey(): string {
        return generateGroupKey(this.datetime, this.folder);
    }

    public static compareNotes(a: NoteModel, b: NoteModel): number {
        const ta = a.datetime?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const tb = b.datetime?.getTime() ?? Number.MAX_SAFE_INTEGER;
        if (ta !== tb) return ta - tb;
        return a.title.localeCompare(b.title, 'ja');
    }

    public static sortNotes(notes: NoteModel[]): NoteModel[] {
        return [...notes].sort((a, b) => NoteModel.compareNotes(a, b));
    }
}

export default NoteModel;

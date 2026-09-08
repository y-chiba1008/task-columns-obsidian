import { App, TFile, TFolder } from 'obsidian';
import FolderModel from '../models/folderModel';
import NoteModel from '../models/noteModel';
import { DatedNotesTableSettings } from '../settings';
import { isUnderExcludedPath, parseExcludedFolders } from '../utils/pathUtils';

export class VaultRepository {
    constructor(
        private readonly app: App,
        private readonly getSettings: () => DatedNotesTableSettings,
    ) {}

    listNotes(): NoteModel[] {
        return this.app.vault
            .getMarkdownFiles()
            .filter((file) => this.isUnderTargetFolder(file.path))
            .filter((file) => !this.isExcluded(file.path))
            .map((file) => this.parseNote(file));
    }

    listFolders(): FolderModel[] {
        return this.app.vault
            .getAllFolders()
            .filter((folder) => this.isUnderTargetFolder(folder.path))
            .filter((folder) => !this.isExcluded(folder.path))
            .map((folder) => this.toFolderModel(folder));
    }

    parseNoteByPath(path: string): NoteModel | null {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) {
            return null;
        }
        return this.parseNote(file);
    }

    isUnderTargetFolder(path: string): boolean {
        return path.startsWith(this.getSettings().targetFolder + '/');
    }

    isExcluded(path: string): boolean {
        return isUnderExcludedPath(path, this.getExcludedFolders());
    }

    private parseNote(file: TFile): NoteModel {
        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
        const datetime = (frontmatter?.datetime && typeof frontmatter.datetime === 'string')
            ? new Date(frontmatter.datetime)
            : null;
        return new NoteModel(
            file.path,
            datetime,
            file.parent?.name ?? '',
            file.basename,
        );
    }

    private toFolderModel(folder: TFolder): FolderModel {
        return new FolderModel(folder.path, folder.name);
    }

    private getExcludedFolders(): string[] {
        return parseExcludedFolders(this.getSettings().excludedFolders);
    }

    // Future: createNote, updateNote, deleteNote, etc.
}

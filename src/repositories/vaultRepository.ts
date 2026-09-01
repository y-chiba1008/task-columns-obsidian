import { App, TFile, TFolder } from 'obsidian';
import TaskModel from '../models/taskModel';
import { TaskColumnsSettings } from '../settings';
import { isUnderExcludedPath, parseExcludedFolders } from '../utils/pathUtils';

export class VaultRepository {
    constructor(
        private readonly app: App,
        private readonly settings: TaskColumnsSettings,
    ) {}

    listTasks(): TaskModel[] {
        return this.app.vault
            .getMarkdownFiles()
            .filter((file) => this.isUnderTargetFolder(file.path))
            .filter((file) => !this.isExcluded(file.path))
            .map((file) => this.parseTask(file));
    }

    listFolders(): TFolder[] {
        return this.app.vault
            .getAllFolders()
            .filter((folder) => this.isUnderTargetFolder(folder.path))
            .filter((folder) => !this.isExcluded(folder.path));
    }

    parseTask(file: TFile): TaskModel {
        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
        const datetime = (frontmatter?.datetime && typeof frontmatter.datetime === 'string')
            ? new Date(frontmatter.datetime)
            : null;
        return new TaskModel(
            file.path,
            datetime,
            file.parent?.name ?? '',
            file.basename,
        );
    }

    isUnderTargetFolder(path: string): boolean {
        return path.startsWith(this.settings.targetFolder + '/');
    }

    isExcluded(path: string): boolean {
        return isUnderExcludedPath(path, this.getExcludedFolders());
    }

    private getExcludedFolders(): string[] {
        return parseExcludedFolders(this.settings.excludedFolders);
    }

    // Future: createTask, updateTask, deleteTask, etc.
}

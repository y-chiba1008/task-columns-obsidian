import { format } from "date-fns";
import { App, TFile } from "obsidian";
import { generateCellKey } from "../common";

class TaskModel {
    constructor(
        public readonly date: Date,
        public readonly folder: string,
        public readonly title: string,
    ) { }

    public static fromFile(file: TFile, app: App): TaskModel {
        const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
        return new TaskModel(
            frontmatter?.date ? new Date(frontmatter.date) : new Date(),
            file.parent?.name ?? '',
            file.basename,
        );
    }

    public get cellKey(): string {
        return generateCellKey(this.date, this.folder);
    }

    public get taskKey(): string {
        return `${this.cellKey}-${this.title}`;
    }
}

export default TaskModel;
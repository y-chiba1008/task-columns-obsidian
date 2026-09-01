import { generateCellKey } from '../utils/keyUtils';

class TaskModel {
    constructor(
        public readonly path: string,
        public readonly datetime: Date | null,
        public readonly folder: string,
        public readonly title: string,
    ) { }

    public get cellKey(): string {
        return generateCellKey(this.datetime, this.folder);
    }

    public get taskKey(): string {
        return this.path;
    }

    public static compareTasks(a: TaskModel, b: TaskModel): number {
        const ta = a.datetime?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const tb = b.datetime?.getTime() ?? Number.MAX_SAFE_INTEGER;
        if (ta !== tb) return ta - tb;
        return a.title.localeCompare(b.title, 'ja');
    }

    public static sortTasks(tasks: TaskModel[]): TaskModel[] {
        return [...tasks].sort((a, b) => TaskModel.compareTasks(a, b));
    }
}

export default TaskModel;

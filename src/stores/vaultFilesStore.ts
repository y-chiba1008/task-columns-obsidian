import { create } from 'zustand';
import FolderModel from '../models/folderModel';
import TaskModel from '../models/taskModel';

interface VaultFilesState {
    fileGroups: Map<string, TaskModel[]>;
    folders: FolderModel[];
    replaceAll: (tasks: TaskModel[], folders: FolderModel[]) => void;
    removeByPath: (path: string) => void;
    upsertTask: (task: TaskModel) => void;
}

function groupTasksByCellKey(tasks: TaskModel[]): Map<string, TaskModel[]> {
    const groups = new Map<string, TaskModel[]>();
    for (const task of tasks) {
        const list = groups.get(task.cellKey) ?? [];
        list.push(task);
        groups.set(task.cellKey, list);
    }
    for (const [key, list] of groups) {
        groups.set(key, TaskModel.sortTasks(list));
    }
    return groups;
}

function removeTaskByPath(
    fileGroups: Map<string, TaskModel[]>,
    path: string,
): Map<string, TaskModel[]> {
    const nextFileGroups = new Map(fileGroups);

    for (const [cellKey, tasks] of nextFileGroups) {
        const filtered = tasks.filter((task) => task.path !== path);
        if (filtered.length === tasks.length) {
            continue;
        }
        if (filtered.length === 0) {
            nextFileGroups.delete(cellKey);
        } else {
            nextFileGroups.set(cellKey, filtered);
        }
    }

    return nextFileGroups;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    fileGroups: new Map<string, TaskModel[]>(),
    folders: [],
    replaceAll: (tasks, folders) => {
        set({
            fileGroups: groupTasksByCellKey(tasks),
            folders,
        });
    },

    removeByPath: (path) => {
        set((state) => ({
            fileGroups: removeTaskByPath(state.fileGroups, path),
        }));
    },

    upsertTask: (task) => {
        set((state) => {
            const nextFileGroups = removeTaskByPath(state.fileGroups, task.path);
            const prevTasks = nextFileGroups.get(task.cellKey) ?? [];
            nextFileGroups.set(task.cellKey, TaskModel.sortTasks([...prevTasks, task]));
            return { fileGroups: nextFileGroups };
        });
    },
}));

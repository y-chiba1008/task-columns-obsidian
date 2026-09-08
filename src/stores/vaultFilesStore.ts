import { create } from 'zustand';
import { App } from 'obsidian';
import TaskColumnsPlugin from '../main';
import FolderModel from '../models/folderModel';
import TaskModel from '../models/taskModel';
import { VaultRepository } from '../repositories/vaultRepository';

interface VaultFilesState {
    app: App | null;
    fileGroups: Map<string, TaskModel[]>;
    folders: FolderModel[];
    refresh: (app: App, plugin: TaskColumnsPlugin) => void;
    update: (path: string, app: App, plugin: TaskColumnsPlugin) => void;
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

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    app: null,
    fileGroups: new Map<string, TaskModel[]>(),
    folders: [],
    refresh: (app: App, plugin: TaskColumnsPlugin) => {
        const repo = new VaultRepository(app, plugin.settings);
        const fileGroups = groupTasksByCellKey(repo.listTasks());
        const folders = repo.listFolders();
        set({ app, fileGroups, folders });
    },

    update: (path: string, app: App, plugin: TaskColumnsPlugin) => {
        const repo = new VaultRepository(app, plugin.settings);
        if (!repo.isUnderTargetFolder(path)) {
            return;
        }

        const taskModel = repo.parseTaskByPath(path);
        if (!taskModel) {
            return;
        }

        const isExcluded = repo.isExcluded(path);
        set((state) => {
            const nextFileGroups = new Map(state.fileGroups);

            for (const [cellKey, tasks] of nextFileGroups) {
                const filtered = tasks.filter((task) => task.path !== taskModel.path);
                if (filtered.length === tasks.length) {
                    continue;
                }
                if (filtered.length === 0) {
                    nextFileGroups.delete(cellKey);
                } else {
                    nextFileGroups.set(cellKey, filtered);
                }
            }

            if (!isExcluded) {
                const prevTasks = nextFileGroups.get(taskModel.cellKey) ?? [];
                nextFileGroups.set(taskModel.cellKey, TaskModel.sortTasks([...prevTasks, taskModel]));
            }
            return { fileGroups: nextFileGroups };
        });
    },
}));

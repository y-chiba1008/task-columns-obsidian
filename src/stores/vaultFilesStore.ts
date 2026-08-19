import { create } from "zustand";
import { App, TFile, TFolder } from "obsidian";
import { isUnderExcludedPath, parseExcludedFolders } from "../common";
import TaskColumnsPlugin from "../main";
import TaskModel from "../models/taskModel";

interface VaultFilesState {
    fileGroups: Map<string, TaskModel[]>;
    folders: TFolder[];
    refresh: (app: App, plugin: TaskColumnsPlugin) => void;
    update: (file: TFile, app: App, plugin: TaskColumnsPlugin) => void;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    fileGroups: new Map<string, TaskModel[]>(),
    folders: [],
    refresh: (app: App, plugin: TaskColumnsPlugin) => {
        const targetFolder = plugin.settings.targetFolder;
        const excludedFolders = parseExcludedFolders(plugin.settings.excludedFolders);

        // ファイルを日付・フォルダごとにグループ化
        const fileGroups = new Map();
        app.vault
            .getMarkdownFiles()
            .filter((file) => file.path.startsWith(targetFolder + '/'))
            .filter((file) => !isUnderExcludedPath(file.path, excludedFolders))
            .map((file) => TaskModel.fromFile(file, app))
            .forEach((taskModel) => {
                if (!fileGroups.has(taskModel.cellKey)) {
                    fileGroups.set(taskModel.cellKey, []);
                }
                fileGroups.get(taskModel.cellKey)?.push(taskModel);
            });
        for (const [cellKey, tasks] of fileGroups) {
            fileGroups.set(cellKey, TaskModel.sortTasks(tasks));
        }

        // フォルダーを取得
        const folders = app.vault
            .getAllFolders()
            .filter((folder) => folder.path.startsWith(targetFolder + '/'))
            .filter((folder) => !isUnderExcludedPath(folder.path, excludedFolders));

        // ステートを更新
        set({ fileGroups: fileGroups, folders: folders });
    },

    update: (file: TFile, app: App, plugin: TaskColumnsPlugin) => {
        const targetFolder = plugin.settings.targetFolder;
        if (!file.path.startsWith(targetFolder + '/')) {
            return;
        }

        const excludedFolders = parseExcludedFolders(plugin.settings.excludedFolders);
        const isExcluded = isUnderExcludedPath(file.path, excludedFolders);
        const taskModel = TaskModel.fromFile(file, app);
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
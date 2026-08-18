import { create } from "zustand";
import { App, TFile, TFolder } from "obsidian";
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

        // ファイルを日付・フォルダごとにグループ化
        const fileGroups = new Map();
        app.vault
            .getMarkdownFiles()
            .filter((file) => file.path.startsWith(targetFolder + '/'))
            .map((file) => TaskModel.fromFile(file, app))
            .forEach((taskModel) => {
                if (!fileGroups.has(taskModel.cellKey)) {
                    fileGroups.set(taskModel.cellKey, []);
                }
                fileGroups.get(taskModel.cellKey)?.push(taskModel);
            });

        // フォルダーを取得
        const folders = app.vault
            .getAllFolders()
            .filter((folder) => folder.path.startsWith(targetFolder + '/'));

        // ステートを更新
        set({ fileGroups: fileGroups, folders: folders });
    },

    update: (file: TFile, app: App, plugin: TaskColumnsPlugin) => {
        const targetFolder = plugin.settings.targetFolder;
        if (!file.path.startsWith(targetFolder + '/')) {
            return;
        }

        const taskModel = TaskModel.fromFile(file, app);
        set((state) => {
            const nextFileGroups = new Map(state.fileGroups);
            const prevTasks = nextFileGroups.get(taskModel.cellKey) ?? [];
            const nextTasks = [
                ...prevTasks.filter((task) => task.taskKey !== taskModel.taskKey),
                taskModel,
            ];
            nextFileGroups.set(taskModel.cellKey, nextTasks);
            return { fileGroups: nextFileGroups };
        });
    },
}));
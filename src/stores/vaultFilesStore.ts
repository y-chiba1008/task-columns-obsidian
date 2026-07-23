import { create } from "zustand";
import { App, TFile, TFolder } from "obsidian";
import TaskColumnsPlugin from "../main";

interface VaultFilesState {
    files: TFile[];
    folders: TFolder[];
    refresh: (app: App, plugin: TaskColumnsPlugin) => void;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    files: [],
    folders: [],
    refresh: (app: App, plugin: TaskColumnsPlugin) => {
        const targetFolder = plugin.settings.targetFolder;
        const files = app.vault
            .getMarkdownFiles()
            .filter((file) => file.path.startsWith(targetFolder + '/'));
        const folders = app.vault
            .getAllFolders()
            .filter((folder) => folder.path.startsWith(targetFolder + '/'));
        set({ files: files, folders: folders });
    },
}));
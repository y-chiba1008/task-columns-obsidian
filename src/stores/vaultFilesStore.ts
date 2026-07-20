import { create } from "zustand";
import { App, TFile } from "obsidian";
import TaskColumnsPlugin from "../main";

interface VaultFilesState {
    files: TFile[];
    refresh: (app: App, plugin: TaskColumnsPlugin) => void;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    files: [],
    refresh: (app: App, plugin: TaskColumnsPlugin) => {
        const targetFolder = plugin.settings.targetFolder;
        const files = app.vault
            .getMarkdownFiles()
            .filter((file) => file.path.startsWith(targetFolder + '/'));
        set({ files: files });
    },
}));
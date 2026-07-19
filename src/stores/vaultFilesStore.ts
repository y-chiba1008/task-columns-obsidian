import { create } from "zustand";
import { App, TFile } from "obsidian";

interface VaultFilesState {
    files: TFile[];
    refresh: (app: App) => void;
}

export const useVaultFilesStore = create<VaultFilesState>((set) => ({
    files: [],
    refresh: (app: App) => set({ files: app.vault.getMarkdownFiles() }),
}));
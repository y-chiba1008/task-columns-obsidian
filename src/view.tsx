import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import ViewRoot from "./components/ViewRoot";
import { useVaultFilesStore } from "./stores/vaultFilesStore";
import TaskColumnsPlugin from "./main";

export const VIEW_TYPE_TASK_COLUMNS_VIEW = "task-columns-view";

const METADATA_UPDATE_DEBOUNCE_MS = 200;

export class TaskColumnsView extends ItemView {
    private root: Root | null = null;
    private plugin: TaskColumnsPlugin;
    private metadataUpdateTimers = new Map<string, number>();

    constructor(leaf: WorkspaceLeaf, plugin: TaskColumnsPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_TASK_COLUMNS_VIEW;
    }

    getDisplayText(): string {
        return "Task columns view";
    }

    getIcon(): string {
        return "dice"; // Obsidian組み込みのlucideアイコン名
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        if (!container) return;
        this.root = createRoot(container);

        // ファイル一覧を取得
        useVaultFilesStore.getState().refresh(this.app, this.plugin);

        // ファイルと設定の変更イベント監視 → storeを更新
        this.registerEvent(
            this.app.metadataCache.on("changed", (file) => this.scheduleMetadataUpdate(file))
        );
        this.registerEvent(
            this.app.vault.on("rename", () => useVaultFilesStore.getState().refresh(this.app, this.plugin))
        );
        this.registerEvent(
            this.app.vault.on("create", () => useVaultFilesStore.getState().refresh(this.app, this.plugin))
        );
        this.registerEvent(
            this.app.vault.on("delete", () => useVaultFilesStore.getState().refresh(this.app, this.plugin))
        );
        this.registerEvent(
            this.plugin.settingsEvents.on("changed", () => useVaultFilesStore.getState().refresh(this.app, this.plugin))
        );

        this.root.render(
            <StrictMode>
                <ViewRoot />
            </StrictMode>
        );
    }

    async onClose() {
        for (const timer of this.metadataUpdateTimers.values()) {
            window.clearTimeout(timer);
        }
        this.metadataUpdateTimers.clear();
        this.root?.unmount();
    }

    private scheduleMetadataUpdate(file: TFile) {
        const existing = this.metadataUpdateTimers.get(file.path);
        if (existing !== undefined) {
            window.clearTimeout(existing);
        }

        const timer = window.setTimeout(() => {
            this.metadataUpdateTimers.delete(file.path);
            useVaultFilesStore.getState().update(file, this.app, this.plugin);
        }, METADATA_UPDATE_DEBOUNCE_MS);
        this.metadataUpdateTimers.set(file.path, timer);
    }
}
import { ItemView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import ViewRoot from "./components/ViewRoot";
import { useVaultFilesStore } from "./stores/vaultFilesStore";
import TaskColumnsPlugin from "./main";

export const VIEW_TYPE_TASK_COLUMNS_VIEW = "task-columns-view";

export class TaskColumnsView extends ItemView {
    private root: Root | null = null;
    private plugin: TaskColumnsPlugin;

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
            this.app.vault.on("modify", () => useVaultFilesStore.getState().refresh(this.app, this.plugin))
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
        this.root?.unmount();
    }
}
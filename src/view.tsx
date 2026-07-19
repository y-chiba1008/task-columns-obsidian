import { ItemView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import ViewRoot from "./components/ViewRoot";

export const VIEW_TYPE_TASK_COLUMNS_VIEW = "task-columns-view";

export class TaskColumnsView extends ItemView {
    private root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE_TASK_COLUMNS_VIEW;
    }

    getDisplayText(): string {
        return "Task Columns View";
    }

    getIcon(): string {
        return "dice"; // Obsidian組み込みのlucideアイコン名
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        if (!container) return;
        this.root = createRoot(container);
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
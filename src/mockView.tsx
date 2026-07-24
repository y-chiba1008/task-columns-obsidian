import { ItemView, WorkspaceLeaf } from "obsidian";
import mockViewHtml from "../mocks/mock.html";
import TaskColumnsPlugin from "./main";

export const VIEW_TYPE_TASK_COLUMNS_MOCK_VIEW = "task-columns--mock-view";

export class TaskColumnsMockView extends ItemView {
    private plugin: TaskColumnsPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: TaskColumnsPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_TASK_COLUMNS_MOCK_VIEW;
    }

    getDisplayText(): string {
        return "Task columns mock view";
    }

    getIcon(): string {
        return "monitor"; // Obsidian組み込みのlucideアイコン名
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        if (!(container instanceof HTMLElement)) return;
        container.empty();
        container.innerHTML = mockViewHtml;
    }

    async onClose() {
        const container = this.containerEl.children[1];
        if (container instanceof HTMLElement) {
            container.empty();
        }
    }
}
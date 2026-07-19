import { Plugin, WorkspaceLeaf } from "obsidian";
import { TaskColumnsView, VIEW_TYPE_TASK_COLUMNS_VIEW } from "./view";

export default class MyPlugin extends Plugin {
    async onload() {
        this.registerView(
            VIEW_TYPE_TASK_COLUMNS_VIEW,
            (leaf) => new TaskColumnsView(leaf)
        );

        this.addRibbonIcon("dice", "Open My View", () => {
            this.activateView();
        });

        this.addCommand({
            id: "open-task-columns-view",
            name: "Open Task Columns View",
            callback: () => this.activateView(),
        });
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_TASK_COLUMNS_VIEW);

        if (leaves.length > 0) {
            // 既に開いていればそれを使う
            leaf = leaves[0] ?? null;
        } else {
            // 新しいタブに新規作成
            leaf = workspace.getLeaf(true);
            await leaf?.setViewState({ type: VIEW_TYPE_TASK_COLUMNS_VIEW, active: true });
        }

        if (leaf) workspace.revealLeaf(leaf);
    }

    onunload() {
    }
}
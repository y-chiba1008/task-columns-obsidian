import { Plugin, WorkspaceLeaf } from "obsidian";
import { TaskColumnsView, VIEW_TYPE_TASK_COLUMNS_VIEW } from "./view";
import {
    DEFAULT_SETTINGS,
    TaskColumnsSettings,
    TaskColumnsSettingTab,
} from './settings';

export default class TaskColumnsPlugin extends Plugin {
    settings!: TaskColumnsSettings;

    async onload() {
        await this.loadSettings();
        this.registerView(
            VIEW_TYPE_TASK_COLUMNS_VIEW,
            (leaf) => new TaskColumnsView(leaf)
        );

        this.addRibbonIcon("dice", "Open my view", async () => {
            await this.activateView();
        });

        this.addCommand({
            id: "open-tasks-view",
            name: "Open tasks view",
            callback: () => this.activateView(),
        });

        this.addSettingTab(new TaskColumnsSettingTab(this.app, this));
    }

    onunload() {
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

        if (leaf) await workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            (await this.loadData()) as Partial<TaskColumnsSettings>,
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
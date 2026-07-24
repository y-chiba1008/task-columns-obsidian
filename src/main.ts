import { Events, Plugin, WorkspaceLeaf } from "obsidian";
import { TaskColumnsView, VIEW_TYPE_TASK_COLUMNS_VIEW } from "./view";
import {
    DEFAULT_SETTINGS,
    TaskColumnsSettings,
    TaskColumnsSettingTab,
} from './settings';
import { TaskColumnsMockView, VIEW_TYPE_TASK_COLUMNS_MOCK_VIEW } from "./mockView";

export default class TaskColumnsPlugin extends Plugin {
    settings!: TaskColumnsSettings;
    settingsEvents = new Events();

    async onload() {
        await this.loadSettings();
        this.registerView(
            VIEW_TYPE_TASK_COLUMNS_VIEW,
            (leaf) => new TaskColumnsView(leaf, this)
        );

        this.addRibbonIcon("dice", "Open my view", async () => {
            await this.activateView(VIEW_TYPE_TASK_COLUMNS_VIEW);
        });

        this.addCommand({
            id: "open-tasks-view",
            name: "Open tasks view",
            callback: () => this.activateView(VIEW_TYPE_TASK_COLUMNS_VIEW),
        });

        this.addSettingTab(new TaskColumnsSettingTab(this.app, this));

        // モック
        this.registerView(
            VIEW_TYPE_TASK_COLUMNS_MOCK_VIEW,
            (leaf) => new TaskColumnsMockView(leaf, this)
        );
        this.addRibbonIcon("monitor", "Open mock view", async () => {
            await this.activateView(VIEW_TYPE_TASK_COLUMNS_MOCK_VIEW);
        });
    }

    onunload() {
    }

    async activateView(viewType: string) {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(viewType);

        if (leaves.length > 0) {
            // 既に開いていればそれを使う
            leaf = leaves[0] ?? null;
        } else {
            // 新しいタブに新規作成
            leaf = workspace.getLeaf(true);
            await leaf?.setViewState({ type: viewType, active: true });
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
        this.settingsEvents.trigger('changed', this.settings);
    }
}
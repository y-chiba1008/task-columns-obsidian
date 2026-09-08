import { Events, Plugin, WorkspaceLeaf } from 'obsidian';
import { DatedNotesTableView, VIEW_TYPE_DATED_NOTES_TABLE_VIEW } from './view';
import {
    DEFAULT_SETTINGS,
    DatedNotesTableSettings,
    DatedNotesTableSettingTab,
} from './settings';

export default class DatedNotesTablePlugin extends Plugin {
    settings!: DatedNotesTableSettings;
    settingsEvents = new Events();

    async onload() {
        await this.loadSettings();
        this.registerView(
            VIEW_TYPE_DATED_NOTES_TABLE_VIEW,
            (leaf) => new DatedNotesTableView(leaf, this),
        );

        this.addRibbonIcon('dice', 'Open view', async () => {
            await this.activateView(VIEW_TYPE_DATED_NOTES_TABLE_VIEW);
        });

        this.addCommand({
            id: 'open-view',
            name: 'Open view',
            callback: () => this.activateView(VIEW_TYPE_DATED_NOTES_TABLE_VIEW),
        });

        this.addSettingTab(new DatedNotesTableSettingTab(this.app, this));
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
            (await this.loadData()) as Partial<DatedNotesTableSettings>,
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.settingsEvents.trigger('changed', this.settings);
    }
}

import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import TaskColumnsPlugin from './main';
import { FolderSuggest } from './ui/folderSuggest';

export interface TaskColumnsSettings {
    targetFolder: string;
    excludedFolders: string;
}

export const DEFAULT_SETTINGS: TaskColumnsSettings = {
    targetFolder: '',
    excludedFolders: '',
};

export class TaskColumnsSettingTab extends PluginSettingTab {
    plugin: TaskColumnsPlugin;

    constructor(app: App, plugin: TaskColumnsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Target folder')
            .setDesc('Select a folder in your vault')
            .addText((text) => {
                text
                    .setPlaceholder('Example: folder1/folder2')
                    .setValue(this.plugin.settings.targetFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.targetFolder = value;
                        await this.plugin.saveSettings();
                    });

                new FolderSuggest(this.app, text.inputEl, (folder) => {
                    this.plugin.settings.targetFolder = folder.path;
                    this.plugin.saveSettings().catch(() => new Notice('Failed to save settings.'));
                });
            });

        new Setting(containerEl)
            .setName('Excluded folders')
            .setDesc('One folder path per line (relative to vault). Matching folders and their contents are hidden from the table.')
            .addTextArea((text) => {
                text
                    .setPlaceholder('Example:\nfolder1/excluded\narchive')
                    .setValue(this.plugin.settings.excludedFolders)
                    .onChange(async (value) => {
                        this.plugin.settings.excludedFolders = value;
                        await this.plugin.saveSettings();
                    });
                text.inputEl.rows = 5;
            });
    }
}

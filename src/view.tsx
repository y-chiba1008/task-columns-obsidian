import { ItemView, TFile, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import ViewRoot from './components/ViewRoot';
import { AppProvider } from './context/AppContext';
import { VaultRepository } from './repositories/vaultRepository';
import { useVaultFilesStore } from './stores/vaultFilesStore';
import TaskColumnsPlugin from './main';

export const VIEW_TYPE_TASK_COLUMNS_VIEW = 'task-columns-view';

const METADATA_UPDATE_DEBOUNCE_MS = 200;

export class TaskColumnsView extends ItemView {
    private root: Root | null = null;
    private plugin: TaskColumnsPlugin;
    private repo: VaultRepository | null = null;
    private metadataUpdateTimers = new Map<string, number>();

    constructor(leaf: WorkspaceLeaf, plugin: TaskColumnsPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_TASK_COLUMNS_VIEW;
    }

    getDisplayText(): string {
        return 'Task columns view';
    }

    getIcon(): string {
        return 'dice'; // Obsidian組み込みのlucideアイコン名
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        if (!container) return;
        this.root = createRoot(container);

        this.repo = new VaultRepository(this.app, () => this.plugin.settings);

        // ファイル一覧を取得
        this.refreshFiles();

        // ファイルと設定の変更イベント監視 → storeを更新
        this.registerEvent(
            this.app.metadataCache.on('changed', (file) => this.scheduleMetadataUpdate(file)),
        );
        this.registerEvent(
            this.app.vault.on('rename', () => this.refreshFiles()),
        );
        this.registerEvent(
            this.app.vault.on('create', () => this.refreshFiles()),
        );
        this.registerEvent(
            this.app.vault.on('delete', () => this.refreshFiles()),
        );
        this.registerEvent(
            this.plugin.settingsEvents.on('changed', () => this.refreshFiles()),
        );

        this.root.render(
            <StrictMode>
                <AppProvider app={this.app}>
                    <ViewRoot />
                </AppProvider>
            </StrictMode>,
        );
    }

    async onClose() {
        for (const timer of this.metadataUpdateTimers.values()) {
            window.clearTimeout(timer);
        }
        this.metadataUpdateTimers.clear();
        this.repo = null;
        this.root?.unmount();
    }

    private refreshFiles() {
        if (!this.repo) {
            return;
        }
        useVaultFilesStore.getState().refresh(this.repo);
    }

    private scheduleMetadataUpdate(file: TFile) {
        const existing = this.metadataUpdateTimers.get(file.path);
        if (existing !== undefined) {
            window.clearTimeout(existing);
        }

        const timer = window.setTimeout(() => {
            this.metadataUpdateTimers.delete(file.path);
            if (!this.repo) {
                return;
            }
            useVaultFilesStore.getState().update(file.path, this.repo);
        }, METADATA_UPDATE_DEBOUNCE_MS);
        this.metadataUpdateTimers.set(file.path, timer);
    }
}

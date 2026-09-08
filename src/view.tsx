import { ItemView, TFile, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import ViewRoot from './components/ViewRoot';
import { WorkspaceServiceProvider } from './context/WorkspaceServiceContext';
import { VaultRepository } from './repositories/vaultRepository';
import { WorkspaceService } from './services/workspaceService';
import { useVaultFilesStore } from './stores/vaultFilesStore';
import DatedNotesTablePlugin from './main';

export const VIEW_TYPE_DATED_NOTES_TABLE_VIEW = 'dated-notes-table-view';

const METADATA_UPDATE_DEBOUNCE_MS = 200;

export class DatedNotesTableView extends ItemView {
    private root: Root | null = null;
    private plugin: DatedNotesTablePlugin;
    private repo: VaultRepository | null = null;
    private workspaceService: WorkspaceService | null = null;
    private metadataUpdateTimers = new Map<string, number>();

    constructor(leaf: WorkspaceLeaf, plugin: DatedNotesTablePlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_DATED_NOTES_TABLE_VIEW;
    }

    getDisplayText(): string {
        return 'Dated notes table';
    }

    getIcon(): string {
        return 'dice'; // Obsidian組み込みのlucideアイコン名
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        if (!container) return;
        this.root = createRoot(container);

        this.repo = new VaultRepository(this.app, () => this.plugin.settings);
        this.workspaceService = new WorkspaceService(this.app);

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
                <WorkspaceServiceProvider service={this.workspaceService}>
                    <ViewRoot />
                </WorkspaceServiceProvider>
            </StrictMode>,
        );
    }

    async onClose() {
        for (const timer of this.metadataUpdateTimers.values()) {
            window.clearTimeout(timer);
        }
        this.metadataUpdateTimers.clear();
        this.repo = null;
        this.workspaceService = null;
        this.root?.unmount();
    }

    private refreshFiles() {
        if (!this.repo) {
            return;
        }
        const notes = this.repo.listNotes();
        const folders = this.repo.listFolders();
        useVaultFilesStore.getState().replaceAll(notes, folders);
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

            const path = file.path;
            if (!this.repo.isUnderTargetFolder(path)) {
                return;
            }

            if (this.repo.isExcluded(path)) {
                useVaultFilesStore.getState().removeByPath(path);
                return;
            }

            const note = this.repo.parseNoteByPath(path);
            if (!note) {
                useVaultFilesStore.getState().removeByPath(path);
                return;
            }

            useVaultFilesStore.getState().upsertNote(note);
        }, METADATA_UPDATE_DEBOUNCE_MS);
        this.metadataUpdateTimers.set(file.path, timer);
    }
}

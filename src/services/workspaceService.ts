import { App, MarkdownView, TFile, WorkspaceLeaf } from 'obsidian';

export class WorkspaceService {
    constructor(private readonly app: App) {}

    async openNote(path: string): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) {
            return;
        }

        let existingLeaf: WorkspaceLeaf | null = null;
        this.app.workspace.iterateAllLeaves((leaf) => {
            if (existingLeaf) {
                return;
            }
            const view = leaf.view;
            if (view instanceof MarkdownView && view.file?.path === file.path) {
                existingLeaf = leaf;
            }
        });

        if (existingLeaf) {
            this.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
            return;
        }

        const leaf = this.app.workspace.getLeaf('tab');
        await leaf.openFile(file);
    }
}

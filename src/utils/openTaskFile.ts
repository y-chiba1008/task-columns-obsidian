import { App, MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

export async function openTaskFile(app: App, path: string): Promise<void> {
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
        return;
    }

    let existingLeaf: WorkspaceLeaf | null = null;
    app.workspace.iterateAllLeaves((leaf) => {
        if (existingLeaf) {
            return;
        }
        const view = leaf.view;
        if (view instanceof MarkdownView && view.file?.path === file.path) {
            existingLeaf = leaf;
        }
    });

    if (existingLeaf) {
        app.workspace.setActiveLeaf(existingLeaf, { focus: true });
        return;
    }

    const leaf = app.workspace.getLeaf("tab");
    await leaf.openFile(file);
}

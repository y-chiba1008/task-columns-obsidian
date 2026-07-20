import { AbstractInputSuggest, TFolder, App } from 'obsidian';

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
    constructor(
        app: App,
        private inputEl: HTMLInputElement,
        private onSelectCb: (folder: TFolder) => void,
    ) {
        super(app, inputEl);
    }

    getSuggestions(query: string): TFolder[] {
        const lowerQuery = query.toLowerCase();
        const folders: TFolder[] = [];

        const recurse = (folder: TFolder) => {
            for (const child of folder.children) {
                if (child instanceof TFolder) {
                    if (child.path.toLowerCase().includes(lowerQuery)) {
                        folders.push(child);
                    }
                    recurse(child);
                }
            }
        };
        recurse(this.app.vault.getRoot());

        return folders;
    }

    renderSuggestion(folder: TFolder, el: HTMLElement): void {
        el.setText(folder.path === '' ? '/' : folder.path);
    }

    selectSuggestion(folder: TFolder): void {
        this.inputEl.value = folder.path;
        this.inputEl.trigger('input'); // onChange相当のイベントを発火させる
        this.onSelectCb(folder);
        this.close();
    }
}
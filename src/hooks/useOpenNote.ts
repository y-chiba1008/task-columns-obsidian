import { useCallback } from 'react';
import { useWorkspaceService } from '../context/WorkspaceServiceContext';

export function useOpenNote(): (path: string) => void {
    const workspace = useWorkspaceService();

    return useCallback(
        (path: string) => {
            void workspace.openNote(path);
        },
        [workspace],
    );
}

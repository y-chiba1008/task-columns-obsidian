import { useCallback } from 'react';
import { useWorkspaceService } from '../context/WorkspaceServiceContext';

export function useOpenTask(): (path: string) => void {
    const workspace = useWorkspaceService();

    return useCallback(
        (path: string) => {
            void workspace.openTask(path);
        },
        [workspace],
    );
}

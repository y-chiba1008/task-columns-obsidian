import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { openTaskFile } from '../utils/openTaskFile';

export function useOpenTask(): (path: string) => void {
    const app = useApp();

    return useCallback(
        (path: string) => {
            void openTaskFile(app, path);
        },
        [app],
    );
}

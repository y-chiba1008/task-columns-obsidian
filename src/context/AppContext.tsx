import { App } from 'obsidian';
import { createContext, useContext, type ReactNode } from 'react';

const AppContext = createContext<App | null>(null);

export function AppProvider({ app, children }: { app: App; children: ReactNode }) {
    return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export function useApp(): App {
    const app = useContext(AppContext);
    if (!app) {
        throw new Error('useApp must be used within AppProvider');
    }
    return app;
}

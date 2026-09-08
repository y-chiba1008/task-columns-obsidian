import { createContext, useContext, type ReactNode } from 'react';
import { WorkspaceService } from '../services/workspaceService';

const WorkspaceServiceContext = createContext<WorkspaceService | null>(null);

export function WorkspaceServiceProvider({
    service,
    children,
}: {
    service: WorkspaceService;
    children: ReactNode;
}) {
    return (
        <WorkspaceServiceContext.Provider value={service}>
            {children}
        </WorkspaceServiceContext.Provider>
    );
}

export function useWorkspaceService(): WorkspaceService {
    const service = useContext(WorkspaceServiceContext);
    if (!service) {
        throw new Error('useWorkspaceService must be used within WorkspaceServiceProvider');
    }
    return service;
}

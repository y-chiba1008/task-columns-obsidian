import { useVaultFilesStore } from "../stores/vaultFilesStore";

const HeaderRow = () => {
    const folders = useVaultFilesStore(state => state.folders);

    return (
        <tr className="task-columns-header-row">
            <th className="task-columns-header-cell task-columns-date-header">
                <span className="task-columns-header-label">日付</span>
                <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
            </th>
            {folders.map((folder) => (
                <th className="task-columns-header-cell task-columns-category-header" key={folder.path}>
                    <span className="task-columns-header-label">{folder.name}</span>
                    <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                </th>
            ))}
        </tr>
    );
};

export default HeaderRow;
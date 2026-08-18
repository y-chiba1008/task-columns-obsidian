import { useVaultFilesStore } from "../stores/vaultFilesStore";

const HeaderRow = () => {
    const folders = useVaultFilesStore(state => state.folders);

    return (
        <tr>
            <th className="task-columns-header-cell task-columns-date-header">
                <span className="task-columns-header-inner">
                    日付
                    <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                </span>
            </th>
            {folders.map((folder) => (
                <th className="task-columns-header-cell task-columns-category-header" key={folder.path}>
                    <span className="task-columns-header-inner">
                        {folder.name}
                        <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                    </span>
                </th>
            ))}
        </tr>
    );
};

export default HeaderRow;
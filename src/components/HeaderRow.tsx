import { useVaultFilesStore } from '../stores/vaultFilesStore';

const HeaderRow = () => {
    const folders = useVaultFilesStore(state => state.folders);

    return (
        <tr>
            <th className="dated-notes-table-header-cell dated-notes-table-date-header">
                <span className="dated-notes-table-header-inner">
                    日付
                    <span className="dated-notes-table-header-menu-icon" aria-hidden="true">▾</span>
                </span>
            </th>
            {folders.map((folder) => (
                <th className="dated-notes-table-header-cell dated-notes-table-folder-header" key={folder.path}>
                    <span className="dated-notes-table-header-inner">
                        {folder.name}
                        <span className="dated-notes-table-header-menu-icon" aria-hidden="true">▾</span>
                    </span>
                </th>
            ))}
        </tr>
    );
};

export default HeaderRow;

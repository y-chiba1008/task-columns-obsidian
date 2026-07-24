const TaskTable = () => {
    const dates = [];
    for (let i = 0; i < 31; i++) {
        dates.push(new Date(`2026-07-${i + 1}`));
    }
    const formatter = new Intl.DateTimeFormat('ja-JP', {
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <div className="task-columns-table-wrapper">
            <div className="task-columns-table">
                <thead>
                    <tr className="task-columns-header-row">
                        <th className="task-columns-header-cell task-columns-date-header">
                            <span className="task-columns-header-label">日付</span>
                            <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                        </th>

                        <th className="task-columns-header-cell task-columns-category-header">
                            <span className="task-columns-header-label">フォルダ1</span>
                            <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                        </th>
                        <th className="task-columns-header-cell task-columns-category-header">
                            <span className="task-columns-header-label">フォルダ2</span>
                            <span className="task-columns-header-menu-icon" aria-hidden="true">▾</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dates.map((date) => (
                        <tr className="task-columns-row">
                            <td className="task-columns-cell task-columns-date-cell">{formatter.format(date)}</td>
                            <td className="task-columns-cell"></td>
                            <td className="task-columns-cell"></td>
                        </tr>
                    ))}
                </tbody>
            </div>
        </div>
    );
};

export default TaskTable;
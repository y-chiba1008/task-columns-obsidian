import { generateCellKey } from "../common";
import { useVaultFilesStore } from "../stores/vaultFilesStore";

const TaskCell = ({ date, folder }: { date: Date, folder: string }) => {
    const cellKey = generateCellKey(date, folder);
    const fileGroups = useVaultFilesStore(state => state.fileGroups);
    const tasks = fileGroups.get(cellKey) ?? [];
    if (tasks.length > 0) {
        console.log('TaskCell', tasks);
    }

    return (
        <td className="task-columns-cell" key={cellKey}>
            {tasks.map((task) => (
                <div className="task-columns-task" key={task.taskKey}>
                    <span className="task-columns-task-text">{task.title}</span>
                </div>
            ))}
        </td>
    );
};

export default TaskCell;
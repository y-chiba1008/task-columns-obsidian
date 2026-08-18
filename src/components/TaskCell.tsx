import { generateCellKey } from "../common";
import TaskModel from "../models/taskModel";
import { useVaultFilesStore } from "../stores/vaultFilesStore";

const EMPTY_TASKS: TaskModel[] = [];

const TaskCell = ({ date, folder }: { date: Date | null, folder: string }) => {
    const cellKey = generateCellKey(date, folder);
    const tasks = useVaultFilesStore(
        (state) => state.fileGroups.get(cellKey) ?? EMPTY_TASKS,
    );

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
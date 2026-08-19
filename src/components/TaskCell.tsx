import { generateCellKey } from "../common";
import TaskModel from "../models/taskModel";
import { useVaultFilesStore } from "../stores/vaultFilesStore";
import { openTaskFile } from "../utils/openTaskFile";

const EMPTY_TASKS: TaskModel[] = [];

const TaskCell = ({ date, folder }: { date: Date | null, folder: string }) => {
    const cellKey = generateCellKey(date, folder);
    const app = useVaultFilesStore((state) => state.app);
    const tasks = useVaultFilesStore(
        (state) => state.fileGroups.get(cellKey) ?? EMPTY_TASKS,
    );

    const handleTitleClick = (task: TaskModel) => {
        if (!app) {
            return;
        }
        void openTaskFile(app, task.path);
    };

    return (
        <td className="task-columns-cell" key={cellKey}>
            {tasks.map((task) => (
                <div className="task-columns-task" key={task.taskKey}>
                    <span
                        className="task-columns-task-text"
                        onClick={() => handleTitleClick(task)}
                    >
                        {task.title}
                    </span>
                </div>
            ))}
        </td>
    );
};

export default TaskCell;
import TaskModel from '../models/taskModel';
import { useOpenTask } from '../hooks/useOpenTask';
import { useVaultFilesStore } from '../stores/vaultFilesStore';
import { generateCellKey } from '../utils/keyUtils';

const EMPTY_TASKS: TaskModel[] = [];

const TaskCell = ({ date, folder }: { date: Date | null, folder: string }) => {
    const cellKey = generateCellKey(date, folder);
    const openTask = useOpenTask();
    const tasks = useVaultFilesStore(
        (state) => state.fileGroups.get(cellKey) ?? EMPTY_TASKS,
    );

    return (
        <td className="task-columns-cell" key={cellKey}>
            {tasks.map((task) => (
                <div className="task-columns-task" key={task.taskKey}>
                    <span
                        className="task-columns-task-text"
                        onClick={() => openTask(task.path)}
                    >
                        {task.title}
                    </span>
                </div>
            ))}
        </td>
    );
};

export default TaskCell;

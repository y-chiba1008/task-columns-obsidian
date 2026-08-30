import { useDateScroll } from '../hooks/useDateScroll';
import DateNavigation from './DateNavigation';
import TaskTableScroll from './TaskTableScroll';

const ViewRoot = () => {
    const { navigation, table } = useDateScroll();

    return (
        <div className="task-columns-view">
            <div className="task-columns-table-area">
                <DateNavigation {...navigation} />
                <TaskTableScroll {...table} />
            </div>
        </div>
    );
};

export default ViewRoot;

import { useDateScroll } from '../hooks/useDateScroll';
import DateNavigation from './DateNavigation';
import TableScroll from './TableScroll';

const ViewRoot = () => {
    const { navigation, table } = useDateScroll();

    return (
        <div className="dated-notes-table-view">
            <div className="dated-notes-table-table-area">
                <DateNavigation {...navigation} />
                <TableScroll {...table} />
            </div>
        </div>
    );
};

export default ViewRoot;

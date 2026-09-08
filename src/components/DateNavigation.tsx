import { addDays, addMonths, format, parse, startOfDay } from 'date-fns';

type DateNavigationProps = {
    referenceDate: Date;
    onNavigate: (date: Date) => void;
};

const DateNavigation = ({ referenceDate, onNavigate }: DateNavigationProps) => {
    const dateInputValue = format(referenceDate, 'yyyy-MM-dd');

    const handleDateInputChange = (value: string) => {
        if (!value) {
            return;
        }
        const parsed = startOfDay(parse(value, 'yyyy-MM-dd', new Date()));
        if (Number.isNaN(parsed.getTime())) {
            return;
        }
        onNavigate(parsed);
    };

    return (
        <div className="dated-notes-table-date-nav" role="toolbar" aria-label="日付移動">
            <div className="dated-notes-table-date-nav-group">
                <button
                    type="button"
                    className="dated-notes-table-date-nav-button"
                    onClick={() => onNavigate(addMonths(referenceDate, -1))}
                >
                    1か月戻る
                </button>
                <button
                    type="button"
                    className="dated-notes-table-date-nav-button"
                    onClick={() => onNavigate(addDays(referenceDate, -7))}
                >
                    1週間戻る
                </button>
            </div>

            <div className="dated-notes-table-date-nav-group">
                <button
                    type="button"
                    className="dated-notes-table-date-nav-button"
                    onClick={() => onNavigate(startOfDay(new Date()))}
                >
                    今日
                </button>
                <label className="dated-notes-table-date-nav-date-label">
                    <span className="dated-notes-table-date-nav-date-caption">日付指定</span>
                    <input
                        type="date"
                        className="dated-notes-table-date-nav-date-input"
                        value={dateInputValue}
                        onChange={(event) => handleDateInputChange(event.target.value)}
                    />
                </label>
            </div>

            <div className="dated-notes-table-date-nav-group">
                <button
                    type="button"
                    className="dated-notes-table-date-nav-button"
                    onClick={() => onNavigate(addDays(referenceDate, 7))}
                >
                    1週間進む
                </button>
                <button
                    type="button"
                    className="dated-notes-table-date-nav-button"
                    onClick={() => onNavigate(addMonths(referenceDate, 1))}
                >
                    1か月進む
                </button>
            </div>
        </div>
    );
};

export default DateNavigation;

import { addMonths, addWeeks, format, parse } from 'date-fns';
import { SubmitEventHandler, useState } from 'react';

type DateNavBarProps = {
    getAnchorDate: () => Date;
    onNavigate: (date: Date) => void;
};

const DateNavBar = ({ getAnchorDate, onNavigate }: DateNavBarProps) => {
    const [dateValue, setDateValue] = useState(() => format(new Date(), 'yyyy-MM-dd'));

    const goToInputDate = () => {
        const parsed = parse(dateValue, 'yyyy-MM-dd', new Date());
        if (Number.isNaN(parsed.getTime())) return;
        onNavigate(parsed);
    };

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        goToInputDate();
    };

    return (
        <div className="task-columns-date-nav" role="toolbar" aria-label="日付移動">
            <button
                type="button"
                className="task-columns-date-nav-button"
                onClick={() => onNavigate(new Date())}
            >
                今日
            </button>

            <div className="task-columns-date-nav-group">
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => onNavigate(addMonths(getAnchorDate(), -1))}
                >
                    1か月戻る
                </button>
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => onNavigate(addWeeks(getAnchorDate(), -1))}
                >
                    1週間戻る
                </button>
            </div>

            <form className="task-columns-date-nav-jump" onSubmit={onSubmit}>
                <input
                    type="date"
                    className="task-columns-date-nav-input"
                    value={dateValue}
                    onChange={(event) => setDateValue(event.target.value)}
                    aria-label="移動先の日付"
                />
                <button type="submit" className="task-columns-date-nav-button">
                    移動
                </button>
            </form>

            <div className="task-columns-date-nav-group">
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => onNavigate(addWeeks(getAnchorDate(), 1))}
                >
                    1週間進む
                </button>
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => onNavigate(addMonths(getAnchorDate(), 1))}
                >
                    1か月進む
                </button>
            </div>
        </div>
    );
};

export default DateNavBar;

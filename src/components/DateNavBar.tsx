import { addMonths, addWeeks, format, parse, startOfDay } from 'date-fns';
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
        onNavigate(startOfDay(parsed));
    };

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        goToInputDate();
    };

    const shiftFromAnchor = (shift: (date: Date) => Date) => {
        onNavigate(startOfDay(shift(getAnchorDate())));
    };

    return (
        <div className="task-columns-date-nav" role="toolbar" aria-label="日付移動">
            <button
                type="button"
                className="task-columns-date-nav-button"
                onClick={() => onNavigate(startOfDay(new Date()))}
            >
                今日
            </button>

            <div className="task-columns-date-nav-group">
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => shiftFromAnchor((d) => addMonths(d, -1))}
                >
                    1か月戻る
                </button>
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => shiftFromAnchor((d) => addWeeks(d, -1))}
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
                    onClick={() => shiftFromAnchor((d) => addWeeks(d, 1))}
                >
                    1週間進む
                </button>
                <button
                    type="button"
                    className="task-columns-date-nav-button"
                    onClick={() => shiftFromAnchor((d) => addMonths(d, 1))}
                >
                    1か月進む
                </button>
            </div>
        </div>
    );
};

export default DateNavBar;

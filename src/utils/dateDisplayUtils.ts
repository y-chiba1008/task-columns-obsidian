import { format, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getHolidayName, isHoliday } from './holidayUtils';

export type DateColorTone = 'default' | 'saturday' | 'sunday-or-holiday';

export const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
};

export const getDateColorTone = (date: Date): DateColorTone => {
    const day = getDay(date);
    if (day === 0 || isHoliday(date)) {
        return 'sunday-or-holiday';
    }
    if (day === 6) {
        return 'saturday';
    }
    return 'default';
};

export const formatDateLabel = (date: Date): { dateText: string; holidayName: string | null } => {
    return {
        dateText: format(date, 'yyyy/MM/dd (E)', { locale: ja }),
        holidayName: getHolidayName(date),
    };
};

export const dateToneClassName = (tone: DateColorTone): string => {
    switch (tone) {
        case 'saturday':
            return 'task-columns-date-saturday';
        case 'sunday-or-holiday':
            return 'task-columns-date-sunday-or-holiday';
        default:
            return '';
    }
};

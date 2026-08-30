import { startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';

export type DateScrollNavigationProps = {
    referenceDate: Date;
    onNavigate: (date: Date) => void;
};

export type DateScrollTableProps = {
    navigationTarget: Date | null;
    onReferenceDateChange: (date: Date) => void;
    onNavigationComplete: () => void;
};

export type UseDateScrollResult = {
    navigation: DateScrollNavigationProps;
    table: DateScrollTableProps;
};

export function useDateScroll(): UseDateScrollResult {
    const [referenceDate, setReferenceDate] = useState(() => startOfDay(new Date()));
    const [navigationTarget, setNavigationTarget] = useState<Date | null>(null);

    const navigateToDate = useCallback((date: Date) => {
        const target = startOfDay(date);
        setReferenceDate(target);
        setNavigationTarget(target);
    }, []);

    const syncFromScroll = useCallback((date: Date) => {
        const next = startOfDay(date);
        setReferenceDate((prev) => (prev.getTime() === next.getTime() ? prev : next));
    }, []);

    const acknowledgeNavigation = useCallback(() => {
        setNavigationTarget(null);
    }, []);

    return {
        navigation: {
            referenceDate,
            onNavigate: navigateToDate,
        },
        table: {
            navigationTarget,
            onReferenceDateChange: syncFromScroll,
            onNavigationComplete: acknowledgeNavigation,
        },
    };
}

import { format } from "date-fns";

export const generateCellKey = (date: Date | null, folderName: string): string => {
    const dateString = date ? format(date, 'yyyy-MM-dd') : 'no-date';
    return `${dateString}-${folderName}`;
}
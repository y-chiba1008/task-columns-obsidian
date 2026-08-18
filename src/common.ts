import { format } from "date-fns";

export const generateCellKey = (datetime: Date | null, folderName: string): string => {
    const dateString = datetime ? format(datetime, 'yyyy-MM-dd') : 'no-date';
    return `${dateString}-${folderName}`;
};
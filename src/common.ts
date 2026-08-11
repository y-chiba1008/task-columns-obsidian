import { format } from "date-fns";

export const generateCellKey = (date: Date, folderName: string): string => {
    return `${format(date, 'yyyy-MM-dd')}-${folderName}`;
}
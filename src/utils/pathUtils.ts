export const parseExcludedFolders = (text: string): string[] => {
    return text
        .split('\n')
        .map((line) => line.trim().replace(/\/$/, ''))
        .filter((line) => line.length > 0);
};

export const isUnderExcludedPath = (path: string, excludedFolders: string[]): boolean => {
    return excludedFolders.some(
        (excluded) => path === excluded || path.startsWith(excluded + '/'),
    );
};

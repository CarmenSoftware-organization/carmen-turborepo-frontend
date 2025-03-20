export const calculatePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
};
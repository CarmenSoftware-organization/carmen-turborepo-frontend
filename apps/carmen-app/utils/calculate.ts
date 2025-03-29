export const calculateProgress = (checked: number, total: number) => {
    return total > 0 ? Math.round((checked / total) * 100) : 0
}
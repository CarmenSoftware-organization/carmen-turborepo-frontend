export const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
}

interface EnergyData {
    year: string
    energy: number
    unit: string
    change?: number
}

export const calculateYoYChanges = (data: { year: string; energy: number }[]) => {
    return data.map((item, index) => {
        if (index === 0) return { ...item, change: 0 }; // No change for the first year
        const previous = data[index - 1];
        const change = ((item.energy - previous.energy) / previous.energy) * 100;
        return { ...item, change: parseFloat(change.toFixed(2)) };
    });
};

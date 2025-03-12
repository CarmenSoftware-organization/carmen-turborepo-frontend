// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateNestedObject = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    return keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            acc[key] = value;
        } else if (!acc[key]) {
            acc[key] = {};
        }
        return acc[key];
    }, obj);
};

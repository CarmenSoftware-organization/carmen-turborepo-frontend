export const generateNanoid = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 5; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }

    return result;
};
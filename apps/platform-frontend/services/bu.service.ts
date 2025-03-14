'use server';

export const getBusinessUnits = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-unit`;
    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

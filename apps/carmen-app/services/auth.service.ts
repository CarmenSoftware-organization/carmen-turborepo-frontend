import { backendApi } from "@/lib/backend-api";


export const signInService = async (email: string, password: string) => {
    const url = `${backendApi}/api/auth/login`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}


export const getUserProfileService = async (accessToken: string) => {
    const url = `${backendApi}/api/user/profile`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export const updateUserBusinessUnitService = async (accessToken: string, buId: string) => {

    console.log('accessToken >>>', accessToken);
    console.log('buId >>>', buId);

    const url = `${backendApi}/api/business-unit/default`
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-tenant-id': buId
        },
    }
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('data response >>>', data);

    return data;
}

export const fetchAccountCodeMapping = async () => {
    const response = await fetch('/api/finance/account-code-mapping');
    return response.json();
}
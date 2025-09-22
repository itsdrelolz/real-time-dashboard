import apiFetch from "./apiClient";


export const getHealth = async () => {
    const response = await apiFetch('/health', {
        method: 'GET',
    });
    return response;
};
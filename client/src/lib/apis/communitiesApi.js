import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils.js";

const readCommunities = async () => {
    const response = await fetch(`${PUBLIC_API_URL}/api/communities`);
    return await response.json();
};

const readCommunity = async (id) => {
    const response = await fetch(`${PUBLIC_API_URL}/api/communities/${id}`);
    return await response.json();
};

const createCommunity = async (community) => {
    const response = await authFetch(`${PUBLIC_API_URL}/api/communities`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(community),
    });
    
    return await response.json();
};

const updateCommunity = async (id, community) => {
    const response = await authFetch(`${PUBLIC_API_URL}/api/communities/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(community),
    });

    return await response.json();
};

const deleteCommunity = async (id) => {
    const response = await authFetch(`${PUBLIC_API_URL}/api/communities/${id}`, {
        method: "DELETE",
    });

    return await response.json();
};

export { createCommunity, deleteCommunity, readCommunity, readCommunities, updateCommunity };

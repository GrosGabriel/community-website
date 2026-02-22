import { PUBLIC_API_URL } from "$env/static/public";

const register = async (user) => {
    return await fetch(`${PUBLIC_API_URL}/api/auth/register`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
    });

};

const login = async (user) => {
    return await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
    });

};

export { register, login };

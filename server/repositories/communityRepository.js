import { sql } from "./sqlLoader.js";

const readAll = async () => {
    const result = await sql`SELECT * FROM communities`;
    return result;
};


const readOne = async (id) => {
    const result = await sql`SELECT * FROM communities WHERE id = ${id}`;
    return result[0];
};

const create = async (community, userId) => {
    const result = await sql`INSERT INTO communities
        (name, description, created_by, created_at)
        VALUES (${community.name}, ${community.description}, ${userId}, NOW())
        RETURNING *;`;
    return result[0];
};

const deleteOne = async (id, userId) => {
    const result = await sql`DELETE FROM communities WHERE id = ${id} AND created_by = ${userId} RETURNING *`;
    return result[0];
};


export { readAll, readOne, create, deleteOne };
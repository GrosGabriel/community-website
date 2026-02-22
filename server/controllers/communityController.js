import * as commmunityRepository from "../repositories/communityRepository.js";


const findAll = async (c) => {
    const result = await commmunityRepository.readAll();
    return c.json(result);
};

const findOne = async (c) => {
    const id = Number(c.req.param("communityId"));

    if (!Number.isInteger(id)) {
        return c.json({error: "Invalid community id"}, 400);
    }

    const result = await commmunityRepository.readOne(id);
    if (!result) {
        return c.json({error: "Community not found"}, 404);
    }

    return c.json(result);
};


const create = async (c) => {
    const community = await c.req.json();
    const user = c.get("user");

    if (!community.name || !community.description) {
        return c.json({error:"Missing required fields"}, 400);
    }

    const result = await commmunityRepository.create(community, user.id);

    return c.json(result);

};


const deleteOne = async (c) => {
    const id = Number(c.req.param("communityId"));
    if (!Number.isInteger(id)) {
        return c.json({error: "Invalid community id"}, 400);
    }
    
    const user = c.get("user");
    const result = await commmunityRepository.deleteOne(id, user.id);

    if (!result) {
        return c.json({error: "Community not found"}, 404);
    }

    return c.json(result);
};

export { findAll, findOne, create, deleteOne };


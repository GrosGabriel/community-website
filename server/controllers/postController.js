import * as postRepository from "../repositories/postRepository.js";

const findAll = async (c) => {
    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.json({error: "Invalid community id"}, 400);
    }

    const result = await postRepository.readAll(communityId);
    return c.json(result);
};


const findRecent = async (c) => {
    const result = await postRepository.readRecent();
    return c.json(result);
};

const findOne = async (c) => {
    const id = Number(c.req.param("postId"));
    const communityId = Number(c.req.param("communityId"));

    if (!Number.isInteger(id)) {
        return c.json({error:"Invalid post id"}, 400);
    }
    if (!Number.isInteger(communityId)) {
        return c.json({error:"Invalid community id"}, 400);
    }

    const result = await postRepository.readOne(communityId,id);
    if (!result) {
        return c.json({error:"Post not found"}, 404);
    }
    return c.json(result);
};


const create = async (c) => {
    const post = await c.req.json();

    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.json({error:"Invalid community Id"}, 400);
    }

    if (!post.title || !post.content) {
        return c.json({error: "Missing required fields"}, 400);
    }


    const newPost = {communityId : communityId, title : post.title, content : post.content };
    const user = c.get("user");
    const result = await postRepository.create(newPost, user.id);

    return c.json(result);
};


const deleteOne = async (c) => {
    const id = Number(c.req.param("postId"));
    const communityId = Number(c.req.param("communityId"));

    if (!Number.isInteger(id)) {
        return c.json({error:"Invalid post id"}, 400);
    }
    if (!Number.isInteger(communityId)) {
        return c.json({error:"Invalid community id"}, 400);
    }

    const user = c.get("user");
    const result = await postRepository.deleteOne(communityId,id,user.id);
    if (!result) {
        return c.json({error:"Post not found"}, 404);
    }

    return c.json(result);
};


const upVotePost = async (c) => {
    const id = Number(c.req.param("postId"));
    const communityId = Number(c.req.param("communityId"));

    if (!Number.isInteger(id)) {
        return c.json({error:"Invalid post id"}, 400);
    }
    if (!Number.isInteger(communityId)) {
        return c.json({error:"Invalid community id"}, 400);
    }

    const user = c.get("user");
    const result = await postRepository.upVotePost(communityId, id, user.id);
    if (!result) {
        return c.json({error:"Post not found"}, 404);
    }

    return c.json(result);
};

const downVotePost = async (c) => {
    const id = Number(c.req.param("postId"));
    const communityId = Number(c.req.param("communityId"));

    if (!Number.isInteger(id)) {
        return c.json({error:"Invalid post id"}, 400);
    }
    if (!Number.isInteger(communityId)) {
        return c.json({error:"Invalid community id"}, 400);
    }

    const user = c.get("user");
    const result = await postRepository.downVotePost(communityId, id, user.id);
    if (!result) {
        return c.json({error:"Post not found"}, 404);
    }

    return c.json(result);
};

export {findAll, findRecent, findOne, create, deleteOne, upVotePost, downVotePost};   


import * as commentRepository from "../repositories/commentRepository.js";

const findAll = async (c) => {
    const postId = Number(c.req.param("postId"));
    if (!Number.isInteger(postId)) {
        return c.json({error: "Invalid post id"}, 400);
    }

    const result = await commentRepository.readAll(postId);

    if (!result) {
        return c.json({error: "Comments not found"}, 404);
    }

    return c.json(result);

};

const create = async (c) => {
    const comment = await c.req.json();

    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.req.json({error: "Invalid community id"}, 400);
    }

    const postId = Number(c.req.param("postId"));
    if (!Number.isInteger(postId)) {
        return c.json({error:"Invalid post id"}, 400);
    }
    
    if (!comment.content) {
        return c.json({error: "Missing required fields"}, 400);
    }
    const user = c.get("user");
    const result = await commentRepository.create(communityId, postId, user.id, comment);

    if (!result) {
        return c.json({error : "Community or post not found"}, 404);
    }

    return c.json(result);
};
const deleteOne = async (c) => {
    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.json({error: "Invalid community id"}, 400);
    }

    const postId = Number(c.req.param("postId"));
    if (!Number.isInteger(postId)) {
        return c.json({error:"Invalid post id"}, 400);
    }

    const commentId = Number(c.req.param("commentId"));
    if (!Number.isInteger(commentId)) {
        return c.json({error:"Invalid comment id"}, 400);
    }

    const user = c.get("user");
    const result = await commentRepository.deleteOne(communityId, postId, commentId, user.id);

    if (!result) {
        return c.json({error:"Comment not found"}, 404);
    }

    return c.json(result);
};


const upVoteComment = async (c) => {
    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.json({error: "Invalid community id"}, 400);
    }

    const postId = Number(c.req.param("postId"));
    if (!Number.isInteger(postId)) {
        return c.json({error:"Invalid post id"}, 400);
    }

    const commentId = Number(c.req.param("commentId"));
    if (!Number.isInteger(commentId)) {
        return c.json({error:"Invalid comment id"}, 400);
    }

    const user = c.get("user");
    const result = await commentRepository.upVoteComment(communityId, postId, commentId, user.id);

    if (!result) {
        return c.json({error:"Comment not found"}, 404);
    }

    return c.json(result);
};

const downVoteComment = async (c) => {
    const communityId = Number(c.req.param("communityId"));
    if (!Number.isInteger(communityId)) {
        return c.json({error: "Invalid community id"}, 400);
    }

    const postId = Number(c.req.param("postId"));
    if (!Number.isInteger(postId)) {
        return c.json({error:"Invalid post id"}, 400);
    }

    const commentId = Number(c.req.param("commentId"));
    if (!Number.isInteger(commentId)) {
        return c.json({error:"Invalid comment id"}, 400);
    }

    const user = c.get("user");
    const result = await commentRepository.downVoteComment(communityId, postId, commentId, user.id);

    if (!result) {
        return c.json({error:"Comment not found"}, 404);
    }

    return c.json(result);
};

export {findAll, create, deleteOne, upVoteComment, downVoteComment};


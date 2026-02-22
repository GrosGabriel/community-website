import { sql } from "./sqlLoader.js";


const readAll = async (id) => {
    const result = await sql`SELECT p.*,
        COUNT(*) FILTER (WHERE v.vote = 'upvote')::int AS upvotes,
        COUNT(*) FILTER (WHERE v.vote = 'downvote')::int AS downvotes
        FROM posts p LEFT JOIN votes v ON p.id = v.post_id 
        WHERE p.parent_post_id = ${id}
        GROUP BY p.id`;
    return result;
};


const create = async (communityId,postId,userId,comment) =>{
    const result = await sql`INSERT INTO posts 
        (title, content, community_id, parent_post_id, created_at, created_by)
        VALUES (${null}, ${comment.content}, ${communityId}, ${postId}, NOW(), ${userId})
        RETURNING *;`;
    return { ...result[0], upvotes: 0, downvotes: 0 };
};


const deleteOne = async (communityId, postId, id, userId) => {
    const result = await sql`DELETE FROM posts WHERE community_id = ${communityId} AND parent_post_id = ${postId} AND id = ${id} AND created_by = ${userId} RETURNING *`;
    return result[0];
};

const upVoteComment = async (communityId, postId, id, userId) => {
    //Insert/Update the vote
    await sql`INSERT INTO votes 
        (user_id, post_id, vote)
        VALUES (${userId}, ${id}, 'upvote')
        ON CONFLICT (user_id, post_id) DO UPDATE SET vote = 'upvote';`;
    //Retrieve the updated vote counts
    const votesCount = await sql`SELECT 
        COUNT(*) FILTER (WHERE vote = 'upvote')::int AS upvotes,
        COUNT(*) FILTER (WHERE vote = 'downvote')::int AS downvotes
        FROM votes WHERE post_id = ${id};`;
    const { upvotes, downvotes } = votesCount[0];
    //Look for the comment
    const comment = await sql`SELECT * FROM posts WHERE community_id = ${communityId} AND parent_post_id = ${postId} AND id = ${id}`;
    
    return { ...comment[0], upvotes, downvotes };   
};

const downVoteComment = async (communityId, postId, id, userId) => {
    //Insert/Update the vote
    await sql`INSERT INTO votes 
        (user_id, post_id, vote)
        VALUES (${userId}, ${id}, 'downvote')
        ON CONFLICT (user_id, post_id) DO UPDATE SET vote = 'downvote';`;
    //Retrieve the updated vote counts
    const votesCount = await sql`SELECT 
        COUNT(*) FILTER (WHERE vote = 'upvote')::int AS upvotes,
        COUNT(*) FILTER (WHERE vote = 'downvote')::int AS downvotes
        FROM votes WHERE post_id = ${id};`;
    const { upvotes, downvotes } = votesCount[0];
    //Look for the comment
    const comment = await sql`SELECT * FROM posts WHERE community_id = ${communityId} AND parent_post_id = ${postId} AND id = ${id}`;
    
    return { ...comment[0], upvotes, downvotes };   
};


export {readAll, create, deleteOne, upVoteComment, downVoteComment};


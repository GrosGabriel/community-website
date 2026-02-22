import { sql } from "./sqlLoader.js";


const readAll = async (communityId) => {
    const result = await sql`SELECT P.*,
        COUNT(*) FILTER (WHERE v.vote = 'upvote')::int AS upvotes,
        COUNT(*) FILTER (WHERE v.vote = 'downvote')::int AS downvotes
        FROM posts p LEFT JOIN votes v ON p.id = v.post_id 
        WHERE p.community_id = ${communityId} AND p.parent_post_id IS NULL
        GROUP BY p.id
        ORDER BY p.created_at DESC;`;
    return result;
};
    



const readOne = async (communityId,id) => {
    const result = await sql`SELECT P.*,
        COUNT(*) FILTER (WHERE v.vote = 'upvote')::int AS upvotes,
        COUNT(*) FILTER (WHERE v.vote = 'downvote')::int AS downvotes
        FROM posts p LEFT JOIN votes v ON p.id = v.post_id 
        WHERE p.community_id = ${communityId} AND p.id = ${id};`;
    return result[0];
};


const readRecent = async () => {
  const result = await sql`
    SELECT
    p.*,
    COALESCE(v.upvotes, 0)::int AS upvotes,
    COALESCE(v.downvotes, 0)::int AS downvotes,
    COALESCE(c.comments, 0)::int AS comments
    FROM posts p

    LEFT JOIN (
    SELECT
        post_id,
        COUNT(*) FILTER (WHERE vote = 'upvote') AS upvotes,
        COUNT(*) FILTER (WHERE vote = 'downvote') AS downvotes
    FROM votes
    GROUP BY post_id
    ) v ON v.post_id = p.id

    LEFT JOIN (
    SELECT
        parent_post_id,
        COUNT(*) AS comments
    FROM posts
    WHERE parent_post_id IS NOT NULL
    GROUP BY parent_post_id
    ) c ON c.parent_post_id = p.id

    WHERE
    p.parent_post_id IS NULL
    AND p.created_at >= NOW() - INTERVAL '3 days'

    ORDER BY p.created_at DESC;
  `;

  return result;
};




const create = async (post, userId) => {
    const result = await sql`INSERT INTO posts 
        (community_id,title,content,created_at,created_by)
        VALUES (${post.communityId}, ${post.title}, ${post.content}, NOW(), ${userId})
        RETURNING *;`;
    return { ...result[0], upvotes: 0, downvotes: 0 };
};


const deleteOne = async (communityId, id, userId) => {
    const result = await sql`DELETE FROM posts WHERE community_id = ${communityId} AND id = ${id} AND created_by = ${userId} RETURNING *`;
    return result[0];
};



const upVotePost = async (communityId, id, userId) => {
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
    //Look for the post
    const post = await sql`SELECT * FROM posts WHERE community_id = ${communityId} AND id = ${id}`;
    
    return { ...post[0], upvotes, downvotes };
};

const downVotePost = async (communityId, id, userId) => {
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
    //Look for the post
    const post = await sql`SELECT * FROM posts WHERE community_id = ${communityId} AND id = ${id}`;
    
    return { ...post[0], upvotes, downvotes };  
};


export {readAll, readRecent, readOne, create, deleteOne, upVotePost, downVotePost };  

import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils.js";

const readComments = async (communityId, post_id) => {
  const response = await fetch(
    `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${post_id}/comments`,
  );
  return await response.json();
};



const createComment = async (communityId, post_id, comment) => {
    const response = await authFetch(
        `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${post_id}/comments`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(comment),
        },
    );
    return await response.json();
};

const deleteComment = async (communityId, post_id, commentId) => {   
    const response = await authFetch(
        `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${post_id}/comments/${commentId}`,
        {
            method: "DELETE",
        },
    );
    return await response.json();
};


const upVoteComment = async (communityId, post_id, comment_id) => {
    const response = await authFetch(
        `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${post_id}/comments/${comment_id}/upvote`,
        {
            method: "POST",
        },
    );
    return await response.json();
};

const downVoteComment = async (communityId, post_id, comment_id) => {
    const response = await authFetch(
        `${PUBLIC_API_URL}/api/communities/${communityId}/posts/${post_id}/comments/${comment_id}/downvote`,
        {
            method: "POST",
        },
    );
    return await response.json();
};

export { createComment, deleteComment, readComments, upVoteComment, downVoteComment };
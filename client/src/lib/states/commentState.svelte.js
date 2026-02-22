import { browser }  from '$app/environment';
import * as commentsApi from '$lib/apis/commentsApi.js';

let commentState = $state({});

const initComments = async (communityId, postId) => {
    if (browser) {
        commentState[postId] = await commentsApi.readComments(communityId, postId);
    }
};

const initComment = async (communityId, postId, commentId) => {
    if (browser) {
        const comment = await commentsApi.readComment(communityId, postId, commentId);
        if (comment && !commentState[postId]?.find((c) => c.id === comment.id)) {
            if (!commentState[postId]) {
                commentState[postId] = [];
            }
            commentState[postId].push(comment);
        }
    }
};

const useCommentState = () => {
  return {
    get comments() {
      return commentState;
    },

    addComment:(communityId, postId, content) => {
        commentsApi.createComment(communityId, postId, content).then((newComment) => {
            if (newComment?.id && newComment?.content) {
                if (!commentState[postId]) {
                    commentState[postId] = [];
                }
                commentState[postId].push(newComment);
            }
        });
    },

    deleteComment:(communityId, postId, commentId) => {
        commentsApi.deleteComment(communityId, postId, commentId).then(() => {
            if (commentState[postId]) {
                commentState[postId] = commentState[postId].filter((c) => c.id !== commentId);
            }
        });
    },

    upVoteComment:(communityId, postId, commentId) => {
        commentsApi.upVoteComment(communityId, postId, commentId).then((updatedComment) => {
            if (commentState[postId]) {
                const index = commentState[postId].findIndex((c) => c.id === updatedComment.id);
                if (index !== -1) {
                    commentState[postId][index] = updatedComment;
                }
            }
        });

    },

    downVoteComment:(communityId, postId, commentId) => {
        commentsApi.downVoteComment(communityId, postId, commentId).then((updatedComment) => {
            if (commentState[postId]) {
                const index = commentState[postId].findIndex((c) => c.id === updatedComment.id);
                if (index !== -1) {
                    commentState[postId][index] = updatedComment;
                }
            }
        });
    },
    }
};

export { initComments, initComment, useCommentState };
import { browser } from '$app/environment';
import * as postsApi from '$lib/apis/postsApi.js';


let postState = $state({});

const initPosts = async (communityId) => {
    if (browser) {
        postState[communityId] = await postsApi.readPosts(communityId);
    }
};

const initPost = async (communityId, postId) => {
    if (browser) {
        const post = await postsApi.readPost(communityId, postId);
        if (post && !postState[communityId]?.find((p) => p.id === post.id)) {
            if (!postState[communityId]) {
                postState[communityId] = [];
            }
            postState[communityId].push(post);
        }
    }
};



const usePostState = () => {
  return {
    get posts() {
      return postState;
    },

    addPost:(communityId, post) => {
        postsApi.createPost(communityId,post).then((newPost) => {
            if (newPost?.id && newPost?.title) {
                if (!postState[communityId]) {
                    postState[communityId] = [];
                }
                postState[communityId].push(newPost);
            }
        });
    },


    deletePost:(communityId,postId) => {
        postsApi.deletePost(communityId,postId).then(() => {
            if (postState[communityId]) {
                postState[communityId] = postState[communityId].filter((p) => p.id !== postId);
            }
        });
    },

    upVotePost:(communityId, postId) => {
        postsApi.upVotePost(communityId, postId).then((updatedPost) => {
            if (postState[communityId]) {
                const index = postState[communityId].findIndex((p) => p.id === updatedPost.id);
                if (index !== -1) {
                    postState[communityId][index] = updatedPost;
                }
            }
        });
    },

    downVotePost:(communityId, postId) => {
        postsApi.downVotePost(communityId, postId).then((updatedPost) => {
            if (postState[communityId]) {
                const index = postState[communityId].findIndex((p) => p.id === updatedPost.id);
                if (index !== -1) {
                    postState[communityId][index] = updatedPost;
                }
            }
        });
    },

    };

};

export { initPosts, initPost, usePostState };
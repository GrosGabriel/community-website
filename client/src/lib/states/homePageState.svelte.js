import { browser }  from '$app/environment';
import * as postApi from '$lib/apis/postsApi.js';

let homePageState = $state([]);

const initHomePage = async () => {
    const recentPosts = await postApi.readRecent();
    if (browser) {
        homePageState = recentPosts;
    }
};


const useHomePageState = () => {
    return {
        get recentPosts() {
            return homePageState;
        },
    }
};


export { useHomePageState, initHomePage };
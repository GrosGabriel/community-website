import { browser } from "$app/environment";
import * as communitiesApi from "$lib/apis/communitiesApi.js";

let communityState = $state([]);

const initCommunities = async () => {
  if (browser) {
    communityState = await communitiesApi.readCommunities();
  }
};

const initCommunity = async (id) => {
  if (browser) {
    const community = await communitiesApi.readCommunity(id);
    if (community && !communityState.find((c) => c.id === community.id)) {
      communityState.push(community);
    }
  }
};

const useCommunityState = () => {
  return {
    get communities() {
      return communityState;
    },

    addCommunity: (name,description) => {
      communitiesApi.createCommunity(name,description).then((newCommunity) => {
        if (newCommunity?.id && newCommunity?.name) {
          communityState.push(newCommunity);
        }
      });
    },

    removeCommunity: (id) => {
      communitiesApi.deleteCommunity(id).then(() => {
        communityState = communityState.filter((c) => c.id !== id);
      });                         
    },

  };
};

export { initCommunities, initCommunity, useCommunityState };   
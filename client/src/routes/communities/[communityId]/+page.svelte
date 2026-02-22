<script>
    import { page } from "$app/state";
    import Community from "$lib/components/communities/Community.svelte";
    import PostList from "$lib/components/posts/PostList.svelte";
    import PostForm from "$lib/components/posts/PostForm.svelte";


    let communityId = $derived(parseInt(page.params.communityId));

    import { initCommunity } from "$lib/states/communityState.svelte.js";
    import { initPosts } from "$lib/states/postState.svelte.js";

    $effect(() => {
        initCommunity(communityId);
        initPosts(communityId);
    });


</script>

<section class="space-y-6">
    <Community communityId={communityId} />

    <PostList communityId={communityId} />

    <PostForm communityId={communityId} />
</section>



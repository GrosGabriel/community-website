<script>
    import { page } from "$app/state";
    import Post from "$lib/components/posts/Post.svelte";
    import CommentList from "$lib/components/comments/CommentList.svelte";


    import { initCommunity } from "$lib/states/communityState.svelte.js";
    import { initPosts } from "$lib/states/postState.svelte.js";
    import { initComments } from "$lib/states/commentState.svelte.js";
    import CommentForm from "$lib/components/comments/CommentForm.svelte";

    let communityId = $derived(parseInt(page.params.communityId));
    let postId = $derived(parseInt(page.params.postId));

    $effect(() => {
        initCommunity(communityId);
        initPosts(communityId);
        initComments(communityId, postId);

    });


</script>

<section class="space-y-6">
    <Post communityId={communityId} postId={postId} />

    <CommentList communityId={communityId} postId={postId} />

    <CommentForm communityId={communityId} postId={postId} />
</section>
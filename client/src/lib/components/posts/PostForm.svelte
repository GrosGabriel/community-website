<script>
    import { usePostState } from "$lib/states/postState.svelte.js";
    import { useAuthState } from "$lib/states/authState.svelte.js";

    let { communityId } = $props();
    let postState = usePostState();
    let authState = useAuthState();

    let posts = $derived(postState.posts[communityId] || []);

    const addPost = (e) => {
        e.preventDefault();

        const post = Object.fromEntries(new FormData(e.target));

        postState.addPost(communityId, post);

        e.target.reset();
    };


</script>
{#if authState.user}
<form class="space-y-3 rounded-xl border border-border bg-bg-post p-5 shadow-sm" onsubmit={addPost}>
    <h3 class="text-lg font-fraunces font-semibold text-title">Create a post</h3>
    <input class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title" type="text" placeholder="Post title" name="title" id="title"/>
    <textarea class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title" placeholder="Post content" name="content" id="content"></textarea>
    <input class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" type="submit" value="Add Post"/>

</form>
{:else}
<p class="rounded-md border-1 border-border bg-bg-muted px-3 py-2 text-sm text-muted">You must be logged in to create a post.</p>
{/if}

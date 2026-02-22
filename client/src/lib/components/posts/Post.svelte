<script>
    import { usePostState } from "$lib/states/postState.svelte.js";
    let { communityId, postId } = $props();

    let postState = usePostState();


    let post = $derived(postState.posts[parseInt(communityId)]?.find((p) => p.id === parseInt(postId)));
</script>

{#if post}
    <article class="rounded-xl border border-border bg-bg-post p-6 shadow-sm">
        <h2 class="text-2xl font-fraunces font-bold text-title  break-words">{post.title}</h2>
        <p class="mt-3 whitespace-pre-wrap text-text  break-words">{post.content}</p>
    </article>
{:else}
    <p class="rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-muted">Loading...</p>
{/if}
<script>
    import { usePostState } from "$lib/states/postState.svelte.js";
    import { useAuthState } from "$lib/states/authState.svelte.js";

    let { communityId } = $props();

    let postState = usePostState();
    let authState = useAuthState();

    let posts = $derived(postState.posts[parseInt(communityId)]);

</script>

{#if posts}
    <ul class="space-y-4">
        {#each posts as post}
            <li class="rounded-xl border-2 border-border bg-bg-post p-4 shadow-sm">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 min-w-0">
                        <h2 class="text-lg font-fraunces font-semibold text-title line-clamp-3 break-words">
                            <a class="  hover:underline" href="/communities/{communityId}/posts/{post.id}">{post.title}</a>
                        </h2>
                        <p class="mt-2 text-sm text-text line-clamp-3 break-words">{post.content}</p>
                    </div>

                    {#if authState.user && Number(authState.user.id) === Number(post.created_by)}
                        <button class="rounded-md border border-border-remove px-3 py-2 text-xs font-semibold text-text-remove transition hover:bg-hover-bg-remove hover:text-hover-text-remove" onclick={() => postState.deletePost(communityId, post.id)}>Remove</button>
                    {/if}
                </div>
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    <p class="rounded-full bg-bg-tile-upvote text-text-tile-upvote px-2 py-1">UpVotes : {post.upvotes}</p>
                    <p class="rounded-full bg-bg-tile-downvote text-text-tile-downvote px-2 py-1">DownVotes : {post.downvotes}</p>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                    {#if authState.user}
                        <button class="rounded-md px-3 py-2 text-xs font-semibold  transition bg-bg-upvote text-text-upvote hover:bg-hover-bg-upvote hover:text-hover-text-upvote " onclick={() => postState.upVotePost(communityId, post.id)}>Upvote</button>
                        <button class="rounded-md px-3 py-2 text-xs font-semibold  transition bg-bg-downvote text-text-downvote hover:bg-hover-bg-downvote hover:text-hover-text-downvote " onclick={() => postState.downVotePost(communityId, post.id)}>Downvote</button>
                    {/if}
                </div>
            </li>
        {/each}
    </ul>
{:else}
    <p class="rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-muted">Loading...</p>
{/if}
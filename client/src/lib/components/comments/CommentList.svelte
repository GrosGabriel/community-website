<script>
import { useCommentState } from "$lib/states/commentState.svelte.js";
import { useAuthState } from "$lib/states/authState.svelte.js";

let { postId, communityId } = $props();

let commentState = useCommentState();
let authState = useAuthState();

let comments = $derived(commentState.comments[postId]);

</script>
{#if comments}
    <ul class="space-y-4">
    {#each comments as comment}
        <li class="rounded-xl border-2 border-border bg-bg-post p-4 shadow-sm">
            <div class="flex items-start justify-between gap-4">
                <p class="flex-1 min-w-0 text-sm text-text line-clamp-3 break-words">{comment.content}</p>

                {#if authState.user && Number(authState.user.id) === Number(comment.created_by)}
                    <button class="rounded-md border border-border-remove px-3 py-2 text-xs font-semibold text-text-remove transition hover:bg-hover-bg-remove hover:text-hover-text-remove" onclick={() => commentState.deleteComment(communityId, postId, comment.id)}>Remove</button>
                {/if}
            </div>
            <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                <p class="rounded-full bg-bg-tile-upvote text-text-tile-upvote px-2 py-1">UpVotes : {comment.upvotes}</p>
                <p class="rounded-full bg-bg-tile-downvote text-text-tile-downvote px-2 py-1">DownVotes : {comment.downvotes}</p>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
                {#if authState.user}
                    <button class="rounded-md px-3 py-2 text-xs font-semibold  transition bg-bg-upvote text-text-upvote hover:bg-hover-bg-upvote hover:text-hover-text-upvote " onclick={() => commentState.upVoteComment(communityId, postId, comment.id)}>Upvote</button>
                    <button class="rounded-md px-3 py-2 text-xs font-semibold  transition bg-bg-downvote text-text-downvote hover:bg-hover-bg-downvote hover:text-hover-text-downvote " onclick={() => commentState.downVoteComment(communityId, postId, comment.id)}>Downvote</button>
                {/if}
            </div>
        </li>
    {/each}
    </ul>
{:else}
    <p class="rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-muted">Loading...</p>
{/if}


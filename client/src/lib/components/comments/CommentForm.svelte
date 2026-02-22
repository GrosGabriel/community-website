<script>

import { useCommentState } from "$lib/states/commentState.svelte.js";
import { useAuthState } from "$lib/states/authState.svelte.js";

let { postId, communityId } = $props();

let commentState = useCommentState();
let authState = useAuthState();

const addComment = (e) => {
    e.preventDefault();

    const comment = Object.fromEntries(new FormData(e.target));

    commentState.addComment(communityId, postId, comment);
    e.target.reset();
};


</script>

{#if authState.user}
<form class="space-y-3 rounded-xl border border-border bg-bg-post p-5 shadow-sm" onsubmit={addComment}>
    <h3 class="text-lg font-fraunces font-semibold text-title">Add a comment</h3>
    <textarea class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title" placeholder="Comment content" name="content" id="content"></textarea>
    <input class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" type="submit" value="Add Comment"/>

</form>
{:else}
<p class="rounded-md border-1 border-border bg-bg-muted px-3 py-2 text-sm text-muted">You must be logged in to comment.</p>
{/if}
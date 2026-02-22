<script>
import { useHomePageState } from "$lib/states/homePageState.svelte.js";
let homePageState = useHomePageState();



</script>

<section class="space-y-4">
    <h2 class="text-2xl font-fraunces font-semibold text-title">Recent posts</h2>

    <ul class="space-y-3">
        {#each homePageState.recentPosts as post}
            <li class="rounded-xl border-1 border-border bg-bg-post p-6 shadow-sm">
                <a class="text-l font-bold text-title hover:underline" href="/communities/{post.community_id}/posts/{post.id}">{post.title}</a>
                <p class="mt-2 text-sm text-text line-clamp-3 break-words ">{post.content}</p> <!-- line-clamp-3 limits the text to 3 lignes --> 
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    <p class="rounded-full bg-bg-tile-upvote text-text-tile-upvote px-2 py-1">Upvotes: {post.upvotes}</p>
                    <p class="rounded-full bg-bg-tile-downvote text-text-tile-downvote px-2 py-1">Downvotes: {post.downvotes}</p>
                    <p class="rounded-full bg-bg-tile-comment text-text-tile-comment px-2 py-1">Comments: {post.comments}</p>
                </div>
            </li>
        {/each}
    </ul>
</section>
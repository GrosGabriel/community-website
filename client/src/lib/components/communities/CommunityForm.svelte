<script>
    import { useCommunityState } from "$lib/states/communityState.svelte.js";
    import { useAuthState } from "$lib/states/authState.svelte";
    let communityState = useCommunityState();
    let authState = useAuthState();

    const addCommunity = (e) => {
        e.preventDefault();

        const community = Object.fromEntries(new FormData(event.target));

        communityState.addCommunity(community);
        e.target.reset();
        
    };

</script>

{#if authState.user}
<form class="space-y-3 rounded-xl border border-border bg-bg-post p-5 shadow-sm" on:submit={addCommunity}>
    <h3 class="text-lg font-fraunces font-semibold text-title">Create a community</h3>
    <input class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title" type ="text" name="name" id="name" placeholder="Community name"/>
    <textarea class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title" name="description" id="description" placeholder="Community description"></textarea>
    <input class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" type="submit" value="Add community"/>
</form>
{:else}
<p class="rounded-md border-1 border-border bg-bg-muted px-3 py-2 text-sm text-muted">You must be logged in to create a community.</p>
{/if}











<script>
    import { useCommunityState } from "$lib/states/communityState.svelte.js";
    let { communityId } = $props();
    let communityState = useCommunityState();

    let community = $derived(communityState.communities.find((c) => c.id === communityId));

</script>


{#if community}
    <article class="rounded-xl border border-border bg-bg-post p-6 shadow-sm">
        <h1 class="text-3xl font-fraunces font-bold text-title break-words">{community.name}</h1>
        <p class="mt-2 text-text break-words">{community.description}</p>
    </article>
{:else}
    <p class="rounded-md border-1 border-border bg-bg-muted px-3 py-2 text-sm text-muted">Loading...</p>
{/if}


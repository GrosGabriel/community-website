<script>
    import { useCommunityState } from "$lib/states/communityState.svelte.js";
    import { useAuthState } from "$lib/states/authState.svelte.js";
    let communityState = useCommunityState();
    let authState = useAuthState();
    
</script>

<ul class="space-y-3">
    {#each communityState.communities as community}
        <li class="rounded-xl border-2 border-border bg-bg-post p-4 shadow-sm">
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                    <h2 class="text-xl font-fraunces font-semibold text-title break-words">
                       <a class="hover:underline" href="/communities/{community.id}">{community.name}</a>
                    </h2>
                    <p class="mt-1 text-sm text-text line-clamp-3 break-words">{community.description}</p>
                </div>

                {#if authState.user && Number(authState.user.id) === Number(community.created_by)}
                    <button class="rounded-md border-2 border-border-remove px-3 py-2 text-xs font-semibold text-text-remove transition hover:bg-hover-bg-remove hover:text-hover-text-remove" on:click={() => communityState.removeCommunity(community.id)}>Remove</button>
                {/if}
            </div>
        </li>
    {/each}
</ul>






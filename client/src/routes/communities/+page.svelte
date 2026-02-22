<script>
    import CommunityList from "$lib/components/communities/CommunityList.svelte";
    import CommunityForm from "$lib/components/communities/CommunityForm.svelte";

    import { initCommunities } from "$lib/states/communityState.svelte.js";

    $effect(() => {
        initCommunities();
    });
</script>

<section class="space-y-6">
    <div class="rounded-xl border-2 border-border bg-bg-post p-6 shadow-sm">
        <h1 class="text-3xl font-fraunces font-bold text-title break-words">Communities</h1>
        <p class="mt-2 text-sm text-muted break-words">Explore all communities or create a new one.</p>
    </div>

    <CommunityList />

    <CommunityForm />
</section>
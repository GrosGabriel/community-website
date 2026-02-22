<script>
import { useAuthState } from "$lib/states/authState.svelte.js";
import HomePageList from "$lib/components/homePage/HomePageList.svelte";
import { initHomePage } from "$lib/states/homePageState.svelte.js";
const authState = useAuthState();

$effect(() => {
    initHomePage();
})


</script>

<section class="space-y-5">
    <div class="rounded-xl border-1 border-border bg-bg-post p-6 shadow-xl">
        <h1 class="text-3xl font-fraunces font-bold text-title">Welcome to the home page!</h1>
        <p class="m-4 text-md text-muted">Discover the latest posts and join the discussions.</p>

        {#if authState.user}
            <div class="font-sm">
                <a class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" href="/communities">Go to communities</a>
            </div>
        {/if}
    </div>

    <HomePageList />
</section>
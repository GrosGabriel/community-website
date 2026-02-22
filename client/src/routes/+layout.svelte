<script>
  import "../app.css";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import DarkModeToggle from "$lib/components/themes/DarkModeToggle.svelte";
  let { children } = $props();


  const authState = useAuthState();

</script>

<header class="sticky top-0 z-20 border-b-5 border-border bg-header">
  <div class="mx-auto flex max-w-6xl w-full justify-between gap-2 px-4 py-3">
    <nav class="flex items-center gap-2 text-sm font-medium">
      <a class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" href="/">Home</a>
      <a class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" href="/communities">Communities</a>
    </nav>

    {#if authState.user}
      <div class="flex items-center gap-3">
        <DarkModeToggle />
        <p class="hidden text-sm text-muted sm:block">Hello, {authState.user.email}!</p>
        <button class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" onclick={() => authState.logout()}>Logout</button>
      </div>
    {:else}
      <ul class="flex items-center gap-2 text-sm font-medium">
        <li><DarkModeToggle /></li>
        <li><a class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" href="/auth/login">Login</a></li>
        <li><a class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" href="/auth/register">Register</a></li>
      </ul>
    {/if}
  </div>
</header> 

<main class="mx-auto w-full max-w-6xl px-4 py-8 ">
  <div class="space-y-6 ">
    {@render children()}
  </div>
</main>

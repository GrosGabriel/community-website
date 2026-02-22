<script>
  import { page } from "$app/state";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { goto } from "$app/navigation";

  let message = $state("");
  let errorMessage = $state("");
  let isLoading = $state(false);

  const authState = useAuthState();

  const handleForm = async (e) => {
    e.preventDefault();
    errorMessage = "";
    message = "";
    isLoading = true;

    const { email, password } = Object.fromEntries(new FormData(e.target));

    try {
      if (page.params.action === "login") {
        await authState.login(email, password);
        message = "Login successful! Redirecting...";
        setTimeout(() => goto("/"), 1000);
      } else {
        await authState.register(email, password);
        message = "Registration successful! You can now log in.";
        setTimeout(() => goto("/auth/login"), 2000);
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  };
</script>

<section class="mx-auto w-full max-w-md rounded-xl border-3 border-border bg-bg-post p-6 shadow-sm">
  <h2 class="text-3xl font-fraunces font-bold text-title">
    {page.params.action === "login" ? "Login" : "Register"}
  </h2>

  {#if message}
    <div class="mt-4 rounded-md border-2 border-border-success bg-bg-success px-3 py-2 text-sm text-text-success">
      <p>{message}</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="mt-4 rounded-md border-2 border-border-error bg-bg-error px-3 py-2 text-sm text-text-error">
      <p>{errorMessage}</p>
    </div>
  {/if}

  <form class="mt-5 space-y-4" onsubmit={handleForm}>
    <label class="block space-y-1">
      <span class="text-sm font-medium text-text">Email</span>
      <input
        class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title"
        id="email"
        name="email"
        type="email"
        placeholder="user@example.com"
        required
      />
    </label>
    <label class="block space-y-1">
      <span class="text-sm font-medium text-text">Password</span>
      <input
        class="w-full rounded-md border-1 border-border bg-bg-input px-3 py-2 text-text-input placeholder:text-muted focus:border-title focus:ring-title"
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </label>
    <button class="w-full rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn" type="submit" disabled={isLoading}>
      {isLoading
        ? "Please wait..."
        : page.params.action === "login"
          ? "Login"
          : "Register"}
    </button>
  </form>

  {#if page.params.action === "login"}
    <p class="mt-4 text-sm text-muted">
      Don't have an account? <a class="font-semibold text-title hover:underline" href="/auth/register">Register here</a>
    </p>
  {:else}
    <p class="mt-4 text-sm text-muted">
      Already have an account? <a class="font-semibold text-title hover:underline" href="/auth/login">Login here</a>
    </p>
  {/if}
</section>

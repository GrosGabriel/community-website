<script>
import { browser } from "$app/environment";

let currentMode = $state("light");

const applyMode = (mode) => {
		document.documentElement.setAttribute("data-mode", mode);
};

if (browser) {
		const savedMode = localStorage.getItem("mode") || "light";
		currentMode = savedMode;
		applyMode(savedMode);
}

const toggleDarkMode = () => {
		const nextMode = currentMode === "light" ? "dark" : "light";
		currentMode = nextMode;
		localStorage.setItem("mode", nextMode);
		applyMode(nextMode);
};

</script>

<button
	class="rounded-md px-3 py-2 border-1 border-border bg-bg-btn text-text-btn transition hover:bg-hover-bg-btn hover:text-hover-text-btn"
	onclick={toggleDarkMode}
	aria-label={currentMode === "dark"
		? "Switch to light mode"
		: "Switch to dark mode"}
>
	{#if currentMode === "dark"}
		☀️
	{:else}
		🌙
	{/if}
</button>

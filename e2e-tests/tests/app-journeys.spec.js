import { expect, test } from "@playwright/test";

const runId = Date.now();
const userEmail = `e2e_user_${runId}@example.com`;
const password = "Password123!";
const apiBaseUrl = "http://localhost:8000";

const communityName = `E2E Community ${runId}`;
const communityDescription = `Community description ${runId}`;

const postTitle = `E2E Post ${runId}`;
const postContent = `Post content ${runId}`;

const commentContent = `E2E Comment ${runId}`;

let communityId;
let postId;

const authenticateInBrowser = async (page, request) => {
  await request.post(`${apiBaseUrl}/api/auth/register`, {
    data: {
      email: userEmail,
      password: password,
    },
  });

  const loginResponse = await request.post(`${apiBaseUrl}/api/auth/login`, {
    data: {
      email: userEmail,
      password: password,
    },
  });

  expect(loginResponse.ok()).toBeTruthy();
  const data = await loginResponse.json();

  await page.addInitScript(
    ({ user, token }) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    {
      user: data.user,
      token: data.token,
    },
  );
};

test.describe.serial("Core application journeys", () => {
  test("Home page renders main navigation and content", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Communities" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome to the home page!" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent posts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
  });

  test("Auth pages render expected fields and links", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("link", { name: "Login here" })).toBeVisible();

    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register here" })).toBeVisible();
  });

  test("Unauthenticated user sees create-community restriction", async ({ page }) => {
    await page.goto("/communities");
    await expect(page.getByText("You must be logged in to create a community.")).toBeVisible();
  });

  test("Authenticated session shows user greeting and logout", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto("/");
    await expect(page.getByText(`Hello, ${userEmail}!`)).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  test("Authenticated user can create a community", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto("/communities");
    await page.locator("#name").fill(communityName);
    await page.locator("#description").fill(communityDescription);
    await page.locator('input[type="submit"][value="Add community"]').click();

    const communityItem = page.locator("li", { hasText: communityName });
    await expect(communityItem).toBeVisible();
    await expect(communityItem.getByText(communityDescription)).toBeVisible();
  });

  test("Community detail page is reachable from the list", async ({ page }) => {
    await page.goto("/communities");

    await page.getByRole("link", { name: communityName }).click();
    await expect(page).toHaveURL(/\/communities\/\d+$/);

    communityId = Number(page.url().split("/communities/")[1]);

    await expect(page.getByRole("heading", { name: communityName })).toBeVisible();
    await expect(page.getByText(communityDescription)).toBeVisible();
  });

  test("Authenticated user can create a post inside a community", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto(`/communities/${communityId}`);
    await page.locator("#title").fill(postTitle);
    await page.locator("#content").fill(postContent);
    await page.locator('input[type="submit"][value="Add Post"]').click();

    const postItem = page.locator("li", { hasText: postTitle });
    await expect(postItem).toBeVisible();
    await expect(postItem.getByText(postContent)).toBeVisible();
    await expect(postItem.getByText("UpVotes : 0")).toBeVisible();
    await expect(postItem.getByText("DownVotes : 0")).toBeVisible();
  });

  test("Post voting updates counters", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto(`/communities/${communityId}`);

    const postItem = page.locator("li", { hasText: postTitle });
    await postItem.getByRole("button", { name: "Upvote" }).click();
    await expect(postItem.getByText("UpVotes : 1")).toBeVisible();

    await postItem.getByRole("button", { name: "Downvote" }).click();
    await expect(postItem.getByText("DownVotes : 1")).toBeVisible();
  });

  test("User can open a post and add a comment", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto(`/communities/${communityId}`);
    await page.getByRole("link", { name: postTitle }).click();
    await expect(page).toHaveURL(/\/communities\/\d+\/posts\/\d+$/);

    postId = Number(page.url().split("/posts/")[1]);

    await expect(page.getByRole("heading", { name: postTitle })).toBeVisible();
    await expect(page.getByText(postContent)).toBeVisible();

    await page.locator("textarea#content").fill(commentContent);
    await page.locator('input[type="submit"][value="Add Comment"]').click();

    const commentItem = page.locator("li", { hasText: commentContent });
    await expect(commentItem).toBeVisible();
    await expect(commentItem.getByText("UpVotes : 0")).toBeVisible();
    await expect(commentItem.getByText("DownVotes : 0")).toBeVisible();
  });

  test("User can remove own comment and post", async ({ page, request }) => {
    await authenticateInBrowser(page, request);

    await page.goto(`/communities/${communityId}/posts/${postId}`);

    const commentItem = page.locator("li", { hasText: commentContent });
    await commentItem.getByRole("button", { name: "Remove" }).click();
    await expect(commentItem).not.toBeVisible();

    await page.goto(`/communities/${communityId}`);
    const postItem = page.locator("li", { hasText: postTitle });
    await postItem.getByRole("button", { name: "Remove" }).click();
    await expect(postItem).not.toBeVisible();
  });


});

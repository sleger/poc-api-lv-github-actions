const axios = require("axios");
const fs = require("fs");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const results = [];

async function runTest(method, route, fn) {
  const start = Date.now();
  try {
    const { status } = await fn();
    const duration = Date.now() - start;
    results.push({ method, route, status, duration, result: "SUCCESS", error: null });
    console.log(`[${method}] ${route} -> ${status} (${duration}ms) SUCCESS`);
  } catch (error) {
    const duration = Date.now() - start;
    results.push({
      method, route,
      status: error.response?.status || 0,
      duration, result: "FAIL",
      error: error.message,
    });
    console.log(`[${method}] ${route} -> FAIL (${duration}ms) ${error.message}`);
  }
}

async function getPost() {
  return await axios.get(`${BASE_URL}/posts/1`);
}
async function createPost() {
  return await axios.post(`${BASE_URL}/posts`, {
    title: "My POC GitHub Actions",
    body: "Test from GitHub Actions",
    userId: 1,
  });
}
async function updatePost() {
  return await axios.put(`${BASE_URL}/posts/1`, {
    id: 1, title: "Updated title",
    body: "Replaced content", userId: 1,
  });
}
async function patchPost() {
  return await axios.patch(`${BASE_URL}/posts/1`, { title: "Modified title" });
}
async function deletePost() {
  return await axios.delete(`${BASE_URL}/posts/1`);
}

async function runAllCalls() {
  console.log("Starting SUCCESS API calls...");
  await runTest("GET",    "/posts/1", getPost);
  await runTest("POST",   "/posts",   createPost);
  await runTest("PUT",    "/posts/1", updatePost);
  await runTest("PATCH",  "/posts/1", patchPost);
  await runTest("DELETE", "/posts/1", deletePost);

  // Writing to GITHUB_OUTPUT
  const json = JSON.stringify(results);
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `details=${json}\n`);
    console.log("Results written to GITHUB_OUTPUT");
  } else {
    console.log("GITHUB_OUTPUT not available (local mode)");
  }

  console.log("JSON:", json);

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) process.exit(1);
  else console.log("All API calls succeeded!");
}

runAllCalls();

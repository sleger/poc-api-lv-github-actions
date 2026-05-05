const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const results = [];

async function runTest(method, route, fn) {
  const start = Date.now();
  try {
    const { status } = await fn();
    const duration = Date.now() - start;
    results.push({ method, route, status, duration, result: "SUCCESS", error: null });
    console.log(`✅ [${method}] ${route} → ${status} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    results.push({
      method, route,
      status: error.response?.status || "ERR",
      duration, result: "FAIL",
      error: error.message,
    });
    console.error(`❌ [${method}] ${route} → ${error.message} (${duration}ms)`);
  }
}

async function getPost() {
  return await axios.get(`${BASE_URL}/posts/1`);
}
async function createPost() {
  return await axios.post(`${BASE_URL}/posts`, {
    title: "Mon POC GitHub Actions",
    body: "Test d'appel API depuis GitHub Actions",
    userId: 1,
  });
}
async function updatePost() {
  return await axios.put(`${BASE_URL}/posts/1`, {
    id: 1, title: "Titre mis à jour",
    body: "Contenu entièrement remplacé", userId: 1,
  });
}
async function patchPost() {
  return await axios.patch(`${BASE_URL}/posts/1`, { title: "Titre modifié partiellement" });
}
async function deletePost() {
  return await axios.delete(`${BASE_URL}/posts/1`);
}

async function runAllCalls() {
  console.log("RESULTS_JSON_START_SUCCESS");
  await runTest("GET",    "/posts/1", getPost);
  await runTest("POST",   "/posts",   createPost);
  await runTest("PUT",    "/posts/1", updatePost);
  await runTest("PATCH",  "/posts/1", patchPost);
  await runTest("DELETE", "/posts/1", deletePost);

  console.log("RESULTS_JSON_START");
  console.log(JSON.stringify(results));
  console.log("RESULTS_JSON_END");

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) {
    process.exit(1);
  } else {
    console.log("🎉 Tous les appels API ont été exécutés avec succès !");
  }
}

runAllCalls();

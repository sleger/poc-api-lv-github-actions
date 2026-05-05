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

async function getPostNotFound() {
  const response = await axios.get(`${BASE_URL}/posts/99999`);
  if (!response.data?.id) throw new Error("Post introuvable - Reponse vide");
  return response;
}
async function createPostInvalid() {
  const response = await axios.post(`${BASE_URL}/posts`, {});
  if (!response.data?.title) throw new Error("Titre manquant dans la reponse");
  return response;
}
async function updatePostWrongEndpoint() {
  return await axios.put(`${BASE_URL}/wrong-endpoint/1`, { title: "Test" });
}
async function patchPostMissingField() {
  const originalTitle = "sunt aut facere repellat provident occaecati excepturi optio reprehenderit";
  await axios.patch(`${BASE_URL}/posts/1`, { title: "Nouveau titre" });
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.title === originalTitle) {
    throw new Error("PATCH echoue - Titre non sauvegarde");
  }
  return check;
}
async function deletePostInvalidId() {
  await axios.delete(`${BASE_URL}/posts/1`);
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.id === 1) throw new Error("DELETE echoue - Post toujours present");
  return check;
}

async function runAllFailures() {
  console.log("Demarrage des appels API FAILURE...");
  await runTest("GET",    "/posts/99999",      getPostNotFound);
  await runTest("POST",   "/posts",            createPostInvalid);
  await runTest("PUT",    "/wrong-endpoint/1", updatePostWrongEndpoint);
  await runTest("PATCH",  "/posts/1",          patchPostMissingField);
  await runTest("DELETE", "/posts/1",          deletePostInvalidId);

  // Ecriture dans GITHUB_OUTPUT
  const json = JSON.stringify(results);
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `details=${json}\n`);
    console.log("Resultats ecrits dans GITHUB_OUTPUT");
  } else {
    console.log("GITHUB_OUTPUT non disponible (mode local)");
  }

  console.log("JSON:", json);

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) process.exit(1);
  else console.log("Tous les tests ont reussi !");
}

runAllFailures();

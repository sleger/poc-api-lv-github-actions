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

async function getPostNotFound() {
  const response = await axios.get(`${BASE_URL}/posts/99999`);
  if (response.status === 200 && !response.data?.id) {
    throw new Error("Post introuvable - Réponse vide reçue (404 simulé)");
  }
  return response;
}
async function createPostInvalid() {
  const response = await axios.post(`${BASE_URL}/posts`, {});
  if (!response.data?.title) {
    throw new Error("Création échouée - Le titre est manquant dans la réponse");
  }
  return response;
}
async function updatePostWrongEndpoint() {
  return await axios.put(`${BASE_URL}/wrong-endpoint/1`, { title: "Test" });
}
async function patchPostMissingField() {
  const originalTitle = "sunt aut facere repellat provident occaecati excepturi optio reprehenderit";
  await axios.patch(`${BASE_URL}/posts/1`, { title: "Nouveau titre modifié" });
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.title === originalTitle) {
    throw new Error(`PATCH échoué - Le titre n'a pas été sauvegardé : "${check.data?.title}"`);
  }
  return check;
}
async function deletePostInvalidId() {
  await axios.delete(`${BASE_URL}/posts/1`);
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.id === 1) {
    throw new Error("DELETE échoué - Le post existe toujours après suppression");
  }
  return check;
}

async function runAllFailures() {
  await runTest("GET",    "/posts/99999",      getPostNotFound);
  await runTest("POST",   "/posts",            createPostInvalid);
  await runTest("PUT",    "/wrong-endpoint/1", updatePostWrongEndpoint);
  await runTest("PATCH",  "/posts/1",          patchPostMissingField);
  await runTest("DELETE", "/posts/1",          deletePostInvalidId);

  console.log("RESULTS_JSON_START");
  console.log(JSON.stringify(results));
  console.log("RESULTS_JSON_END");

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) {
    process.exit(1);
  } else {
    console.log("🎉 Tous les tests sont passés !");
  }
}

runAllFailures();

const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";

const results = [];

// 🔧 Helper pour enregistrer les résultats
async function runTest(method, route, fn) {
  const start = Date.now();
  try {
    const { status, data } = await fn();
    const duration = Date.now() - start;
    results.push({
      method,
      route,
      status,
      duration,
      result: "SUCCESS",
      error: null,
    });
    console.log(`✅ [${method}] ${route} → ${status} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    results.push({
      method,
      route,
      status: error.response?.status || "ERR",
      duration,
      result: "FAIL",
      error: error.message,
    });
    console.error(`❌ [${method}] ${route} → ${error.message} (${duration}ms)`);
  }
}

// ❌ GET - ID inexistant (404)
async function getPostNotFound() {
  console.log("\n📥 [GET] Récupération d'un post inexistant...");
  const response = await axios.get(`${BASE_URL}/posts/99999`);
  if (response.status === 200 && !response.data?.id) {
    throw new Error("Post introuvable - Réponse vide reçue (404 simulé)");
  }
  return response;
}

// ❌ POST - Body manquant
async function createPostInvalid() {
  console.log("\n📤 [POST] Création avec un body invalide...");
  const response = await axios.post(`${BASE_URL}/posts`, {});
  if (!response.data?.title) {
    throw new Error("Création échouée - Le titre est manquant dans la réponse");
  }
  return response;
}

// ❌ PUT - Mauvaise URL
async function updatePostWrongEndpoint() {
  console.log("\n🔄 [PUT] Mise à jour sur un endpoint inexistant...");
  return await axios.put(`${BASE_URL}/wrong-endpoint/1`, {
    title: "Test",
  });
}

// ❌ PATCH - Modification non sauvegardée
async function patchPostMissingField() {
  console.log("\n🩹 [PATCH] Vérification de cohérence après modification...");
  const originalTitle =
    "sunt aut facere repellat provident occaecati excepturi optio reprehenderit";

  await axios.patch(`${BASE_URL}/posts/1`, {
    title: "Nouveau titre modifié",
  });

  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.title === originalTitle) {
    throw new Error(
      `PATCH échoué - Le titre n'a pas été sauvegardé : "${check.data?.title}"`
    );
  }
  return check;
}

// ❌ DELETE - Post toujours présent
async function deletePostInvalidId() {
  console.log("\n🗑️ [DELETE] Suppression puis vérification...");
  await axios.delete(`${BASE_URL}/posts/1`);
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.id === 1) {
    throw new Error(
      "DELETE échoué - Le post existe toujours après suppression"
    );
  }
  return check;
}

// 🚀 Lancement
async function runAllFailures() {
  console.log("🚀 Démarrage des appels API FAILURE...\n");

  await runTest("GET",    "/posts/99999",      getPostNotFound);
  await runTest("POST",   "/posts",            createPostInvalid);
  await runTest("PUT",    "/wrong-endpoint/1", updatePostWrongEndpoint);
  await runTest("PATCH",  "/posts/1",          patchPostMissingField);
  await runTest("DELETE", "/posts/1",          deletePostInvalidId);

  // 📤 Export JSON pour le rapport
  const output = JSON.stringify(results, null, 2);
  console.log("\n📊 RESULTS_JSON_START");
  console.log(output);
  console.log("📊 RESULTS_JSON_END");

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) {
    console.log("\n💥 Certains tests ont échoué !");
    process.exit(1);
  } else {
    console.log("\n🎉 Tous les tests sont passés !");
  }
}

runAllFailures();

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

// ✅ GET
async function getPost() {
  console.log("\n📥 [GET] Récupération du post #1...");
  return await axios.get(`${BASE_URL}/posts/1`);
}

// ✅ POST
async function createPost() {
  console.log("\n📤 [POST] Création d'un nouveau post...");
  return await axios.post(`${BASE_URL}/posts`, {
    title: "Mon POC GitHub Actions",
    body: "Test d'appel API depuis GitHub Actions",
    userId: 1,
  });
}

// ✅ PUT
async function updatePost() {
  console.log("\n🔄 [PUT] Mise à jour complète du post #1...");
  return await axios.put(`${BASE_URL}/posts/1`, {
    id: 1,
    title: "Titre mis à jour",
    body: "Contenu entièrement remplacé",
    userId: 1,
  });
}

// ✅ PATCH
async function patchPost() {
  console.log("\n🩹 [PATCH] Modification partielle du post #1...");
  return await axios.patch(`${BASE_URL}/posts/1`, {
    title: "Titre modifié partiellement",
  });
}

// ✅ DELETE
async function deletePost() {
  console.log("\n🗑️ [DELETE] Suppression du post #1...");
  return await axios.delete(`${BASE_URL}/posts/1`);
}

// 🚀 Lancement
async function runAllCalls() {
  console.log("🚀 Démarrage des appels API SUCCESS...\n");

  await runTest("GET",    "/posts/1", getPost);
  await runTest("POST",   "/posts",   createPost);
  await runTest("PUT",    "/posts/1", updatePost);
  await runTest("PATCH",  "/posts/1", patchPost);
  await runTest("DELETE", "/posts/1", deletePost);

  // 📤 Export JSON dans un fichier
  const fs = require("fs");
  fs.writeFileSync("/tmp/success_results.json", JSON.stringify(results, null, 2));
  console.log("✅ Résultats écrits dans /tmp/success_results.json");

  const hasFail = results.some((r) => r.result === "FAIL");
  if (hasFail) {
    console.log("\n💥 Certains tests ont échoué !");
    process.exit(1);
  } else {
    console.log("\n🎉 Tous les appels API ont été exécutés avec succès !");
  }
}


runAllCalls();

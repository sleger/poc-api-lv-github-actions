const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";

// ✅ GET - Récupérer un post
async function getPost() {
  console.log("\n📥 [GET] Récupération du post #1...");
  const response = await axios.get(`${BASE_URL}/posts/1`);
  console.log("✅ Réponse GET :", response.data);
}

// ✅ POST - Créer un nouveau post
async function createPost() {
  console.log("\n📤 [POST] Création d'un nouveau post...");
  const response = await axios.post(`${BASE_URL}/posts`, {
    title: "Mon POC GitHub Actions",
    body: "Test d'appel API depuis GitHub Actions",
    userId: 1,
  });
  console.log("✅ Réponse POST :", response.data);
}

// ✅ PUT - Remplacer un post existant
async function updatePost() {
  console.log("\n🔄 [PUT] Mise à jour complète du post #1...");
  const response = await axios.put(`${BASE_URL}/posts/1`, {
    id: 1,
    title: "Titre mis à jour",
    body: "Contenu entièrement remplacé",
    userId: 1,
  });
  console.log("✅ Réponse PUT :", response.data);
}

// ✅ PATCH - Modifier partiellement un post
async function patchPost() {
  console.log("\n🩹 [PATCH] Modification partielle du post #1...");
  const response = await axios.patch(`${BASE_URL}/posts/1`, {
    title: "Titre modifié partiellement",
  });
  console.log("✅ Réponse PATCH :", response.data);
}

// ✅ DELETE - Supprimer un post
async function deletePost() {
  console.log("\n🗑️ [DELETE] Suppression du post #1...");
  const response = await axios.delete(`${BASE_URL}/posts/1`);
  console.log("✅ Réponse DELETE : Post supprimé avec succès", response.status);
}

// 🚀 Lancement de tous les appels
async function runAllCalls() {
  console.log("🚀 Démarrage des appels API...\n");
  try {
    await getPost();
    await createPost();
    await updatePost();
    await patchPost();
    await deletePost();
    console.log("\n🎉 Tous les appels API ont été exécutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors d'un appel API :", error.message);
    process.exit(1);
  }
}

runAllCalls();

const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";

// ❌ GET - ID inexistant (404)
async function getPostNotFound() {
  console.log("\n📥 [GET] Récupération d'un post inexistant...");
  const response = await axios.get(`${BASE_URL}/posts/99999`);
  if (response.status === 200 && !response.data?.id) {
    throw new Error("❌ Post introuvable - Réponse vide reçue (404 simulé)");
  }
  console.log("✅ Réponse GET :", response.data);
}

// ❌ POST - Body manquant (données invalides)
async function createPostInvalid() {
  console.log("\n📤 [POST] Création avec un body invalide...");
  const response = await axios.post(`${BASE_URL}/posts`, {});
  if (!response.data?.title) {
    throw new Error("❌ Création échouée - Le titre est manquant dans la réponse");
  }
  console.log("✅ Réponse POST :", response.data);
}

// ❌ PUT - Mauvaise URL (endpoint inexistant)
async function updatePostWrongEndpoint() {
  console.log("\n🔄 [PUT] Mise à jour sur un endpoint inexistant...");
  const response = await axios.put(`${BASE_URL}/wrong-endpoint/1`, {
    title: "Test",
  });
  if (response.status !== 200) {
    throw new Error(`❌ PUT échoué - Status reçu : ${response.status}`);
  }
  console.log("✅ Réponse PUT :", response.data);
}

// ❌ PATCH - Simule une incohérence de données métier
async function patchPostMissingField() {
  console.log("\n🩹 [PATCH] Vérification de cohérence après modification...");

  const originalTitle = "sunt aut facere repellat provident occaecati excepturi optio reprehenderit";
  
  // On patch avec un nouveau titre
  await axios.patch(`${BASE_URL}/posts/1`, {
    title: "Nouveau titre modifié",
  });

  // On re-fetch le post pour vérifier (JSONPlaceholder ne sauvegarde pas)
  const check = await axios.get(`${BASE_URL}/posts/1`);

  // On s'attend à ce que le titre ait changé, mais JSONPlaceholder retourne l'original
  // Donc si le titre est toujours l'original → la modification n'a pas été sauvegardée → FAIL
  if (check.data?.title === originalTitle) {
    throw new Error(
      `❌ PATCH échoué - Le titre n'a pas été sauvegardé, toujours : "${check.data?.title}"`
    );
  }

  console.log("✅ Réponse PATCH :", check.data);
}

// ❌ DELETE - Vérifie que le post est bien supprimé en essayant de le récupérer
async function deletePostInvalidId() {
  console.log("\n🗑️ [DELETE] Suppression puis vérification que le post existe toujours...");
  await axios.delete(`${BASE_URL}/posts/1`);

  // JSONPlaceholder ne supprime pas vraiment, donc ce GET va réussir → on lève une erreur
  const check = await axios.get(`${BASE_URL}/posts/1`);
  if (check.data?.id === 1) {
    throw new Error(
      "❌ DELETE échoué - Le post existe toujours après suppression (id: 1 toujours présent)"
    );
  }
  console.log("✅ Suppression confirmée");
}

// 🚀 Lancement de tous les appels en échec
async function runAllFailures() {
  console.log("🚀 Démarrage des appels API en FAILURE...\n");

  const tests = [
    { name: "GET - Post inexistant", fn: getPostNotFound },
    { name: "POST - Body invalide", fn: createPostInvalid },
    { name: "PUT - Mauvais endpoint", fn: updatePostWrongEndpoint },
    { name: "PATCH - Titre incorrect", fn: patchPostMissingField },
    { name: "DELETE - Post toujours présent", fn: deletePostInvalidId },
  ];

  let hasFailure = false;

  for (const test of tests) {
    try {
      await test.fn();
      console.log(`✅ [PASS] ${test.name}`);
    } catch (error) {
      console.error(`❌ [FAIL] ${test.name} → ${error.message}`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.log("\n💥 Certains tests ont échoué !");
    process.exit(1);
  } else {
    console.log("\n🎉 Tous les tests sont passés !");
  }
}

runAllFailures();

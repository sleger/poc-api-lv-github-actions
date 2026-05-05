const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// 📊 Récupération des variables d'environnement
const status = process.env.WORKFLOW_STATUS || "unknown";
const successDetails = process.env.SUCCESS_DETAILS || "Aucun détail disponible";
const failureDetails = process.env.FAILURE_DETAILS || "Aucun détail disponible";
const runUrl = process.env.RUN_URL || "#";

async function sendReport() {
  console.log("📧 Envoi du rapport par email...");

  const isSuccess = status === "success";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      
      <!-- Header -->
      <div style="background-color: ${isSuccess ? "#28a745" : "#dc3545"}; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">
          ${isSuccess ? "✅ Tests API - SUCCESS" : "❌ Tests API - FAILURE"}
        </h1>
      </div>

      <!-- Body -->
      <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6;">
        
        <p style="font-size: 16px; color: #333;">
          Voici le rapport d'exécution de ton workflow GitHub Actions.
        </p>

        <!-- Success Section -->
        <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <h2 style="color: #28a745; margin: 0 0 10px 0;">✅ Appels API Success</h2>
          <pre style="margin: 0; white-space: pre-wrap; font-size: 13px; color: #333;">${successDetails}</pre>
        </div>

        <!-- Failure Section -->
        <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <h2 style="color: #dc3545; margin: 0 0 10px 0;">❌ Appels API Failure</h2>
          <pre style="margin: 0; white-space: pre-wrap; font-size: 13px; color: #333;">${failureDetails}</pre>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="${runUrl}" 
             style="background-color: #0366d6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-size: 14px;">
            🔍 Voir les détails sur GitHub Actions
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color: #e9ecef; padding: 10px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #666;">
          🤖 Rapport généré automatiquement par GitHub Actions
        </p>
      </div>

    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.REPORT_EMAIL,
      subject: `${isSuccess ? "✅" : "❌"} Rapport API Tests - ${new Date().toLocaleDateString("fr-FR")}`,
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Erreur envoi email :", error);
      process.exit(1);
    }

    console.log("✅ Email envoyé avec succès ! ID :", data.id);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
}

sendReport();

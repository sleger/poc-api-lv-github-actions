// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);
// const runUrl = process.env.RUN_URL || "#";
// const date = new Date().toLocaleDateString("fr-FR", {
//   weekday: "long", year: "numeric", month: "long", day: "numeric",
// });

// const time = new Date().toLocaleTimeString("fr-FR", {
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
// });

// // 🔧 Parse JSON directly from the environment variable
// function parseResults(raw) {
//   try {
//     if (!raw || raw.trim() === "") {
//       console.warn("Empty variable!");
//       return [];
//     }
//     console.log("Parsing (first 100 chars):", raw.substring(0, 100));
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("Parsing error:", e.message);
//     return [];
//   }
// }

// const successResults = parseResults(process.env.SUCCESS_DETAILS || "");
// const failureResults = parseResults(process.env.FAILURE_DETAILS || "");

// console.log("Success results:", successResults.length);
// console.log("Failure results:", failureResults.length);

// function methodColor(method) {
//   const colors = {
//     GET: "#61affe", POST: "#49cc90", PUT: "#fca130",
//     PATCH: "#50e3c2", DELETE: "#f93e3e",
//   };
//   return colors[method] || "#999";
// }

// function methodBadge(method) {
//   return `<span style="background-color:${methodColor(method)};color:white;padding:3px 10px;border-radius:4px;font-weight:bold;font-size:12px;font-family:monospace;">${method}</span>`;
// }

// function generateTable(results, title, color) {
//   const total   = results.length;
//   const success = results.filter((r) => r.result === "SUCCESS").length;
//   const fail    = results.filter((r) => r.result === "FAIL").length;

//   const rows = results.map((r) => `
//     <tr style="border-bottom:1px solid #eee;">
//       <td style="padding:10px 15px;">${methodBadge(r.method)}</td>
//       <td style="padding:10px 15px;font-family:monospace;color:#555;">${r.route}</td>
//       <td style="padding:10px 15px;text-align:center;">
//         <span style="background-color:${r.status >= 200 && r.status < 300 ? "#d4edda" : "#f8d7da"};color:${r.status >= 200 && r.status < 300 ? "#28a745" : "#dc3545"};padding:3px 10px;border-radius:4px;font-weight:bold;font-size:12px;">${r.status}</span>
//       </td>
//       <td style="padding:10px 15px;text-align:center;color:#888;font-size:13px;">${r.duration}ms</td>
//       <td style="padding:10px 15px;text-align:center;font-size:18px;">${r.result === "SUCCESS" ? "✅" : "❌"}</td>
//       <td style="padding:10px 15px;font-size:12px;color:#dc3545;">${r.error ? r.error : '<span style="color:#28a745;">—</span>'}</td>
//     </tr>
//   `).join("");

//   return `
//     <div style="margin-bottom:30px;">
//       <div style="background-color:${color};padding:12px 20px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;">
//         <h2 style="color:white;margin:0;font-size:16px;">${title}</h2>
//         <span style="color:white;font-size:14px;">✅ ${success} / ${total} &nbsp;&nbsp; ❌ ${fail} / ${total}</span>
//       </div>
//       <table style="width:100%;border-collapse:collapse;background:white;border-radius:0 0 8px 8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
//         <thead>
//           <tr style="background-color:#f8f9fa;border-bottom:2px solid #dee2e6;">
//             <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Method</th>
//             <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Route</th>
//             <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Status</th>
//             <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Duration</th>
//             <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Result</th>
//             <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Error</th>
//           </tr>
//         </thead>
//         <tbody>${rows}</tbody>
//       </table>
//     </div>`;
// }

// function generateProgressBars(successResults, failureResults) {
//   const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
//   const bars = methods.map((method) => {
//     const s = successResults.filter((r) => r.method === method && r.result === "SUCCESS").length;
//     const f = failureResults.filter((r) => r.method === method && r.result === "FAIL").length;
//     const total = s + f;
//     const percent = total > 0 ? Math.round((s / total) * 100) : 0;
//     return `
//       <div style="margin-bottom:12px;">
//         <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
//           <span style="font-weight:bold;font-size:13px;color:${methodColor(method)};">${method}</span>
//           <span style="font-size:13px;color:#555;">${s} success / ${f} failure — ${percent}%</span>
//         </div>
//         <div style="background-color:#f8d7da;border-radius:10px;height:14px;overflow:hidden;">
//           <div style="width:${percent}%;background-color:${methodColor(method)};height:100%;border-radius:10px;"></div>
//         </div>
//       </div>`;
//   }).join("");

//   return `
//     <div style="background:white;border-radius:8px;padding:20px;margin-bottom:30px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
//       <h2 style="margin:0 0 20px 0;font-size:16px;color:#333;">📈 Success rate by HTTP method</h2>
//       ${bars}
//     </div>`;
// }

// function generateSummary(successResults, failureResults) {
//   const totalSuccess  = successResults.filter((r) => r.result === "SUCCESS").length;
//   const totalFail     = failureResults.filter((r) => r.result === "FAIL").length;
//   const total         = successResults.length + failureResults.length;
//   const globalPercent = total > 0 ? Math.round((totalSuccess / total) * 100) : 0;

//   return `
//     <div style="display:flex;gap:15px;margin-bottom:30px;">
//       <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
//         <div style="font-size:36px;font-weight:bold;color:#333;"> ${total}</div>
//         <div style="font-size:13px;color:#888;margin-top:5px;">Total calls</div>
//       </div>

//       <div>&nbsp;</div>

//       <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #28a745;">
//         <div style="font-size:36px;font-weight:bold;color:#28a745;"> ✅ ${totalSuccess}</div>
//         <div style="font-size:13px;color:#888;margin-top:5px;">Success</div>
//       </div>

//       <div>&nbsp;</div>

//       <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #dc3545;">
//         <div style="font-size:36px;font-weight:bold;color:#dc3545;"> ❌ ${totalFail}</div>
//         <div style="font-size:13px;color:#888;margin-top:5px;">Failures</div>
//       </div>

//       <div>&nbsp;</div>

//       <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #0366d6;">
//         <div style="font-size:36px;font-weight:bold;color:#0366d6;">${globalPercent}%</div>
//         <div style="font-size:13px;color:#888;margin-top:5px;">Success rate</div>
//       </div>
//     </div>`;
// }

// async function sendReport() {
//   console.log("Generating and sending report...");

//   const htmlContent = `
//     <div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;background-color:#f0f2f5;padding:20px;">
//       <div style="background:linear-gradient(135deg,#0366d6,#6f42c1);padding:30px;border-radius:12px;margin-bottom:25px;text-align:center;">
//         <h1 style="color:white;margin:0 0 8px 0;font-size:26px;">🚀 POC GitHub Actions — API Report</h1>
//         <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">📅 ${date}</p>
//       </div>
//       ${generateSummary(successResults, failureResults)}
//       ${generateProgressBars(successResults, failureResults)}
//       ${generateTable(successResults, " API Calls — SUCCESS ", "#28a745")}
//       ${generateTable(failureResults, " API Calls — FAILURE ", "#dc3545")}
//       <div style="text-align:center;margin-top:10px;">
//         <a href="${runUrl}" style="background:linear-gradient(135deg,#0366d6,#6f42c1);color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
//           🔍 View details on GitHub Actions
//         </a>
//       </div>
//       <div style="text-align:center;margin-top:25px;padding:15px;">
//         <p style="margin:0;font-size:12px;color:#999;">🤖 Report automatically generated by GitHub Actions</p>
//       </div>
//     </div>`;

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "api-report@resend.dev",
//       to: process.env.REPORT_EMAIL,
//       subject: `🚀 API Tests Report — ${date} - ${time}`,
//       html: htmlContent,
//     });

//     if (error) {
//       console.error("Email sending error:", error);
//       process.exit(1);
//     }

//     console.log("Report sent! ID:", data.id);
//   } catch (err) {
//     console.error("Error:", err.message);
//     process.exit(1);
//   }
// }

// sendReport();

const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module

// The Resend part is removed or commented out if you only want file generation.
// If you want both email and file, keep it and add the file writing part.
// For this example, I'll keep the Resend part but add the file writing.

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const runUrl = process.env.RUN_URL || "#";
const date = new Date().toLocaleDateString("fr-FR", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

const time = new Date().toLocaleTimeString("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// 🔧 Parse JSON directly from the environment variable
function parseResults(raw) {
  try {
    if (!raw || raw.trim() === "") {
      console.warn("Empty variable!");
      return [];
    }
    console.log("Parsing (first 100 chars):", raw.substring(0, 100));
    return JSON.parse(raw);
  } catch (e) {
    console.error("Parsing error:", e.message);
    return [];
  }
}

const successResults = parseResults(process.env.SUCCESS_DETAILS || "");
const failureResults = parseResults(process.env.FAILURE_DETAILS || "");

console.log("Success results:", successResults.length);
console.log("Failure results:", failureResults.length);

function methodColor(method) {
  const colors = {
    GET: "#61affe", POST: "#49cc90", PUT: "#fca130",
    PATCH: "#50e3c2", DELETE: "#f93e3e",
  };
  return colors[method] || "#999";
}

function methodBadge(method) {
  return `<span style="background-color:${methodColor(method)};color:white;padding:3px 10px;border-radius:4px;font-weight:bold;font-size:12px;font-family:monospace;">${method}</span>`;
}

function generateTable(results, title, color) {
  const total   = results.length;
  const success = results.filter((r) => r.result === "SUCCESS").length;
  const fail    = results.filter((r) => r.result === "FAIL").length;

  const rows = results.map((r) => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:10px 15px;">${methodBadge(r.method)}</td>
      <td style="padding:10px 15px;font-family:monospace;color:#555;">${r.route}</td>
      <td style="padding:10px 15px;text-align:center;">
        <span style="background-color:${r.status >= 200 && r.status < 300 ? "#d4edda" : "#f8d7da"};color:${r.status >= 200 && r.status < 300 ? "#28a745" : "#dc3545"};padding:3px 10px;border-radius:4px;font-weight:bold;font-size:12px;">${r.status}</span>
      </td>
      <td style="padding:10px 15px;text-align:center;color:#888;font-size:13px;">${r.duration}ms</td>
      <td style="padding:10px 15px;text-align:center;font-size:18px;">${r.result === "SUCCESS" ? "✅" : "❌"}</td>
      <td style="padding:10px 15px;font-size:12px;color:#dc3545;">${r.error ? r.error : '<span style="color:#28a745;">—</span>'}</td>
    </tr>
  `).join("");

  return `
    <div style="margin-bottom:30px;">
      <div style="background-color:${color};padding:12px 20px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;">
        <h2 style="color:white;margin:0;font-size:16px;">${title}</h2>
        <span style="color:white;font-size:14px;">✅ ${success} / ${total} &nbsp;&nbsp; ❌ ${fail} / ${total}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:0 0 8px 8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <thead>
          <tr style="background-color:#f8f9fa;border-bottom:2px solid #dee2e6;">
            <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Method</th>
            <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Route</th>
            <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Status</th>
            <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Duration</th>
            <th style="padding:10px 15px;text-align:center;font-size:13px;color:#555;">Result</th>
            <th style="padding:10px 15px;text-align:left;font-size:13px;color:#555;">Error</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function generateProgressBars(successResults, failureResults) {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const bars = methods.map((method) => {
    const s = successResults.filter((r) => r.method === method && r.result === "SUCCESS").length;
    const f = failureResults.filter((r) => r.method === method && r.result === "FAIL").length;
    const total = s + f;
    const percent = total > 0 ? Math.round((s / total) * 100) : 0;
    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-weight:bold;font-size:13px;color:${methodColor(method)};">${method}</span>
          <span style="font-size:13px;color:#555;">${s} success / ${f} failure — ${percent}%</span>
        </div>
        <div style="background-color:#f8d7da;border-radius:10px;height:14px;overflow:hidden;">
          <div style="width:${percent}%;background-color:${methodColor(method)};height:100%;border-radius:10px;"></div>
        </div>
      </div>`;
  }).join("");

  return `
    <div style="background:white;border-radius:8px;padding:20px;margin-bottom:30px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h2 style="margin:0 0 20px 0;font-size:16px;color:#333;">📈 Success rate by HTTP method</h2>
      ${bars}
    </div>`;
}

function generateSummary(successResults, failureResults) {
  const totalSuccess  = successResults.filter((r) => r.result === "SUCCESS").length;
  const totalFail     = failureResults.filter((r) => r.result === "FAIL").length;
  const total         = successResults.length + failureResults.length;
  const globalPercent = total > 0 ? Math.round((totalSuccess / total) * 100) : 0;

  return `
    <div style="display:flex;gap:15px;margin-bottom:30px;">
      <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="font-size:36px;font-weight:bold;color:#333;"> ${total}</div>
        <div style="font-size:13px;color:#888;margin-top:5px;">Total calls</div>
      </div>

      <div>&nbsp;</div>

      <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #28a745;">
        <div style="font-size:36px;font-weight:bold;color:#28a745;"> ✅ ${totalSuccess}</div>
        <div style="font-size:13px;color:#888;margin-top:5px;">Success</div>
      </div>

      <div>&nbsp;</div>

      <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #dc3545;">
        <div style="font-size:36px;font-weight:bold;color:#dc3545;"> ❌ ${totalFail}</div>
        <div style="font-size:13px;color:#888;margin-top:5px;">Failures</div>
      </div>

      <div>&nbsp;</div>

      <div style="flex:1;background:white;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #0366d6;">
        <div style="font-size:36px;font-weight:bold;color:#0366d6;">${globalPercent}%</div>
        <div style="font-size:13px;color:#888;margin-top:5px;">Success rate</div>
      </div>
    </div>`;
}

async function sendReport() {
  console.log("Generating report content...");

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;background-color:#f0f2f5;padding:20px;">
      <div style="background:linear-gradient(135deg,#0366d6,#6f42c1);padding:30px;border-radius:12px;margin-bottom:25px;text-align:center;">
        <h1 style="color:white;margin:0 0 8px 0;font-size:26px;">🚀 POC GitHub Actions — API Report</h1>
        <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">📅 ${date}</p>
      </div>
      ${generateSummary(successResults, failureResults)}
      ${generateProgressBars(successResults, failureResults)}
      ${generateTable(successResults, " API Calls — SUCCESS ", "#28a745")}
      ${generateTable(failureResults, " API Calls — FAILURE ", "#dc3545")}
      <div style="text-align:center;margin-top:10px;">
        <a href="${runUrl}" style="background:linear-gradient(135deg,#0366d6,#6f42c1);color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
          🔍 View details on GitHub Actions
        </a>
      </div>
      <div style="text-align:center;margin-top:25px;padding:15px;">
        <p style="margin:0;font-size:12px;color:#999;">🤖 Report automatically generated by GitHub Actions</p>
      </div>
    </div>`;

  // --- NEW: Write HTML content to a file ---
  const reportFilePath = process.env.REPORT_FILE_PATH;
  if (reportFilePath) {
    try {
      const reportDir = path.dirname(reportFilePath);
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      fs.writeFileSync(reportFilePath, htmlContent);
      console.log(`Report successfully written to ${reportFilePath}`);
    } catch (err) {
      console.error(`Error writing report file to ${reportFilePath}:`, err.message);
      // Decide if you want to exit or continue with email sending
      // process.exit(1);
    }
  } else {
    console.warn("REPORT_FILE_PATH environment variable not set. Skipping file generation.");
  }
  // --- END NEW ---

  // --- Original email sending logic ---
  try {
    const { data, error } = await resend.emails.send({
      from: "api-report@resend.dev",
      to: process.env.REPORT_EMAIL,
      subject: `API Tests Report — ${date} - ${time}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Email sending error:", error);
      // If email sending fails, we might still want the file report, so don't exit here
      // process.exit(1);
    } else {
      console.log("Report email sent! ID:", data.id);
    }
  } catch (err) {
    console.error("Error during email sending:", err.message);
    // process.exit(1);
  }
  // --- End original email sending logic ---
}

sendReport();

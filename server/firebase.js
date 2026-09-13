// Firebase Admin SDK — Firestore connection for the Shop Co backend.
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ID = "shopcoanddashbord";
const STORAGE_BUCKET = "shopcoanddashbord.firebasestorage.app";

// Prefer a service account key file if present (downloaded from Firebase Console).
// Place it at server/firebase-service-account.json
const saPath = path.join(__dirname, "firebase-service-account.json");

let app;
if (fs.existsSync(saPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf-8"));
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
  });
} else {
  // Fall back to GOOGLE_APPLICATION_CREDENTIALS env var or gcloud login.
  try {
    app = initializeApp({
      credential: applicationDefault(),
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
    });
  } catch (e) {
    // Last resort: init without credentials (will only work if Firestore rules allow it).
    app = initializeApp({ projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
  }
}

export const db = getFirestore(app);

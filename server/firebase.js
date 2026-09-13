// Firebase Admin SDK — Firestore connection for the Shop Co backend.
import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "shopcoanddashbord";
const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "shopcoanddashbord.firebasestorage.app";
const SA_FILENAME = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "firebase-service-account.json";

// Prefer a service account key file if present (downloaded from Firebase Console).
const saPath = path.join(__dirname, SA_FILENAME);

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
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
    });
  } catch (e) {
    app = initializeApp({ projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
  }
}

export const db = getFirestore(app);

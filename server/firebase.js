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

let app;

// Option 1: Service account JSON in env var (base64 encoded) — for Vercel
if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf-8")
  );
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
  });
}
// Option 2: Service account file on disk — for local development
else {
  const SA_FILENAME = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "firebase-service-account.json";
  const saPath = path.join(__dirname, SA_FILENAME);
  if (fs.existsSync(saPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf-8"));
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
    });
  } else {
    // Fallback: init without credentials (will only work if Firestore rules allow it)
    app = initializeApp({ projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
  }
}

export const db = getFirestore(app);

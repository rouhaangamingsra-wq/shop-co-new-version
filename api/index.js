// Vercel serverless entry point — exports the Express app for serverless deployment.
// In Vercel, files in /api are treated as serverless functions.
// Exporting an Express app as default works with @vercel/node runtime.
import { app } from "../server/server.js";

export default app;

// Lightweight Firebase init for Auth (client)
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
export const auth = getAuth();

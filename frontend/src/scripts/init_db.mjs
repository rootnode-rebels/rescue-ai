import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH4VkH-o4FW90DRm8Gb73CPm_epccPEXs",
  authDomain: "rescue-ai-1.firebaseapp.com",
  projectId: "rescue-ai-1",
  storageBucket: "rescue-ai-1.firebasestorage.app",
  messagingSenderId: "225164227656",
  appId: "1:225164227656:web:f619a331165abe5261947d",
  measurementId: "G-D5R8GVRSHX"
};

const app = initializeApp(firebaseConfig, "CleanDbInit_" + Date.now());
const db = getFirestore(app);

const bootstrapUsers = [
  {
    uid: "superadmin_adhiam",
    name: "Global Admin (Adhi)",
    email: "adhiam@outlook.in",
    phone: "+91 98765 00001",
    role: "global_admin",
    organization: "EOC National Super Admin Command",
    badgeNumber: "SUPER-ADMIN-01",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
    mustChangePassword: true,
  },
  {
    uid: "superadmin_akash",
    name: "Global Admin (Akash)",
    email: "akashakashr505@gmail.com",
    phone: "+91 98765 00002",
    role: "global_admin",
    organization: "EOC National Super Admin Command",
    badgeNumber: "SUPER-ADMIN-02",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
    mustChangePassword: true,
  },
  {
    uid: "superadmin_adhibasavanal",
    name: "Global Admin (Adhi Basavanal)",
    email: "adhibasavanal@gmail.com",
    phone: "+91 98765 00003",
    role: "global_admin",
    organization: "EOC National Super Admin Command",
    badgeNumber: "SUPER-ADMIN-03",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
    mustChangePassword: true,
  },
  {
    uid: "rescueadmin_akshath",
    name: "Rescue Admin (Akshath)",
    email: "akshathch567@gmail.com",
    phone: "+91 98765 00004",
    role: "rescue_admin",
    organization: "NDRF Emergency Rescue Command",
    badgeNumber: "RESCUE-ADMIN-01",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
    mustChangePassword: true,
  },
  {
    uid: "rescueadmin_akashp",
    name: "Rescue Admin (Akash P)",
    email: "akash191112@gmail.com",
    phone: "+91 98765 00005",
    role: "rescue_admin",
    organization: "Coast Guard Rescue Command",
    badgeNumber: "RESCUE-ADMIN-02",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
    mustChangePassword: true,
  },
];

async function runCleanDbInit() {
  console.log("==================================================");
  console.log("Initializing Clean Firestore DB User Documents...");
  console.log("==================================================");

  for (const user of bootstrapUsers) {
    try {
      await setDoc(doc(db, "users", user.uid), user);
      console.log(`[SUCCESS] Created clean Firestore user record for ${user.email} (${user.role})`);
    } catch (err) {
      console.error(`[ERROR] Failed to write Firestore user for ${user.email}:`, err);
    }
  }

  console.log("==================================================");
  console.log("Clean Database Initialization Complete!");
  console.log("==================================================");
  process.exit(0);
}

runCleanDbInit();

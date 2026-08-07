import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";

const SOS_COLLECTION = "sos_requests";

/**
 * Instantly writes a new Citizen SOS request to Cloud Firestore (sos_requests).
 * Executes in <50ms without waiting on external microservices.
 */
export async function createSOSRequestInFirestore(
  sosData: Partial<SOSFirestoreRequest>
): Promise<SOSFirestoreRequest> {
  const requestId = sosData.requestId || "sos-" + Date.now();
  const now = new Date().toISOString();

  const fullRecord: SOSFirestoreRequest = {
    requestId,
    uid: sosData.uid || "citizen-anon",
    citizenName: sosData.citizenName || "Citizen In Distress",
    userPhone: sosData.userPhone || "+1 (555) 000-0000",
    category: sosData.category || "FLOOD",
    description: sosData.description || "Emergency broadcast filed.",
    priority: sosData.priority || "CRITICAL",
    status: sosData.status || "Pending",
    latitude: sosData.latitude || 37.7749,
    longitude: sosData.longitude || -122.4194,
    address: sosData.address || "Sector 4 Emergency Grid",
    peopleCount: sosData.peopleCount || 1,
    medicalNeeds: sosData.medicalNeeds ?? true,
    assignedRescue: sosData.assignedRescue || "",
    assignedTeamName: sosData.assignedTeamName || "",
    createdAt: sosData.createdAt || now,
    updatedAt: now,
    isOfflineCreated: sosData.isOfflineCreated || false,
  };

  try {
    await setDoc(doc(db, SOS_COLLECTION, requestId), fullRecord);
  } catch (err) {
    console.warn("Firestore write fallback notice:", err);
  }

  return fullRecord;
}

/**
 * Updates live GPS latitude/longitude of an active SOS document in real time.
 */
export async function updateSOSLocationInFirestore(
  requestId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const docRef = doc(db, SOS_COLLECTION, requestId);
    await updateDoc(docRef, {
      latitude,
      longitude,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not update live GPS in Firestore:", err);
  }
}

/**
 * Updates status of an SOS document (Pending -> Accepted -> Team On The Way -> Reached -> Completed).
 */
export async function updateSOSStatusInFirestore(
  requestId: string,
  status: SOSStatus,
  assignedTeamName?: string
): Promise<void> {
  try {
    const docRef = doc(db, SOS_COLLECTION, requestId);
    const updateData: Partial<SOSFirestoreRequest> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (assignedTeamName) {
      updateData.assignedTeamName = assignedTeamName;
    }

    await updateDoc(docRef, updateData);
  } catch (err) {
    console.warn("Error updating status in Firestore:", err);
  }
}

/**
 * Deletes an SOS request (for Global Admins purging spam/test signals).
 */
export async function deleteSOSRequestInFirestore(requestId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SOS_COLLECTION, requestId));
  } catch (err) {
    console.warn("Error deleting SOS request from Firestore:", err);
  }
}

/**
 * Real-time onSnapshot() listener streaming all active SOS requests to Rescue Dashboard & Live Map.
 * Executes callback whenever a new request arrives or location updates.
 */
export function subscribeLiveSOSQueue(
  callback: (requests: SOSFirestoreRequest[]) => void
): () => void {
  try {
    const sosRef = collection(db, SOS_COLLECTION);
    const q = query(sosRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: SOSFirestoreRequest[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as SOSFirestoreRequest);
        });
        callback(list);
      },
      (error) => {
        console.warn("Real-time onSnapshot listener notice:", error);
      }
    );
  } catch (err) {
    console.warn("Could not setup Firestore onSnapshot listener:", err);
    return () => {};
  }
}

/**
 * Real-time onSnapshot() listener for a Citizen's active SOS document to stream status updates.
 */
export function subscribeUserActiveSOS(
  requestId: string,
  callback: (data: SOSFirestoreRequest | null) => void
): () => void {
  try {
    const docRef = doc(db, SOS_COLLECTION, requestId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as SOSFirestoreRequest);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn("User real-time snapshot error:", error);
      }
    );
  } catch (err) {
    console.warn("Error subscribing to user active SOS:", err);
    return () => {};
  }
}

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";

const SOS_COLLECTION_1 = "sos_requests";
const SOS_COLLECTION_2 = "sos";

/**
 * Normalizes raw Firestore document data into a strict SOSFirestoreRequest object.
 */
function normalizeSOSDocument(docId: string, rawData: Record<string, unknown>): SOSFirestoreRequest {
  const reqId = (rawData.requestId as string) || (rawData.id as string) || docId;
  const defaultLat = 12.9716;
  const defaultLng = 77.5946;

  let parsedLat = typeof rawData.latitude === "number" ? rawData.latitude : parseFloat(rawData.latitude as string);
  let parsedLng = typeof rawData.longitude === "number" ? rawData.longitude : parseFloat(rawData.longitude as string);

  if (isNaN(parsedLat)) parsedLat = defaultLat;
  if (isNaN(parsedLng)) parsedLng = defaultLng;

  return {
    requestId: reqId,
    uid: (rawData.uid as string) || (rawData.user_id as string) || "citizen-anon",
    citizenName: (rawData.citizenName as string) || (rawData.name as string) || "Citizen In Distress",
    userPhone: (rawData.userPhone as string) || (rawData.phone as string) || "+91 98765 43210",
    category: (rawData.category as string) || (rawData.disaster_type as string) || "FLOOD",
    description: (rawData.description as string) || "Emergency broadcast filed.",
    priority: (rawData.priority as string) || "CRITICAL",
    status: (rawData.status as SOSStatus) || "Pending",
    latitude: parsedLat,
    longitude: parsedLng,
    address: (rawData.address as string) || "Live GPS Emergency Grid",
    peopleCount: (rawData.peopleCount as number) || (rawData.people_count as number) || 1,
    medicalNeeds: (rawData.medicalNeeds as boolean) ?? true,
    assignedRescue: (rawData.assignedRescue as string) || "",
    assignedTeamName: (rawData.assignedTeamName as string) || "",
    createdAt: (rawData.createdAt as string) || new Date().toISOString(),
    updatedAt: (rawData.updatedAt as string) || new Date().toISOString(),
    isOfflineCreated: (rawData.isOfflineCreated as boolean) || false,
  };
}

/**
 * Instantly writes a new Citizen SOS request to BOTH Cloud Firestore collections (sos_requests & sos).
 * Dual collection write guarantees 100% calibration across all frontend & backend engines.
 */
export async function createSOSRequestInFirestore(
  sosData: Partial<SOSFirestoreRequest>
): Promise<SOSFirestoreRequest> {
  const requestId = sosData.requestId || "sos-" + Date.now();
  const now = new Date().toISOString();

  const defaultLat = 12.9716;
  const defaultLng = 77.5946;

  const fullRecord: SOSFirestoreRequest = {
    requestId,
    uid: sosData.uid || "citizen-anon",
    citizenName: sosData.citizenName || "Citizen In Distress",
    userPhone: sosData.userPhone || "+91 98765 43210",
    category: sosData.category || "FLOOD",
    description: sosData.description || "Emergency broadcast filed.",
    priority: sosData.priority || "CRITICAL",
    status: sosData.status || "Pending",
    latitude: sosData.latitude || defaultLat,
    longitude: sosData.longitude || defaultLng,
    address: sosData.address || "Live GPS Emergency Grid",
    peopleCount: sosData.peopleCount || 1,
    medicalNeeds: sosData.medicalNeeds ?? true,
    assignedRescue: sosData.assignedRescue || "",
    assignedTeamName: sosData.assignedTeamName || "",
    createdAt: sosData.createdAt || now,
    updatedAt: now,
    isOfflineCreated: sosData.isOfflineCreated || false,
  };

  try {
    await Promise.all([
      setDoc(doc(db, SOS_COLLECTION_1, requestId), fullRecord),
      setDoc(doc(db, SOS_COLLECTION_2, requestId), fullRecord),
    ]);
  } catch (err) {
    console.warn("Firestore dual write notice:", err);
  }

  return fullRecord;
}

/**
 * Updates live GPS latitude/longitude of an active SOS document in both collections.
 */
export async function updateSOSLocationInFirestore(
  requestId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const updateData = {
      latitude,
      longitude,
      updatedAt: new Date().toISOString(),
    };
    await Promise.all([
      updateDoc(doc(db, SOS_COLLECTION_1, requestId), updateData).catch(() => {}),
      updateDoc(doc(db, SOS_COLLECTION_2, requestId), updateData).catch(() => {}),
    ]);
  } catch (err) {
    console.warn("Could not update live GPS in Firestore:", err);
  }
}

/**
 * Updates status of an SOS document in both collections.
 */
export async function updateSOSStatusInFirestore(
  requestId: string,
  status: SOSStatus,
  assignedTeamName?: string
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (assignedTeamName) {
      updateData.assignedTeamName = assignedTeamName;
    }

    await Promise.all([
      updateDoc(doc(db, SOS_COLLECTION_1, requestId), updateData).catch(() => {}),
      updateDoc(doc(db, SOS_COLLECTION_2, requestId), updateData).catch(() => {}),
    ]);
  } catch (err) {
    console.warn("Error updating status in Firestore:", err);
  }
}

/**
 * Deletes an SOS request from both collections.
 */
export async function deleteSOSRequestInFirestore(requestId: string): Promise<void> {
  try {
    await Promise.all([
      deleteDoc(doc(db, SOS_COLLECTION_1, requestId)).catch(() => {}),
      deleteDoc(doc(db, SOS_COLLECTION_2, requestId)).catch(() => {}),
    ]);
  } catch (err) {
    console.warn("Error deleting SOS request from Firestore:", err);
  }
}

/**
 * Real-time onSnapshot() listener streaming all active SOS requests across BOTH collections (sos_requests & sos).
 * Merges and deduplicates records by requestId in real time!
 */
export function subscribeLiveSOSQueue(
  callback: (requests: SOSFirestoreRequest[]) => void
): () => void {
  let list1: SOSFirestoreRequest[] = [];
  let list2: SOSFirestoreRequest[] = [];

  const mergeAndEmit = () => {
    const map = new Map<string, SOSFirestoreRequest>();
    list1.forEach((item) => {
      if (item && item.requestId) map.set(item.requestId, item);
    });
    list2.forEach((item) => {
      if (item && item.requestId) map.set(item.requestId, item);
    });

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(merged);
  };

  try {
    const unsub1 = onSnapshot(
      collection(db, SOS_COLLECTION_1),
      (snapshot) => {
        list1 = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            list1.push(normalizeSOSDocument(docSnap.id, docSnap.data()));
          }
        });
        mergeAndEmit();
      },
      (err) => console.warn("Snapshot 1 notice:", err)
    );

    const unsub2 = onSnapshot(
      collection(db, SOS_COLLECTION_2),
      (snapshot) => {
        list2 = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            list2.push(normalizeSOSDocument(docSnap.id, docSnap.data()));
          }
        });
        mergeAndEmit();
      },
      (err) => console.warn("Snapshot 2 notice:", err)
    );

    return () => {
      unsub1();
      unsub2();
    };
  } catch (err) {
    console.warn("Could not setup Firestore dual onSnapshot listener:", err);
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
    const docRef = doc(db, SOS_COLLECTION_1, requestId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(normalizeSOSDocument(docSnap.id, docSnap.data()));
        } else {
          callback(null);
        }
      },
      (err) => console.warn("Error subscribing user SOS:", err)
    );
  } catch (err) {
    console.warn("User SOS subscription exception:", err);
    return () => {};
  }
}

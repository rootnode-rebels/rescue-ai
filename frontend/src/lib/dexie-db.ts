import Dexie, { Table } from 'dexie';
import { SOSRequest, Shelter, AIChatMessage } from '@/types';

export class RescueAIDatabase extends Dexie {
  sosRequests!: Table<SOSRequest, string>;
  shelters!: Table<Shelter, string>;
  chatMessages!: Table<AIChatMessage, string>;

  constructor() {
    super('RescueAI_Offline_DB');
    this.version(1).stores({
      sosRequests: 'id, userId, status, priority, isOfflineCreated, createdAt',
      shelters: 'id, name, status',
      chatMessages: 'id, sender, timestamp',
    });
  }
}

export const db = new RescueAIDatabase();

// Utility helpers for local persistence
export async function saveLocalSOS(sos: SOSRequest): Promise<string> {
  return await db.sosRequests.put(sos);
}

export async function saveOfflineSOS(sos: SOSRequest): Promise<string> {
  return await saveLocalSOS(sos);
}

export async function getPendingOfflineSOS(): Promise<SOSRequest[]> {
  return await db.sosRequests.filter(item => Boolean(item.isOfflineCreated)).toArray();
}

export async function getAllLocalSOS(): Promise<SOSRequest[]> {
  return await db.sosRequests.orderBy('createdAt').reverse().toArray();
}

export async function saveLocalShelters(shelters: Shelter[]): Promise<void> {
  await db.shelters.bulkPut(shelters);
}

export async function getLocalShelters(): Promise<Shelter[]> {
  return await db.shelters.toArray();
}

import {useEffect, useState} from "react";
import {List, ListItem} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_KEYS} from "@/constants";

interface User {
  id: string;
  email: string;
  lastSyncedAt?: string;
}

// lib/db/sync.ts
interface SyncData {
  lists: List[];
  items: Record<string, ListItem[]>;
  userId: string;
  lastSyncedAt: string;
}

export async function syncUserData(userId: string) {
  const lastSync = await AsyncStorage.getItem(`lastSync:${userId}`);
  const lastSyncTime = lastSync ? new Date(lastSync) : new Date(0);

  // Upload local changes
  const localData = await getLocalUserData(userId, lastSyncTime);
  if (localData) {
    await uploadUserData(localData);
  }

  // Get remote changes
  const remoteData = await fetchUserData(userId, lastSyncTime);
  if (remoteData) {
    await mergeUserData(remoteData);
  }

  await AsyncStorage.setItem(`lastSync:${userId}`, new Date().toISOString());
}

async function getLocalUserData(userId: string, since: Date): Promise<SyncData | null> {
  const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
  const lists = storedLists ? JSON.parse(storedLists) : [];

  const items: Record<string, ListItem[]> = {};
  for (const list of lists) {
    const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.LIST_ITEMS(list.id));
    if (storedItems) {
      items[list.id] = JSON.parse(storedItems);
    }
  }

  return {
    lists,
    items,
    userId,
    lastSyncedAt: since.toISOString()
  };
}

async function uploadUserData(data: SyncData) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to sync data');
  }
}

async function fetchUserData(userId: string, since: Date): Promise<SyncData | null> {
  const response = await fetch(`/api/sync?userId=${userId}&since=${since.toISOString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch remote data');
  }
  return response.json();
}

async function mergeUserData(remoteData: SyncData) {
  await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(remoteData.lists));

  for (const [listId, items] of Object.entries(remoteData.items)) {
    await AsyncStorage.setItem(STORAGE_KEYS.LIST_ITEMS(listId), JSON.stringify(items));
  }
}

// hooks/useUserSync.ts
export function useUserSync(userId: string) {
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = async () => {
    if (isSyncing || !userId) return;
    setIsSyncing(true);
    try {
      await syncUserData(userId);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      sync();
      const interval = setInterval(sync, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  return { isSyncing, sync };
}

/*
-- PostgreSQL Schema Updates
ALTER TABLE lists ADD COLUMN user_id TEXT NOT NULL;
ALTER TABLE list_items ADD COLUMN user_id TEXT NOT NULL;

CREATE INDEX idx_lists_user_updated
ON lists(user_id, updated_at);

CREATE INDEX idx_items_user_updated
ON list_items(user_id, updated_at);
*/

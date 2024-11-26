// hooks/useSyncedLists.ts
import { useLists } from './useLists';
import { syncWithPostgres } from '@/lib/db/sync';
import {useEffect, useState} from "react";

export function useSyncedLists() {
  const { lists, isLoading, refresh } = useLists();
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await syncWithPostgres();
      await refresh();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    sync();

    const interval = setInterval(sync, 5 * 60 * 1000); // Sync every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return {
    lists,
    isLoading: isLoading || isSyncing,
    sync
  };
}

// Postgres Schema:
/*
CREATE TABLE lists (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  device_id TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE list_items (
  id TEXT PRIMARY KEY,
  list_id TEXT REFERENCES lists(id),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  device_id TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_lists_device_updated
ON lists(device_id, updated_at);

CREATE INDEX idx_items_device_updated
ON list_items(device_id, updated_at);
*/

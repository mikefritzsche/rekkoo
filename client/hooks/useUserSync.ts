import {syncUserData} from "@/lib/db/sync";
import {useEffect, useState} from "react";

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

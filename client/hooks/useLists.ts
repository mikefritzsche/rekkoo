import {useCallback, useEffect, useState} from "react";
import {STORAGE_KEYS} from "@/constants";
import type {List} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    isLoading,
    refresh: loadLists
  };
};

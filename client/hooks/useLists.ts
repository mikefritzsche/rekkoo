import {useCallback, useEffect, useState} from "react";
import {STORAGE_KEYS} from "@/constants";
import type {List} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createDefaultItems, createDefaultLists} from "@/data";
import {Alert} from "react-native";

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeDefaultData = async () => {
    try {
      const listsWithIds = createDefaultLists();
      const defaultItemsWithIds = createDefaultItems(listsWithIds);

      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(listsWithIds));

      await Promise.all(
        Object.entries(defaultItemsWithIds).map(([listId, items]) =>
          AsyncStorage.setItem(STORAGE_KEYS.LIST_ITEMS(listId), JSON.stringify(items))
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize default data');
    }
  };


  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
      else {
        initializeDefaultData()
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

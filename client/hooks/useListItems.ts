import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from "@/constants";
import type {List, ListItem} from "@/types";

export const useListItems = (listId: string | number) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateParentListCounts = async () => {
    try {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      if (storedLists) {
        const lists: List[] = JSON.parse(storedLists);
        const updatedLists = lists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              itemCount: items.length,
              completedCount: items.filter(item => item.completed).length
            };
          }
          return list;
        });
        await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
      }
    } catch (err) {
      console.error('Error updating list counts:', err);
    }
  };

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.LIST_ITEMS(listId));
      if (storedItems) {
        const loadedItems = JSON.parse(storedItems);
        setItems(loadedItems);
      }
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  // Call updateParentListCounts whenever items change
  useEffect(() => {
    updateParentListCounts();
  }, [items]);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Save items to storage
  const saveItems = async (updatedItems: ListItem[]) => {
    try {
      await AsyncStorage.setItem(`list_${listId}`, JSON.stringify(updatedItems));
    } catch (err) {
      setError('Failed to save items');
      console.error('Error saving items:', err);
    }
  };

  // Add item
  const addItem = async (newItem: Omit<ListItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const item: ListItem = {
        ...newItem,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedItems = [...items, item];
      setItems(updatedItems);
      await saveItems(updatedItems);
    } catch (err) {
      setError('Failed to add item');
      console.error('Error adding item:', err);
    }
  };

  // Update item
  const updateItem = async (updatedItem: ListItem) => {
    try {
      const updatedItems = items.map(item =>
        item.id === updatedItem.id
          ? { ...updatedItem, updatedAt: new Date().toISOString() }
          : item
      );
      setItems(updatedItems);
      await saveItems(updatedItems);
    } catch (err) {
      setError('Failed to update item');
      console.error('Error updating item:', err);
    }
  };

  // Toggle item completion
  const toggleItem = async (itemId: string | number) => {
    try {
      const updatedItems = items.map(item =>
        item.id === itemId
          ? {
            ...item,
            completed: !item.completed,
            updatedAt: new Date().toISOString(),
          }
          : item
      );
      setItems(updatedItems);
      await saveItems(updatedItems);
    } catch (err) {
      setError('Failed to toggle item');
      console.error('Error toggling item:', err);
    }
  };

  // Delete item
  const deleteItem = async (itemId: string | number) => {
    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      await saveItems(updatedItems);
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    clearError,
    refresh: loadItems,
  };
};

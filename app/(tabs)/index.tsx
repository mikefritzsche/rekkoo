// app/(tabs)/index.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedHeader from '@/components/ThemedHeader';
import ThemedButton from '@/components/ThemedButton';
import ThemedCard from '@/components/ThemedCard';
import { theme } from '@/app/theme';
import { STORAGE_KEYS } from '@/constants';
import {List} from "@/types";
import { createDefaultLists, createDefaultItems } from '@/data';


export default function HomeScreen() {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize default data
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

      setLists(listsWithIds);
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
      } else {
        await initializeDefaultData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load lists');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const gradientKeys = Object.keys(theme.colors.gradients) as Array<keyof typeof theme.colors.gradients>;

  // Uncomment this useEffect to populate with default lists
  useEffect(() => {
    if (lists.length === 0 && !isLoading) {
      setLists(defaultLists);
      AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(defaultLists));
    }
  }, [isLoading]);

  const handleCreateList = () => {
    router.push('/create');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <ThemedHeader
          title="My Lists"
          subtitle={`${lists.length} lists`}
        />

        <View style={styles.grid}>
          {lists.map((list, index) => (
            <ThemedCard
              key={list.id}
              style={styles.card}
              gradient={theme.colors.gradients[list.color]}
              onPress={() => router.push(`/list/${list.id}`)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Feather name="list" size={24} color="white" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{list.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {list.completedCount}/{list.itemCount} completed
                  </Text>
                </View>
              </View>
            </ThemedCard>
          ))}
        </View>
      </ScrollView>

      <ThemedButton
        title="Create New List"
        icon={({ size, color }) => <Feather name="plus" size={size} color={color} />}
        style={styles.createButton}
        onPress={handleCreateList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  grid: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  card: {
    width: '47%', // Approximate half width accounting for gap
    minHeight: 150,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardBody: {
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    color: theme.colors.text.muted,
    fontSize: 14,
  },
  createButton: {
    margin: theme.spacing.md,
  },
});

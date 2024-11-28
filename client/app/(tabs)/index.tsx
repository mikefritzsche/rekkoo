import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ThemedHeader from '@/components/ThemedHeader';
import ThemedButton from '@/components/ThemedButton';
import ThemedCard from '@/components/ThemedCard';
import { theme } from '@/app/theme';
import {useLists} from "@/hooks/useLists";
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const { lists, isLoading, refresh } = useLists();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

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

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {theme} from '@/app/theme';
import ListItem from './ListItem';
import EmptyState from './EmptyState';
import type {ThemedListProps} from '@/types';

export default function ThemedList(
  {
    listId, // Add listId prop
    items,
    onItemPress,
    onItemLongPress,
    onItemToggle,
    emptyStateMessage,
    showDividers = true,
    isLoading = false,
    gradient,
  }: ThemedListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary}/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          items.length === 0 && styles.emptyScrollContent,
        ]}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              listId={listId} // Pass listId to ListItem
              onPress={onItemPress}
              onLongPress={onItemLongPress}
              onToggle={onItemToggle}
              showDivider={showDividers && index !== items.length - 1}
            />
          ))
        ) : (
          <EmptyState message={emptyStateMessage}/>
        )}
      </ScrollView>
    </View>
  );
}

// Extracted to avoid duplication
function ListContent(
  {
    items,
    onItemPress,
    onItemLongPress,
    onItemToggle,
    emptyStateMessage,
    showDividers,
  }: Omit<ThemedListProps, 'isLoading' | 'gradient'>) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        items.length === 0 && styles.emptyScrollContent,
      ]}
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <ListItem
            key={item.id}
            item={item}
            onPress={onItemPress}
            onLongPress={onItemLongPress}
            onToggle={onItemToggle}
            showDivider={showDividers && index !== items.length - 1}
          />
        ))
      ) : (
        <EmptyState message={emptyStateMessage}/>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyScrollContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

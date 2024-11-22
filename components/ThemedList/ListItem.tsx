
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {theme} from '@/app/theme';
import type {ListItem as ListItemType} from '@/types';
import {router} from "expo-router";

type ListItemProps = {
  item: ListItemType;
  onPress?: (item: ListItemType) => void;
  onLongPress?: (item: ListItemType) => void;
  onToggle?: (item: ListItemType) => void;
  showDivider?: boolean;
};

const ListItem: React.FC<ListItemProps> = (
  {
    item,
    onPress,
    onLongPress,
    onToggle,
    showDivider,
  }
) => {
  const priorityColors = {
    low: theme.colors.status.success,
    medium: theme.colors.status.warning,
    high: theme.colors.status.error,
  };

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/list/${listId}/item/${item.id}`);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={handlePress}
        onLongPress={() => onLongPress?.(item)}
        activeOpacity={0.7}
      >
        {onToggle && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => onToggle(item)}
          >
            {item.completed ? (
              <Feather name="check-circle" size={24} color={theme.colors.accent.primary}/>
            ) : (
              <Feather name="circle" size={24} color={theme.colors.text.secondary}/>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                item.completed && styles.completedTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.priority && (
              <View
                style={[
                  styles.priorityIndicator,
                  {backgroundColor: priorityColors[item.priority]},
                ]}
              />
            )}
          </View>

          {item.description && (
            <Text
              style={[
                styles.description,
                item.completed && styles.completedDescription,
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {(item.createdAt || item.updatedAt) && (
            <Text style={styles.timestamp}>
              {item.updatedAt
                ? `Updated ${item.updatedAt}`
                : `Created ${item.createdAt}`}
            </Text>
          )}
        </View>

        <Feather
          name="chevron-right"
          size={20}
          color={theme.colors.text.secondary}
          style={styles.chevron}
        />
      </TouchableOpacity>
      {showDivider && <View style={styles.divider}/>}
    </>
  );
};

export default ListItem

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  checkbox: {
    marginRight: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
  completedTitle: {
    color: theme.colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  completedDescription: {
    color: theme.colors.text.secondary,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  chevron: {
    marginLeft: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.lg + 24, // checkbox width + padding
  },
});

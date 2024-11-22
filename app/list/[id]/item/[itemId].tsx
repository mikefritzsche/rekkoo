// app/list/[id]/item/[itemId].tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ThemedHeader from '@/components/ThemedHeader';
import ThemedButton from '@/components/ThemedButton';
import { theme } from '@/app/theme';
import { useListItems } from '@/hooks/useListItems';

export default function ItemDetailScreen() {
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  const { items, updateItem } = useListItems(id);
  const item = items.find(i => i.id === itemId);

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [priority, setPriority] = useState(item?.priority || 'medium');

  if (!item) {
    return <ThemedHeader title="Item not found" />;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    await updateItem({
      ...item,
      title,
      description,
      priority,
      updatedAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <ThemedHeader
        title="Edit Item"
        subtitle={`Last updated: ${new Date(item.updatedAt).toLocaleString()}`}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={theme.colors.input.placeholder}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={theme.colors.input.placeholder}
          multiline
          numberOfLines={3}
        />

        <View style={styles.priorityButtons}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <ThemedButton
              key={p}
              title={p.charAt(0).toUpperCase() + p.slice(1)}
              style={[
                styles.priorityButton,
                priority === p && styles.selectedPriority,
              ]}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <ThemedButton
            title="Cancel"
            style={styles.button}
            onPress={() => router.back()}
          />
          <ThemedButton
            title="Save"
            style={styles.button}
            gradient={theme.colors.gradients.blue}
            onPress={handleSave}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    padding: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.input.background,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  selectedPriority: {
    opacity: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});

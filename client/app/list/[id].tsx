import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput, TouchableOpacity,
} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Feather} from '@expo/vector-icons';
import ThemedList from '@/components/ThemedList';
import ThemedHeader from '@/components/ThemedHeader';
import ThemedButton from '@/components/ThemedButton';
import {useListItems} from '@/hooks/useListItems';
import {theme} from '@/app/theme';
import {List, ListItem} from '@/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_KEYS} from "@/constants";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = (
  {
    visible,
    onClose,
    onSubmit,
  }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    onSubmit(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ThemedHeader title="Add New Item"/>
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
          placeholder="Description (optional)"
          placeholderTextColor={theme.colors.input.placeholder}
          multiline
          numberOfLines={3}
        />
        <View style={styles.modalButtons}>
          <ThemedButton
            title="Cancel"
            onPress={onClose}
            style={styles.modalButton}
          />
          <ThemedButton
            title="Add"
            onPress={handleSubmit}
            style={styles.modalButton}
            gradient={theme.colors.gradients.emerald}
          />
        </View>
      </View>
    </View>
  );
};

export default function ListDetailScreen() {
  const params = useLocalSearchParams();
  const listId = typeof params.id === 'string' ? params.id : '';
  const [list, setList] = useState<List | null>(null);

  const {id} = useLocalSearchParams<{ id: string }>();
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    items,
    isLoading,
    error,
    addItem,
    toggleItem,
    deleteItem,
    clearError,
  } = useListItems(id);

  // Load list details
  useEffect(() => {
    const loadList = async () => {
      try {
        const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
        if (storedLists) {
          const lists = JSON.parse(storedLists);
          const currentList = lists.find((l: List) => l.id === listId);
          if (currentList) {
            setList(currentList);
            // Check if we're in a web environment before accessing document
            if (typeof document !== 'undefined') {
              document.title = `${currentList.title} - Themed Lists`;
            }
          }
        }
      } catch (error) {
        console.error('Error loading list details:', error);
      }
    };
    loadList();
  }, [listId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{text: 'OK', onPress: clearError}]);
    }
  }, [error, clearError]);

  const handleBack = () => {
    router.back();
  };

  const handleAddItem = (title: string, description?: string) => {
    addItem({
      title,
      description,
      completed: false,
      priority: 'medium',
      tags: [],
    });
  };

  const handleDeleteItem = (item: ListItem) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteItem(item.id)
        },
      ]
    );
  };

  if (!listId) {
    return <ThemedHeader title="Invalid List ID"/>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.text.primary}/>
        </TouchableOpacity>
        <ThemedHeader
          title={list?.title || 'Loading...'}
          subtitle={`${items.length} items · ${items.filter(i => i.completed).length} completed`}
        />
      </View>

      <ThemedButton
        title="Add Item"
        icon={({size, color}) => <Feather name="plus" size={size} color={color}/>}
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      />

      <ThemedList
        listId={listId}
        items={items}
        isLoading={isLoading}
        onItemPress={(item) => router.push(`/list/${listId}/item/${item.id}`)}
        onItemLongPress={handleDeleteItem}
        onItemToggle={(item) => toggleItem(item.id)}
        showDividers
        gradient={theme.colors.gradients.blue}
        emptyStateMessage="Add your first item to this list!"
      />

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItem}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...Platform.select({
      ios: {
        paddingTop: 30
      }
    })
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  addButton: {
    margin: theme.spacing.md,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});

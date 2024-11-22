import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {theme} from '@/app/theme';

type EmptyStateProps = {
  message?: string;
};

const EmptyState: React.FC<EmptyStateProps> = (
  {
    message = 'No items yet',
  }
) => (
  <View style={styles.container}>
    <Feather
      name="inbox"
      size={48}
      color={theme.colors.text.secondary}
      style={styles.icon}
    />
    <Text style={styles.message}>{message}</Text>
  </View>
);

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

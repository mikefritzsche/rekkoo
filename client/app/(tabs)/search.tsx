import { Text, View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ThemedHeader from '@/components/ThemedHeader';
import ThemedCard from '@/components/ThemedCard';
import { theme } from '@/app/theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <ThemedHeader title="Search" subtitle="Find your lists" />

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={theme.colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lists..."
          placeholderTextColor={theme.colors.text.secondary}
          selectionColor={theme.colors.accent.primary}
        />
      </View>

      <ScrollView style={styles.recentSearches}>
        <ThemedCard
          gradient={theme.colors.gradients.purple}
          onPress={() => {}}
        >
          <Text style={styles.cardTitle}>Recent Searches</Text>
        </ThemedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.input.background,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  recentSearches: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '500',
  },
});

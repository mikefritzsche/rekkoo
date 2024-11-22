import React from 'react';
import {View, Text, StyleSheet, ViewProps} from 'react-native';
import {theme} from '@/app/theme';

interface ThemedHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
}

export default function ThemedHeader(
  {
    title,
    subtitle,
    style,
    ...props
  }: ThemedHeaderProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});

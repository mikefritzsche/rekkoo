import React from 'react';
import {TouchableOpacity, Text, StyleSheet, TouchableOpacityProps} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {theme} from '@/app/theme';

interface ThemedButtonProps extends TouchableOpacityProps {
  title?: string;
  gradient?: string[];
  icon?: React.FC<{ size: number; color: string; style?: any }>;
}

export default function ThemedButton(
  {
    title,
    onPress,
    gradient,
    icon: Icon,
    style,
    ...props
  }: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...props}
    >
      <LinearGradient
        colors={gradient || [theme.colors.accent.primary, theme.colors.accent.secondary]}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        {Icon && <Icon size={24} color={theme.colors.text.primary} style={styles.icon}/>}
        {title && <Text style={styles.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});

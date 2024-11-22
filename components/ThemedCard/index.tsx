import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {theme} from '@/app/theme';

interface ThemedCardProps extends TouchableOpacityProps {
  gradient: string[];
  children: React.ReactNode;
}

export default function ThemedCard(
  {
    children,
    gradient,
    style,
    onPress,
    ...props
  }: ThemedCardProps) {
  return (
    <TouchableOpacity
      style={[styles.cardContainer, style]}
      activeOpacity={0.9}
      onPress={onPress}
      {...props}
    >
      <LinearGradient
        colors={gradient}
        style={styles.cardGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: theme.spacing.lg,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const EmptyState = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    paddingHorizontal: 32,
    fontSize: 14,
  },
});

export default EmptyState;

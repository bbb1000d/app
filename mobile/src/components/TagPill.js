import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import colors from '../theme/colors';

const TagPill = ({ label }) => (
  <View style={styles.pill}>
    <Text style={styles.text}>#{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TagPill;

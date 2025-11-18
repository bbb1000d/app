import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import CaptureForm from '../components/CaptureForm';
import colors from '../theme/colors';

const CaptureScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Quick capture</Text>
      <Text style={styles.subtitle}>
        Save study notes instantly. Paste text or upload screenshots and keep them searchable on every device.
      </Text>
      <CaptureForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginHorizontal: 24,
    marginTop: 24,
    color: colors.text,
  },
  subtitle: {
    marginHorizontal: 24,
    marginTop: 6,
    marginBottom: 6,
    color: colors.textMuted,
  },
});

export default CaptureScreen;

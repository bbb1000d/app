import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import colors from '../theme/colors';
import { getBackendUrl, setBackendUrl } from '../api/client';

const SettingsScreen = () => {
  const [backendUrl, setBackendUrlInput] = useState(getBackendUrl());

  const handleSave = () => {
    if (!backendUrl.trim()) {
      Alert.alert('Invalid URL', 'Please provide a valid backend URL');
      return;
    }
    setBackendUrl(backendUrl.trim());
    Alert.alert('Updated', 'Backend URL saved for this session.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.section}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Point the mobile client at any running Study Capture backend.</Text>
      </View>
      <View style={[styles.section, styles.card]}>
        <Text style={styles.label}>Backend URL</Text>
        <TextInput
          style={styles.input}
          value={backendUrl}
          onChangeText={setBackendUrlInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>
        <Text style={styles.helper}>
          Tip: run `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000` locally and ensure your phone shares the same
          network.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    padding: 24,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  helper: {
    marginTop: 12,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default SettingsScreen;

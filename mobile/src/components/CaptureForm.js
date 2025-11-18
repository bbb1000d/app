import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import dayjs from 'dayjs';
import colors from '../theme/colors';
import { createTextCapture, uploadScreenshot } from '../api/client';

const CaptureForm = ({ onSuccess }) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [mode, setMode] = useState('text');
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const clearForm = () => {
    setText('');
    setSource('');
    setTags('');
    setScreenshot(null);
  };

  const handlePickScreenshot = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'] });
    if (!result.canceled && result.assets?.length) {
      setScreenshot(result.assets[0]);
      setMode('image');
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      if (mode === 'text') {
        if (!text.trim()) {
          Alert.alert('Missing text', 'Add some context before saving.');
          return;
        }
        await createTextCapture({
          text: text.trim(),
          source: source || undefined,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          captured_at: dayjs().toISOString(),
        });
      } else {
        await uploadScreenshot(screenshot, {
          source: source || undefined,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          captured_at: dayjs().toISOString(),
        });
      }
      clearForm();
      onSuccess?.();
    } catch (err) {
      Alert.alert('Save failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'text' && styles.modeButtonActive]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.modeLabel, mode === 'text' && styles.modeLabelActive]}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'image' && styles.modeButtonActive]}
          onPress={() => setMode('image')}
        >
          <Text style={[styles.modeLabel, mode === 'image' && styles.modeLabelActive]}>Screenshot</Text>
        </TouchableOpacity>
      </View>

      {mode === 'text' ? (
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Paste or type your notes"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
        />
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickScreenshot}>
          <Text style={styles.uploadHint}>
            {screenshot ? screenshot.name : 'Tap to choose a screenshot (PNG/JPG)'}
          </Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Source app or context (e.g. Notion, PDF)"
        placeholderTextColor={colors.textMuted}
        value={source}
        onChangeText={setSource}
      />

      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        placeholderTextColor={colors.textMuted}
        value={tags}
        onChangeText={setTags}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.primaryButtonText}>{submitting ? 'Saving…' : 'Save capture'}</Text>
      </TouchableOpacity>

      {mode === 'image' ? (
        <TouchableOpacity style={styles.secondaryButton} onPress={handlePickScreenshot}>
          <Text style={styles.secondaryButtonText}>Pick a different screenshot</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
  },
  modeButtonActive: {
    backgroundColor: colors.surface,
  },
  modeLabel: {
    textAlign: 'center',
    fontWeight: '600',
    color: colors.textMuted,
  },
  modeLabelActive: {
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    color: colors.text,
  },
  multiline: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadHint: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CaptureForm;

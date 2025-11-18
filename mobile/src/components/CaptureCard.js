import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import colors from '../theme/colors';
import TagPill from './TagPill';

const trimText = (text, limit = 220) =>
  text.length > limit ? `${text.slice(0, limit)}…` : text;

const CaptureCard = ({ capture }) => {
  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{dayjs(capture.created_at).format('MMM D, HH:mm')}</Text>
        {capture.source ? <Text style={styles.source}>{capture.source}</Text> : null}
      </View>
      <Text style={styles.body}>{trimText(capture.raw_text)}</Text>
      <View style={styles.tagsRow}>
        {capture.tags?.length ? (
          capture.tags.map((tag) => <TagPill label={tag} key={`${capture.id}-${tag}`} />)
        ) : (
          <Text style={styles.emptyTags}>No tags</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  source: {
    color: colors.primary,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyTags: {
    color: colors.textMuted,
    fontSize: 13,
  },
});

export default CaptureCard;

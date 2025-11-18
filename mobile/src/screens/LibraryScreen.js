import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import colors from '../theme/colors';
import CaptureCard from '../components/CaptureCard';
import EmptyState from '../components/EmptyState';
import useCaptures from '../hooks/useCaptures';

const LibraryScreen = () => {
  const { captures, loading, error, refresh, runSearch } = useCaptures();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');

  const handleSearch = () => {
    runSearch(query, tag || undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Browse every capture and refine with tags or keywords.</Text>
      </View>
      <View style={styles.filters}>
        <TextInput
          style={[styles.input, styles.flexGrow]}
          placeholder="Keyword"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TextInput
          style={styles.input}
          placeholder="Tag"
          placeholderTextColor={colors.textMuted}
          value={tag}
          onChangeText={setTag}
          onSubmitEditing={handleSearch}
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={captures}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
          renderItem={({ item }) => <CaptureCard capture={item} />}
          ListEmptyComponent={() => (
            <EmptyState
              title="Nothing yet"
              subtitle={error || 'Use the Capture tab to add notes or drop screenshots.'}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  flexGrow: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LibraryScreen;

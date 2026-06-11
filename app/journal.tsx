import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';
import { useTheme } from '../src/theme/ThemeContext';
import { useStorage, STORAGE_KEYS } from '../src/hooks/useStorage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  date: string;
  week?: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

const MOOD_EMOJIS = ['🥰', '😊', '😴', '🤢', '😰', '💪', '😢', '🤩', '🥺', '😤'];
const TAGS = ['Symptômes', 'Bébé bouge', 'Rêve', 'Émotion', 'Rendez-vous', 'Milestone', 'Conseil', 'Envie'];

export default function JournalScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [entries, setEntries] = useStorage<JournalEntry[]>(STORAGE_KEYS.NOTES, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('🥰');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [week, setWeek] = useState('');

  const saveEntry = () => {
    if (!title || !content) {
      Alert.alert('Erreur', 'Titre et contenu sont requis.');
      return;
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      week: week ? parseInt(week) : undefined,
      title,
      content,
      mood,
      tags: selectedTags,
    };
    setEntries([newEntry, ...entries]);
    setModalVisible(false);
    setTitle(''); setContent(''); setMood('🥰'); setSelectedTags([]); setWeek('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const deleteEntry = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette entrée ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => {
        setEntries(entries.filter(e => e.id !== id));
        setViewEntry(null);
      }},
    ]);
  };

  const journalPrompts = [
    'Comment vous sentez-vous aujourd\'hui ?',
    'Qu\'est-ce que vous avez ressenti quand bébé a bougé ?',
    'Quel message voulez-vous laisser à votre bébé ?',
    'Quelle est votre plus grande peur ? Et votre plus grande joie ?',
    'Décrivez le moment où vous avez vu votre bébé pour la première fois à l\'échographie.',
    'Qu\'est-ce qui vous manquera de la grossesse ?',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      <LinearGradient
        colors={['#2D1B69', '#6D28D9']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal de Grossesse ✏️</Text>
        <Text style={styles.headerSubtitle}>Vos souvenirs les plus précieux</Text>
        <Text style={styles.headerCount}>{entries.length} entrée{entries.length > 1 ? 's' : ''}</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        <View style={styles.content}>

          {/* Add Button */}
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.addBtnGrad}>
              <Ionicons name="pencil" size={20} color={Colors.white} />
              <Text style={styles.addBtnText}>Nouvelle entrée</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Prompts */}
          <Text style={[styles.sectionTitle, { color: th.text }]}>💭 Besoin d'inspiration ?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll}>
            {journalPrompts.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.promptCard, { backgroundColor: th.card, borderColor: th.border }]}
                onPress={() => {
                  setTitle(prompt.substring(0, 40));
                  setContent('');
                  setModalVisible(true);
                }}
              >
                <Text style={[styles.promptText, { color: th.text }]}>{prompt}</Text>
                <Text style={styles.promptCta}>Écrire →</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Entries */}
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={[styles.emptyTitle, { color: th.text }]}>Votre journal vous attend</Text>
              <Text style={[styles.emptyText, { color: th.textSub }]}>Écrivez vos pensées, vos émotions, vos espoirs. Ces pages deviendront un trésor pour vous et votre enfant.</Text>
            </View>
          ) : (
            entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={[styles.entryCard, { backgroundColor: th.card, borderColor: th.border }]}
                onPress={() => setViewEntry(entry)}
              >
                <View style={styles.entryHeader}>
                  <Text style={styles.entryMood}>{entry.mood}</Text>
                  <View style={styles.entryMeta}>
                    <Text style={[styles.entryTitle, { color: th.text }]}>{entry.title}</Text>
                    <Text style={[styles.entryDate, { color: th.textMuted }]}>
                      {format(new Date(entry.date), 'dd MMMM yyyy', { locale: fr })}
                      {entry.week ? ` • Semaine ${entry.week}` : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                </View>
                <Text style={[styles.entryPreview, { color: th.textSub }]} numberOfLines={2}>{entry.content}</Text>
                {entry.tags.length > 0 && (
                  <View style={styles.entryTags}>
                    {entry.tags.map(tag => (
                      <View key={tag} style={styles.entryTag}>
                        <Text style={styles.entryTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* New Entry Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: th.border }]}>
            <TouchableOpacity onPress={() => { setModalVisible(false); setTitle(''); setContent(''); }}>
              <Text style={[styles.cancelText, { color: th.textSub }]}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nouvelle Entrée</Text>
            <TouchableOpacity onPress={saveEntry}>
              <Text style={styles.saveText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: th.textSub }]}>Mon humeur</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodRow}>
              {MOOD_EMOJIS.map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.moodBtn, mood === emoji && styles.moodBtnSelected]}
                  onPress={() => setMood(emoji)}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Titre *</Text>
            <TextInput style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]} placeholderTextColor={th.textMuted} value={title} onChangeText={setTitle} placeholder="Titre de votre entrée" />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Semaine de grossesse (optionnel)</Text>
            <TextInput style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]} placeholderTextColor={th.textMuted} value={week} onChangeText={setWeek} placeholder="Ex: 24" keyboardType="number-pad" />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Mon texte *</Text>
            <TextInput
              style={[styles.input, styles.contentInput, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
              placeholderTextColor={th.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              placeholder="Écrivez librement vos pensées, émotions, anecdotes..."
              textAlignVertical="top"
            />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Tags</Text>
            <View style={styles.tagsGrid}>
              {TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagOption, selectedTags.includes(tag) && styles.tagOptionSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagOptionText, selectedTags.includes(tag) && { color: Colors.white }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* View Entry Modal */}
      {viewEntry && (
        <Modal visible={!!viewEntry} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: th.border }]}>
              <TouchableOpacity onPress={() => setViewEntry(null)}>
                <Ionicons name="close" size={26} color={Colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: th.text }]} numberOfLines={1}>{viewEntry.title}</Text>
              <TouchableOpacity onPress={() => deleteEntry(viewEntry.id)}>
                <Ionicons name="trash" size={22} color={Colors.error} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.viewMeta}>
                <Text style={styles.viewMood}>{viewEntry.mood}</Text>
                <View>
                  <Text style={[styles.viewDate, { color: th.text }]}>{format(new Date(viewEntry.date), 'dd MMMM yyyy', { locale: fr })}</Text>
                  {viewEntry.week && <Text style={[styles.viewWeek, { color: th.textMuted }]}>Semaine {viewEntry.week}</Text>}
                </View>
              </View>
              {viewEntry.tags.length > 0 && (
                <View style={styles.entryTags}>
                  {viewEntry.tags.map(tag => (
                    <View key={tag} style={[styles.entryTag, { backgroundColor: Colors.lilac }]}>
                      <Text style={[styles.entryTagText, { color: Colors.primaryDark }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={[styles.viewContent, { color: th.text }]}>{viewEntry.content}</Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, padding: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 10 },
  headerCount: { fontSize: 13, fontWeight: '700', color: Colors.white, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 12 },
  content: { padding: 16 },
  addBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 20, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  promptsScroll: { marginBottom: 20 },
  promptCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginRight: 10, width: 200, borderWidth: 1, borderColor: Colors.border },
  promptText: { fontSize: 14, color: Colors.text, lineHeight: 21, marginBottom: 10 },
  promptCta: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  entryCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  entryHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  entryMood: { fontSize: 28 },
  entryMeta: { flex: 1 },
  entryTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  entryDate: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  entryPreview: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  entryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  entryTag: { backgroundColor: Colors.lilac, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  entryTagText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cancelText: { fontSize: 16, color: Colors.textSecondary },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'center' },
  saveText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  moodRow: { marginBottom: 4 },
  moodBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.surface },
  moodBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.lilac },
  moodEmoji: { fontSize: 24 },
  input: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  contentInput: { height: 180, textAlignVertical: 'top' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  tagOptionSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagOptionText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  viewMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  viewMood: { fontSize: 40 },
  viewDate: { fontSize: 14, fontWeight: '600', color: Colors.text },
  viewWeek: { fontSize: 12, color: Colors.textLight },
  viewContent: { fontSize: 16, color: Colors.text, lineHeight: 26, marginTop: 12 },
});

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../src/theme/colors';
import { useTheme } from '../src/theme/ThemeContext';
import { useStorage, STORAGE_KEYS } from '../src/hooks/useStorage';

const { width } = Dimensions.get('window');

interface Ultrasound {
  id: string;
  uri: string;
  date: string;
  week?: string;
  title: string;
  note?: string;
  type: '2D' | '3D' | '4D' | 'Doppler';
}

export default function UltrasoundScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [ultrasounds, setUltrasounds] = useStorage<Ultrasound[]>(STORAGE_KEYS.ULTRASOUNDS, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newWeek, setNewWeek] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState<Ultrasound['type']>('2D');
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [selectedUltrasound, setSelectedUltrasound] = useState<Ultrasound | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à vos photos pour ajouter des échographies.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPendingUri(result.assets[0].uri);
      setNewTitle(`Échographie`);
      setNewDate(new Date().toLocaleDateString('fr-FR'));
      setModalVisible(true);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPendingUri(result.assets[0].uri);
      setNewTitle('Échographie');
      setNewDate(new Date().toLocaleDateString('fr-FR'));
      setModalVisible(true);
    }
  };

  const saveUltrasound = () => {
    if (!pendingUri || !newTitle) return;

    const newUltrasound: Ultrasound = {
      id: Date.now().toString(),
      uri: pendingUri,
      date: newDate || new Date().toLocaleDateString('fr-FR'),
      week: newWeek || undefined,
      title: newTitle,
      note: newNote || undefined,
      type: newType,
    };

    setUltrasounds([...ultrasounds, newUltrasound]);
    setModalVisible(false);
    setPendingUri(null);
    setNewTitle('');
    setNewWeek('');
    setNewDate('');
    setNewNote('');
  };

  const deleteUltrasound = (id: string) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous supprimer cette échographie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {
          setUltrasounds(ultrasounds.filter(u => u.id !== id));
          setViewModalVisible(false);
        }},
      ]
    );
  };

  const echoTypes = [
    { label: 'T1 (11-13 SA)', title: 'Clarté nucale', week: '11-13' },
    { label: 'T2 (20-22 SA)', title: 'Morphologique', week: '20-22' },
    { label: 'T3 (32-34 SA)', title: 'Croissance', week: '32-34' },
    { label: 'Suivi', title: 'Suivi de croissance', week: '' },
    { label: '3D/4D', title: 'Échographie 3D/4D', week: '' },
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
        <Text style={styles.headerTitle}>Mes Échographies 🖼️</Text>
        <Text style={styles.headerSubtitle}>Précieux souvenirs de votre bébé</Text>
        <Text style={styles.headerCount}>{ultrasounds.length} photo{ultrasounds.length > 1 ? 's' : ''}</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        <View style={styles.content}>

          {/* Add Buttons */}
          <View style={styles.addRow}>
            <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
              <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.addBtnGrad}>
                <Ionicons name="images" size={22} color={Colors.white} />
                <Text style={styles.addBtnText}>Galerie</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={takePhoto}>
              <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.addBtnGrad}>
                <Ionicons name="camera" size={22} color={Colors.white} />
                <Text style={styles.addBtnText}>Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Types Guide */}
          <Text style={[styles.sectionTitle, { color: th.text }]}>📋 Types d'échographies</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
            {echoTypes.map((type, idx) => (
              <View key={idx} style={[styles.typeCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <Text style={styles.typeLabel}>{type.label}</Text>
                <Text style={[styles.typeTitle, { color: th.text }]}>{type.title}</Text>
                {type.week && <Text style={[styles.typeWeek, { color: th.textMuted }]}>Semaine {type.week}</Text>}
              </View>
            ))}
          </ScrollView>

          {/* Grid */}
          {ultrasounds.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🖼️</Text>
              <Text style={[styles.emptyTitle, { color: th.text }]}>Aucune échographie</Text>
              <Text style={[styles.emptyText, { color: th.textSub }]}>
                Ajoutez vos premières photos de bébé !{'\n'}
                Ces moments sont des souvenirs précieux.
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={pickImage}>
                <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.emptyBtnGrad}>
                  <Text style={styles.emptyBtnText}>Ajouter la première échographie</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: th.text }]}>🌸 Mes photos</Text>
              <View style={styles.grid}>
                {ultrasounds.map((echo) => (
                  <TouchableOpacity
                    key={echo.id}
                    style={styles.gridItem}
                    onPress={() => { setSelectedUltrasound(echo); setViewModalVisible(true); }}
                  >
                    <Image source={{ uri: echo.uri }} style={styles.gridImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.gridOverlay}
                    >
                      <Text style={styles.gridTitle} numberOfLines={1}>{echo.title}</Text>
                      <Text style={styles.gridDate}>{echo.date}</Text>
                      {echo.week && <Text style={styles.gridWeek}>S{echo.week}</Text>}
                    </LinearGradient>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{echo.type}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: th.border }]}>
            <Text style={[styles.modalTitle, { color: th.text }]}>Ajouter une échographie</Text>
            <TouchableOpacity onPress={() => { setModalVisible(false); setPendingUri(null); }}>
              <Ionicons name="close" size={26} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {pendingUri && (
              <Image source={{ uri: pendingUri }} style={styles.previewImage} resizeMode="contain" />
            )}

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Titre *</Text>
            <TextInput style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]} placeholderTextColor={th.textMuted} value={newTitle} onChangeText={setNewTitle} placeholder="Ex: Première échographie" />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Semaine de grossesse</Text>
            <TextInput style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]} placeholderTextColor={th.textMuted} value={newWeek} onChangeText={setNewWeek} placeholder="Ex: 12" keyboardType="number-pad" />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Date</Text>
            <TextInput style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]} placeholderTextColor={th.textMuted} value={newDate} onChangeText={setNewDate} placeholder="Ex: 15/03/2024" />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Type</Text>
            <View style={styles.typeSelector}>
              {(['2D', '3D', '4D', 'Doppler'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeOption, { backgroundColor: th.inputBg, borderColor: th.border }, newType === t && styles.typeOptionSelected]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[styles.typeOptionText, { color: th.textSub }, newType === t && { color: Colors.white }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Note (optionnel)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
              placeholderTextColor={th.textMuted}
              multiline
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Ce que vous ressentez, notes du médecin..."
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveUltrasound}>
              <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.saveBtnGrad}>
                <Text style={styles.saveBtnText}>Sauvegarder 🌸</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* View Modal */}
      <Modal visible={viewModalVisible} animationType="fade">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: '#000' }]}>
          <View style={styles.viewHeader}>
            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
              <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.viewHeaderTitle} numberOfLines={1}>{selectedUltrasound?.title}</Text>
            <TouchableOpacity onPress={() => selectedUltrasound && deleteUltrasound(selectedUltrasound.id)}>
              <Ionicons name="trash" size={24} color={Colors.error} />
            </TouchableOpacity>
          </View>

          {selectedUltrasound && (
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: selectedUltrasound.uri }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.viewInfo}>
                <Text style={styles.viewTitle}>{selectedUltrasound.title}</Text>
                <Text style={styles.viewDate}>{selectedUltrasound.date}</Text>
                {selectedUltrasound.week && <Text style={styles.viewWeek}>Semaine {selectedUltrasound.week}</Text>}
                {selectedUltrasound.note && <Text style={styles.viewNote}>{selectedUltrasound.note}</Text>}
              </LinearGradient>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, padding: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  headerCount: { fontSize: 14, fontWeight: '700', color: Colors.white, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 12 },
  content: { padding: 16 },
  addRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  addBtn: { flex: 1, borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  typesScroll: { marginBottom: 20 },
  typeCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginRight: 10, width: 130, borderWidth: 1, borderColor: Colors.border },
  typeLabel: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginBottom: 4 },
  typeTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  typeWeek: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  emptyBtn: { borderRadius: 16, overflow: 'hidden' },
  emptyBtnGrad: { paddingHorizontal: 24, paddingVertical: 14 },
  emptyBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: (width - 44) / 2, aspectRatio: 1, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  gridTitle: { fontSize: 13, fontWeight: '700', color: Colors.white },
  gridDate: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  gridWeek: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  typeBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalBody: { padding: 20 },
  previewImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16, backgroundColor: '#000' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  typeSelector: { flexDirection: 'row', gap: 10 },
  typeOption: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.surface },
  typeOptionSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeOptionText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  saveBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 24, marginBottom: 40 },
  saveBtnGrad: { padding: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  viewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  viewHeaderTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.white, marginHorizontal: 12 },
  viewInfo: { padding: 20, paddingTop: 40 },
  viewTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  viewDate: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  viewWeek: { fontSize: 14, color: Colors.primaryLight, marginBottom: 4 },
  viewNote: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 4 },
});

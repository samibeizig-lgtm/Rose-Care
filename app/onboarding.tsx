import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, KeyboardAvoidingView, Platform, ScrollView,
  Modal, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { storage, STORAGE_KEYS } from '../src/hooks/useStorage';

const { width } = Dimensions.get('window');

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const YEARS = Array.from({ length: 60 }, (_, i) => String(2006 - i));

const ITEM_H = 48;

function WheelColumn({ items, selectedIndex, onSelect, width: colWidth }: {
  items: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  width: number;
}) {
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    ref.current?.scrollToIndex({ index: selectedIndex, animated: false, viewOffset: 0 });
  }, []);

  return (
    <View style={{ width: colWidth, height: ITEM_H * 5, overflow: 'hidden' }}>
      {/* Selection highlight */}
      <View style={[colStyles.highlight, { top: ITEM_H * 2 }]} pointerEvents="none" />
      <FlatList
        ref={ref}
        data={items}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({ length: ITEM_H, offset: ITEM_H * index, index })}
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          onSelect(Math.max(0, Math.min(idx, items.length - 1)));
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              ref.current?.scrollToIndex({ index, animated: true });
              onSelect(index);
            }}
            style={colStyles.item}
          >
            <Text style={[colStyles.itemText, index === selectedIndex && colStyles.itemActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const colStyles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: ITEM_H,
    backgroundColor: 'rgba(109,40,217,0.12)',
    borderRadius: 10,
    zIndex: 1,
    pointerEvents: 'none',
  } as any,
  item: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: 'rgba(30,27,75,0.45)',
    fontWeight: '400',
  },
  itemActive: {
    fontSize: 18,
    color: '#4C1D95',
    fontWeight: '700',
  },
});

export default function OnboardingScreen() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');

  const [dayIdx, setDayIdx] = useState(14);
  const [monthIdx, setMonthIdx] = useState(0);
  const [yearIdx, setYearIdx] = useState(25);
  const [pickerVisible, setPickerVisible] = useState(false);

  const formattedDate = `${DAYS[dayIdx]}/${String(monthIdx + 1).padStart(2, '0')}/${YEARS[yearIdx]}`;

  const handleSubmit = async () => {
    const profile = {
      name: prenom || 'Belle Maman',
      lastName: nom,
      birthDate: formattedDate,
      mode: 'pregnant',
    };
    await storage.set(STORAGE_KEYS.USER_PROFILE, profile);
    await storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    router.replace('/(tabs)');
  };

  const colW = (width - 64 - 32) / 3;

  return (
    <LinearGradient
      colors={['#1E1047', '#4C1D95', '#6D28D9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconRing}>
              <Ionicons name="flower-outline" size={30} color="#E9D5FF" />
            </View>
            <Text style={styles.greeting}>Bonjour, Future Maman</Text>
            <Text style={styles.subtitle}>Parlez-nous un peu de vous pour personnaliser votre expérience</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color="rgba(233,213,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre prénom"
                  placeholderTextColor="rgba(233,213,255,0.4)"
                  value={prenom}
                  onChangeText={setPrenom}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color="rgba(233,213,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom de famille"
                  placeholderTextColor="rgba(233,213,255,0.4)"
                  value={nom}
                  onChangeText={setNom}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Date of birth picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setPickerVisible(true)}>
                <Ionicons name="calendar-outline" size={18} color="rgba(233,213,255,0.7)" style={styles.inputIcon} />
                <Text style={styles.dateBtnText}>{formattedDate}</Text>
                <Ionicons name="chevron-down" size={16} color="rgba(233,213,255,0.5)" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
              <Text style={styles.submitText}>Créer mon profil</Text>
              <Ionicons name="arrow-forward" size={18} color="#4C1D95" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>Passer cette étape</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={13} color="rgba(233,213,255,0.5)" />
            <Text style={styles.privacyText}>Vos données restent sur votre appareil</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity style={pickerStyles.overlay} activeOpacity={1} onPress={() => setPickerVisible(false)} />
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.handle} />
          <Text style={pickerStyles.title}>Date de naissance</Text>

          <View style={pickerStyles.columns}>
            {/* Day */}
            <View style={{ alignItems: 'center' }}>
              <Text style={pickerStyles.colLabel}>Jour</Text>
              <WheelColumn items={DAYS} selectedIndex={dayIdx} onSelect={setDayIdx} width={colW} />
            </View>
            <View style={pickerStyles.separator} />
            {/* Month */}
            <View style={{ alignItems: 'center' }}>
              <Text style={pickerStyles.colLabel}>Mois</Text>
              <WheelColumn items={MONTHS} selectedIndex={monthIdx} onSelect={setMonthIdx} width={colW + 20} />
            </View>
            <View style={pickerStyles.separator} />
            {/* Year */}
            <View style={{ alignItems: 'center' }}>
              <Text style={pickerStyles.colLabel}>Année</Text>
              <WheelColumn items={YEARS} selectedIndex={yearIdx} onSelect={setYearIdx} width={colW} />
            </View>
          </View>

          <TouchableOpacity style={pickerStyles.confirm} onPress={() => setPickerVisible(false)}>
            <LinearGradient colors={['#4C1D95', '#6D28D9']} style={pickerStyles.confirmGrad}>
              <Text style={pickerStyles.confirmText}>Confirmer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1B4B',
    textAlign: 'center',
    marginBottom: 20,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    marginBottom: 24,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  separator: {
    width: 1,
    height: ITEM_H * 3,
    backgroundColor: '#EDE9FE',
    marginHorizontal: 6,
    marginTop: ITEM_H,
  },
  confirm: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmGrad: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(233,213,255,0.7)',
    textAlign: 'center',
    lineHeight: 21,
    fontWeight: '300',
  },
  form: {
    width: '100%',
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: { gap: 8 },
  label: {
    fontSize: 13,
    color: 'rgba(233,213,255,0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateBtnText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  submitBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C1D95',
    letterSpacing: 0.5,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(233,213,255,0.55)',
    fontWeight: '300',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.7,
  },
  privacyText: {
    fontSize: 12,
    color: 'rgba(233,213,255,0.5)',
  },
});

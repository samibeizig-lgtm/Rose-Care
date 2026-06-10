import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { storage, STORAGE_KEYS } from '../src/hooks/useStorage';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');

  const handleSubmit = async () => {
    const profile = {
      name: prenom || 'Belle Maman',
      lastName: nom,
      birthDate: dateNaissance,
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
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <View style={styles.inputRow}>
                <Ionicons name="calendar-outline" size={18} color="rgba(233,213,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="JJ/MM/AAAA"
                  placeholderTextColor="rgba(233,213,255,0.4)"
                  value={dateNaissance}
                  onChangeText={setDateNaissance}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
              <Text style={styles.submitText}>Créer mon profil</Text>
              <Ionicons name="arrow-forward" size={18} color="#4C1D95" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>Passer cette étape</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy note */}
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={13} color="rgba(233,213,255,0.5)" />
            <Text style={styles.privacyText}>Vos données restent sur votre appareil</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  inputGroup: {
    gap: 8,
  },
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
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

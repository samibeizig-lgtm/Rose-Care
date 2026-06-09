import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';

const { width } = Dimensions.get('window');

export default function MoreScreen() {
  const router = useRouter();

  const menuSections = [
    {
      title: '🏥 Clinique La Rose',
      color: Colors.primary,
      gradient: [Colors.primary, Colors.primaryLight] as [string, string],
      route: '/clinic',
      icon: '🌹',
      description: 'Contact, gynécologues, événements',
    },
    {
      title: '📋 Dossier CNAM',
      color: '#0288D1',
      gradient: ['#0288D1', '#4FC3F7'] as [string, string],
      route: '/cnam',
      icon: '🏛️',
      description: 'Prise en charge, congé maternité',
    },
    {
      title: '🎒 Trousse Bébé & Valise Maman',
      color: Colors.secondary,
      gradient: [Colors.secondary, Colors.secondaryLight] as [string, string],
      route: '/essentials',
      icon: '👶',
      description: 'Listes de préparation complètes',
    },
    {
      title: '🖼️ Mes Échographies',
      color: Colors.zen,
      gradient: [Colors.zen, '#CE93D8'] as [string, string],
      route: '/ultrasound',
      icon: '📷',
      description: 'Galerie de vos échographies',
    },
    {
      title: '📅 Calendrier Menstruel',
      color: Colors.accentDark,
      gradient: [Colors.accentDark, Colors.primaryLight] as [string, string],
      route: '/menstrual',
      icon: '🌙',
      description: 'Suivi du cycle, ovulation',
    },
    {
      title: '📖 Journal de Grossesse',
      color: Colors.gold,
      gradient: [Colors.gold, '#FFD54F'] as [string, string],
      route: '/journal',
      icon: '✏️',
      description: 'Notes et souvenirs',
    },
  ];

  const contactLinks = [
    { icon: '🆘', label: 'SAMU Tunisie', number: '190', color: Colors.error },
    { icon: '🚑', label: 'Urgences médicales', number: '191', color: Colors.warning },
    { icon: '🌹', label: 'Clinique La Rose', number: '+216 71 000 000', color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[Colors.gold, '#F5A623', '#FFD54F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Mes Ressources 📚</Text>
        <Text style={styles.headerSubtitle}>Tout ce dont vous avez besoin</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Menu Grid */}
          <View style={styles.menuGrid}>
            {menuSections.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuCard}
                onPress={() => router.push(item.route as any)}
              >
                <LinearGradient colors={item.gradient} style={styles.menuCardGrad}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.description}</Text>
                  <View style={styles.menuArrow}>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.8)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Emergency Contacts */}
          <Text style={styles.sectionTitle}>🆘 Contacts d'urgence</Text>
          {contactLinks.map((contact, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${contact.number}`)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color + '15' }]}>
                <Text style={styles.contactEmoji}>{contact.icon}</Text>
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.number}</Text>
              </View>
              <Ionicons name="call" size={20} color={contact.color} />
            </TouchableOpacity>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <LinearGradient colors={[Colors.accent, Colors.primaryLight]} style={styles.appInfoGrad}>
              <Text style={styles.appInfoTitle}>🌹 Rose Care</Text>
              <Text style={styles.appInfoText}>
                Votre compagnon de grossesse de la conception à l'accouchement.
                Développé avec amour pour les mamans tunisiennes.
              </Text>
              <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            </LinearGradient>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    padding: 16,
  },
  menuGrid: {
    gap: 12,
    marginBottom: 24,
  },
  menuCard: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  menuCardGrad: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  menuDesc: {
    width: '100%',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    paddingLeft: 46,
  },
  menuArrow: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactEmoji: {
    fontSize: 22,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  contactNumber: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  appInfo: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  appInfoGrad: {
    padding: 20,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 12,
    color: Colors.textLight,
  },
});

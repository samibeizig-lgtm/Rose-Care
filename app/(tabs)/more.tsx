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
      title: 'Clinique La Rose',
      color: Colors.primary,
      gradient: Colors.gradient.primary as [string, string],
      route: '/clinic',
      icon: 'business-outline' as const,
      description: 'Contact, gynécologues, événements',
    },
    {
      title: 'Dossier CNAM',
      color: Colors.primaryDeep,
      gradient: [Colors.primaryDeep, Colors.primary] as [string, string],
      route: '/cnam',
      icon: 'document-text-outline' as const,
      description: 'Prise en charge, congé maternité',
    },
    {
      title: 'Trousse Bébé & Valise Maman',
      color: Colors.primaryLight,
      gradient: [Colors.primaryLight, Colors.primarySoft] as [string, string],
      route: '/essentials',
      icon: 'bag-outline' as const,
      description: 'Listes de préparation complètes',
    },
    {
      title: 'Mes Échographies',
      color: Colors.zen,
      gradient: Colors.gradient.zen as [string, string],
      route: '/ultrasound',
      icon: 'images-outline' as const,
      description: 'Galerie de vos échographies',
    },
    {
      title: 'Calendrier Menstruel',
      color: Colors.accentDark,
      gradient: [Colors.accentDark, Colors.primaryLight] as [string, string],
      route: '/menstrual',
      icon: 'calendar-outline' as const,
      description: 'Suivi du cycle, ovulation',
    },
    {
      title: 'Journal de Grossesse',
      color: Colors.primarySoft,
      gradient: Colors.gradient.soft as [string, string],
      route: '/journal',
      icon: 'book-outline' as const,
      description: 'Notes et souvenirs',
    },
  ];

  const contactLinks = [
    { icon: 'alert-circle-outline' as const, label: 'SAMU Tunisie', number: '190', color: Colors.error },
    { icon: 'medical-outline' as const, label: 'Urgences médicales', number: '191', color: Colors.warning },
    { icon: 'business-outline' as const, label: 'Clinique La Rose', number: '+216 71 000 000', color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={Colors.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Ionicons name="grid-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.headerTitle}>Mes Ressources</Text>
            <Text style={styles.headerSubtitle}>Tout ce dont vous avez besoin</Text>
          </View>
        </View>
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
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={26} color={Colors.white} />
                  </View>
                  <View style={styles.menuTextBlock}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDesc}>{item.description}</Text>
                  </View>
                  <View style={styles.menuArrow}>
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.75)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Emergency Contacts */}
          <Text style={styles.sectionTitle}>Contacts d'urgence</Text>
          {contactLinks.map((contact, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${contact.number}`)}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: contact.color + '14' }]}>
                <Ionicons name={contact.icon} size={22} color={contact.color} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.number}</Text>
              </View>
              <View style={[styles.callBtn, { backgroundColor: contact.color + '14' }]}>
                <Ionicons name="call-outline" size={18} color={contact.color} />
              </View>
            </TouchableOpacity>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <LinearGradient colors={Colors.gradient.card} style={styles.appInfoGrad}>
              <View style={styles.appInfoIconRow}>
                <Ionicons name="heart-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.appInfoTitle}>Rose Care</Text>
              <Text style={styles.appInfoText}>
                Votre compagnon de grossesse de la conception à l'accouchement.
                Développé avec amour pour les mamans tunisiennes.
              </Text>
              <View style={styles.versionBadge}>
                <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
              </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
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
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  menuCardGrad: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  menuTextBlock: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
  },
  menuArrow: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: 0.2,
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  appInfoGrad: {
    padding: 24,
    alignItems: 'center',
  },
  appInfoIconRow: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
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
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  appInfoVersion: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
});

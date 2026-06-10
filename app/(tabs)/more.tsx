import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

export default function MoreScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
  }, []);

  const menuSections = [
    {
      title: 'Dossier CNAM',
      color: Colors.primaryDeep,
      gradient: [Colors.primaryDeep, Colors.primary] as [string, string],
      route: '/cnam',
      icon: 'document-text-outline' as const,
      description: 'Prise en charge, congé maternité',
    },
    {
      title: 'Urgences & SOS',
      color: Colors.error,
      gradient: ['#C0392B', '#E74C3C'] as [string, string],
      route: null,
      icon: 'medkit-outline' as const,
      description: 'Contacts d\'urgence rapides',
    },
    {
      title: 'Rose Care',
      color: Colors.primarySoft,
      gradient: Colors.gradient.soft as [string, string],
      route: null,
      icon: 'heart-outline' as const,
      description: 'À propos de l\'application',
    },
  ];

  const contactLinks = [
    { icon: 'alert-circle-outline' as const, label: 'SAMU Tunisie', number: '190', color: Colors.error },
    { icon: 'medical-outline' as const, label: 'Urgences médicales', number: '191', color: Colors.warning },
    { icon: 'business-outline' as const, label: 'Clinique La Rose', number: '71 100 900', color: Colors.primary },
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
        <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
          <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill="#FFFFFF" />
        </Svg>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>

          {/* Menu Grid */}
          <View style={styles.menuGrid}>
            {menuSections.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuCard}
                onPress={() => item.route && router.push(item.route as any)}
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
              onPress={() => Linking.openURL(`tel:${contact.number.replace(/\s/g, '')}`)}
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
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 24 + WAVE_H,
    overflow: 'hidden',
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

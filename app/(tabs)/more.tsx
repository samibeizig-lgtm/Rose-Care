import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useTheme } from '../../src/theme/ThemeContext';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

export default function MoreScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
    }, [])
  );

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
      title: 'Clinique La Rose',
      color: Colors.primary,
      gradient: ['#5B00B5', '#9933FF'] as [string, string],
      route: '/clinic',
      icon: 'business-outline' as const,
      description: 'Info, médecins & services',
    },
  ];

  const contactLinks = [
    { icon: 'medical-outline' as const, label: 'Urgences médicales', number: '190', color: Colors.warning },
    { icon: 'business-outline' as const, label: 'Clinique La Rose', number: '71 100 900', color: Colors.primary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
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
          <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
        </Svg>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>

          {/* Banner */}
          <View style={styles.imageBanner}>
            <Image
              source={require('../../assets/images/health-banner.jpg')}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
            />
            <View style={styles.imageBannerInner}>
              <Text style={styles.imageBannerTitle}>Mes Ressources 📚</Text>
              <Text style={styles.imageBannerSub}>CNAM · Contacts d'urgence · Informations pratiques</Text>
            </View>
          </View>

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
          <Text style={[styles.sectionTitle, { color: th.text }]}>Contacts d'urgence</Text>
          {contactLinks.map((contact, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.contactRow, { backgroundColor: th.card, borderColor: th.border }]}
              onPress={() => Linking.openURL(`tel:${contact.number.replace(/\s/g, '')}`)}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: contact.color + '14' }]}>
                <Ionicons name={contact.icon} size={22} color={contact.color} />
              </View>
              <View style={styles.contactText}>
                <Text style={[styles.contactLabel, { color: th.text }]}>{contact.label}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.number}</Text>
              </View>
              <View style={[styles.callBtn, { backgroundColor: contact.color + '14' }]}>
                <Ionicons name="call-outline" size={18} color={contact.color} />
              </View>
            </TouchableOpacity>
          ))}

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
  imageBanner: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 16,
  },
  bannerCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.09)',
    top: -50,
    right: -30,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -35,
    left: 15,
  },
  bannerIcon: {
    position: 'absolute',
    top: 16,
    right: 18,
  },
  imageBannerInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  imageBannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  imageBannerSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
  },
});

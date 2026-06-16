import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { storage, STORAGE_KEYS } from '../src/hooks/useStorage';
import { useTheme } from '../src/theme/ThemeContext';

const { width, height } = Dimensions.get('window');
const WAVE_H = 64;
const TOP_H = height * 0.57;
const CIRCLE_D = 120;

export default function WelcomeScreen() {
  const router = useRouter();
  const { th } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; lastName?: string } | null>(null);

  useEffect(() => {
    storage.get(STORAGE_KEYS.USER_PROFILE, null).then((p: any) => {
      if (p?.name && p.name !== 'Belle Maman') {
        setProfile(p);
      }
      setLoading(false);
    });
  }, []);

  const circleTop = TOP_H - WAVE_H / 2 - CIRCLE_D / 2;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ─── Purple top ─── */}
      <View style={[styles.topSection, { height: TOP_H }]}>
        <LinearGradient
          colors={['#4B0082', '#7F00FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        >
          <Image
            source={require('../assets/images/welcome-bg.jpg')}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.22 }]}
            resizeMode="cover"
          />
        </LinearGradient>
        <View style={styles.topContent}>
          <View style={styles.smallBadge}>
            <Ionicons name="heart" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.badgeText}>Fertilité · Maternité</Text>
          </View>
          <Text style={styles.appTitle}>
            <Text style={styles.bold}>Rose</Text>
            <Text style={styles.light}> Care</Text>
          </Text>
          <Text style={styles.tagline}>
            {profile ? `Ravi de vous revoir !` : 'Votre compagne de maternité'}
          </Text>
        </View>
        <Svg
          width={width}
          height={WAVE_H}
          style={{ position: 'absolute', bottom: 0 }}
          viewBox={`0 0 ${width} ${WAVE_H}`}
        >
          <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
        </Svg>
      </View>

      {/* ─── White bottom ─── */}
      <View style={[styles.bottomSection, { backgroundColor: th.bg }]}>
        <View style={{ height: CIRCLE_D / 2 + 24 }} />

        {profile ? (
          <>
            <Text style={styles.welcomeBack}>Bon retour,</Text>
            <Text style={styles.welcomeName}>{profile.name} !</Text>
            <Text style={styles.welcomeSub}>Votre parcours maternité continue ici.</Text>
            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.85}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.ctaText}>CONTINUER</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.welcomeTitle}>Commençons !</Text>
            <Text style={styles.welcomeSub}>
              Suivez votre parcours de fertilité{'\n'}et de maternité pas à pas
            </Text>
            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.85}
              onPress={() => router.replace('/onboarding' as any)}
            >
              <Text style={styles.ctaText}>COMMENCER</Text>
            </TouchableOpacity>
          </>
        )}
        <Image
          source={require('../assets/images/welcome-bg.jpg')}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, opacity: 0.07 }}
          resizeMode="cover"
        />
      </View>

      {/* ─── Floating circle ─── */}
      <View style={[styles.floatCircle, { top: circleTop, left: (width - CIRCLE_D) / 2 }]}>
        <LinearGradient
          colors={['#7F00FF', '#B366FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatGrad}
        >
          <Ionicons name="heart-outline" size={48} color="#FFFFFF" />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#7F00FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: WAVE_H + 20,
    marginTop: 40,
  },
  smallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 52,
    letterSpacing: 2,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  light: {
    fontWeight: '200',
    color: 'rgba(233,213,255,0.9)',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 48,
    justifyContent: 'center',
  },
  welcomeBack: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '400',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 10,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 42,
  },
  cta: {
    backgroundColor: '#7F00FF',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  floatCircle: {
    position: 'absolute',
    width: CIRCLE_D,
    height: CIRCLE_D,
    borderRadius: CIRCLE_D / 2,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  floatGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1E1047', '#4C1D95', '#6D28D9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <View style={styles.content}>
        {/* Logo / Brand */}
        <View style={styles.brandContainer}>
          <View style={styles.iconRing}>
            <Text style={styles.iconText}>✦</Text>
          </View>
          <Text style={styles.appName}>Rose Care</Text>
          <Text style={styles.tagline}>Votre accompagnement maternité</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            'Suivi de grossesse semaine par semaine',
            'Santé, nutrition & bien-être',
            'Espace Zen & relaxation',
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleTop: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.5,
    left: -width * 0.1,
  },
  circleBottom: {
    width: width * 0.9,
    height: width * 0.9,
    bottom: -width * 0.3,
    right: -width * 0.2,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 56,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 28,
    color: '#E9D5FF',
  },
  appName: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(233,213,255,0.75)',
    letterSpacing: 1,
    fontWeight: '300',
  },
  features: {
    width: '100%',
    marginBottom: 56,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C084FC',
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 56,
    paddingVertical: 16,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C1D95',
    letterSpacing: 1,
  },
});

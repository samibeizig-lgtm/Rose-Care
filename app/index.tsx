import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Ellipse, G, Rect, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

function BackgroundShapes() {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <G opacity={0.09}>
        {/* Sperm 1 - top left */}
        <Circle cx={45} cy={110} r={9} fill="#fff" />
        <Path d="M54 110 C80 95 110 70 140 55" stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Sperm 2 - mid right */}
        <Circle cx={width - 40} cy={220} r={7} fill="#fff" />
        <Path d={`M${width - 47} 220 C${width - 80} 205 ${width - 110} 185 ${width - 135} 170`} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />

        {/* Sperm 3 - bottom left */}
        <Circle cx={60} cy={height - 230} r={6} fill="#fff" />
        <Path d={`M66 ${height - 230} C95 ${height - 248} 120 ${height - 260} 145 ${height - 272}`} stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />

        {/* Sperm 4 - small top right */}
        <Circle cx={width - 70} cy={90} r={5} fill="#fff" />
        <Path d={`M${width - 65} 90 C${width - 40} 78 ${width - 20} 65 ${width - 8} 52`} stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" />

        {/* Ovule - right center */}
        <Circle cx={width - 50} cy={height / 2 - 40} r={24} fill="none" stroke="#fff" strokeWidth={2} />
        <Circle cx={width - 50} cy={height / 2 - 40} r={10} fill="#fff" opacity={0.4} />
        <Circle cx={width - 32} cy={height / 2 - 58} r={3} fill="#fff" />
        <Circle cx={width - 37} cy={height / 2 - 19} r={2.5} fill="#fff" />
        <Circle cx={width - 68} cy={height / 2 - 52} r={2} fill="#fff" />
        <Circle cx={width - 72} cy={height / 2 - 28} r={2.5} fill="#fff" />

        {/* Baby silhouette - bottom right */}
        {/* head */}
        <Circle cx={width - 65} cy={height - 180} r={14} fill="none" stroke="#fff" strokeWidth={1.8} />
        {/* body */}
        <Ellipse cx={width - 65} cy={height - 148} rx={9} ry={14} fill="none" stroke="#fff" strokeWidth={1.8} />
        {/* arm left */}
        <Path d={`M${width - 74} ${height - 155} C${width - 85} ${height - 148} ${width - 88} ${height - 140} ${width - 84} ${height - 135}`} stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* arm right */}
        <Path d={`M${width - 56} ${height - 155} C${width - 45} ${height - 148} ${width - 42} ${height - 140} ${width - 46} ${height - 135}`} stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" />

        {/* Thermometer - left mid-low */}
        <Rect x={28} y={height - 280} width={10} height={48} rx={5} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={33} cy={height - 229} r={8} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Rect x={31} y={height - 258} width={4} height={26} rx={2} fill="#fff" opacity={0.4} />
        {/* temp lines */}
        <Line x1={38} y1={height - 272} x2={44} y2={height - 272} stroke="#fff" strokeWidth={1.5} />
        <Line x1={38} y1={height - 263} x2={44} y2={height - 263} stroke="#fff" strokeWidth={1.5} />
        <Line x1={38} y1={height - 253} x2={44} y2={height - 253} stroke="#fff" strokeWidth={1.5} />

        {/* Baby sock - top center */}
        <Path d={`M${width / 2 - 18} 55 L${width / 2 - 18} 80 Q${width / 2 - 18} 90 ${width / 2 - 8} 90 L${width / 2 + 14} 90 Q${width / 2 + 22} 90 ${width / 2 + 22} 82 Q${width / 2 + 22} 75 ${width / 2 + 14} 74 L${width / 2 - 8} 74 L${width / 2 - 8} 55 Z`} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
        {/* sock cuff */}
        <Line x1={width / 2 - 18} y1={62} x2={width / 2 - 8} y2={62} stroke="#fff" strokeWidth={1.5} />
      </G>
    </Svg>
  );
}

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
      <BackgroundShapes />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.brandContainer}>
          <View style={styles.handsRing}>
            <View style={styles.handsRow}>
              <Ionicons name="hand-left-outline" size={26} color="#E9D5FF" />
              <Ionicons name="hand-right-outline" size={26} color="#E9D5FF" />
            </View>
          </View>
          <Text style={styles.appName}>Rose Care</Text>
          <Text style={styles.tagline}>Votre accompagnement fertilité et maternité</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.replace('/onboarding' as any)}
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 72,
  },
  handsRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  handsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  appName: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(233,213,255,0.75)',
    letterSpacing: 0.5,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 20,
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

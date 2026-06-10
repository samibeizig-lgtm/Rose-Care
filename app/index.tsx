import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Ellipse, G, Rect, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

function BackgroundShapes() {
  const cx = width / 2;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">

      {/* ── ROSE FLOWER  (top-right) ── */}
      <G opacity={0.22} transform={`translate(${width - 72}, 90)`}>
        {/* petals */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const r = deg * (Math.PI / 180);
          const px = Math.cos(r) * 28;
          const py = Math.sin(r) * 28;
          return (
            <Ellipse key={i} cx={px} cy={py} rx={14} ry={9}
              fill="none" stroke="#fff" strokeWidth={1.8}
              transform={`rotate(${deg}, ${px}, ${py})`} />
          );
        })}
        {/* centre */}
        <Circle cx={0} cy={0} r={9} fill="none" stroke="#fff" strokeWidth={2} />
        <Circle cx={0} cy={0} r={4} fill="#fff" opacity={0.5} />
        {/* stem */}
        <Path d="M0 9 C-3 22 -4 34 -2 46" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        {/* leaf */}
        <Path d="M-2 34 C-12 28 -16 20 -10 14 C-6 22 -2 30 -2 34 Z" fill="#fff" opacity={0.6} />
      </G>

      {/* ── PREGNANT WOMAN SILHOUETTE (left side) ── */}
      <G opacity={0.17} transform={`translate(32, ${height * 0.32})`}>
        {/* head */}
        <Circle cx={16} cy={0} r={16} fill="none" stroke="#fff" strokeWidth={2} />
        {/* neck */}
        <Line x1={14} y1={16} x2={12} y2={26} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        <Line x1={18} y1={16} x2={20} y2={26} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        {/* body left */}
        <Path d="M10 28 C5 40 2 58 2 72 C2 88 6 102 10 110" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* belly bump */}
        <Path d="M22 30 C34 36 40 52 38 68 C36 82 28 94 20 102" stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* arm */}
        <Path d="M22 34 C30 42 34 54 30 66" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.7} />
        {/* legs */}
        <Path d="M10 110 C8 122 7 134 8 146" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Path d="M20 106 C22 120 22 132 20 144" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
      </G>

      {/* ── BABY FOOTPRINT (bottom-left) ── */}
      <G opacity={0.20} transform={`translate(28, ${height - 175})`}>
        {/* sole */}
        <Ellipse cx={20} cy={28} rx={18} ry={24} fill="none" stroke="#fff" strokeWidth={2} />
        {/* toes */}
        <Circle cx={5}  cy={5}  r={6} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={14} cy={1}  r={5.5} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={23} cy={0}  r={5} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={31} cy={3}  r={4.5} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={37} cy={8}  r={4} fill="none" stroke="#fff" strokeWidth={1.8} />
      </G>

      {/* ── BABY BOTTLE (top-left) ── */}
      <G opacity={0.19} transform={`translate(30, 60)`}>
        {/* nipple */}
        <Path d="M15 0 C14 -10 18 -14 20 -14 C22 -14 26 -10 25 0" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        {/* collar ring */}
        <Rect x={12} y={0} width={16} height={7} rx={3} fill="none" stroke="#fff" strokeWidth={1.8} />
        {/* bottle body */}
        <Path d="M12 7 L10 18 L10 62 Q10 72 20 72 Q30 72 30 62 L30 18 L28 7 Z" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
        {/* milk fill */}
        <Rect x={11} y={36} width={18} height={26} rx={0} fill="#fff" opacity={0.12} />
        <Line x1={11} y1={36} x2={29} y2={36} stroke="#fff" strokeWidth={1.5} />
        {/* scale marks */}
        <Line x1={10} y1={26} x2={14} y2={26} stroke="#fff" strokeWidth={1.2} />
        <Line x1={10} y1={46} x2={14} y2={46} stroke="#fff" strokeWidth={1.2} />
        <Line x1={10} y1={56} x2={14} y2={56} stroke="#fff" strokeWidth={1.2} />
      </G>

      {/* ── HEART  (bottom-right) ── */}
      <G opacity={0.20} transform={`translate(${width - 68}, ${height - 130})`}>
        <Path d="M0 38 C-3 34 -26 18 -26 4 C-26 -10 -14 -18 0 -6 C14 -18 26 -10 26 4 C26 18 3 34 0 38 Z" fill="none" stroke="#fff" strokeWidth={2.2} />
        {/* sparkles around heart */}
        <Line x1={22} y1={-18} x2={22} y2={-10} stroke="#fff" strokeWidth={1.5} />
        <Line x1={18} y1={-14} x2={26} y2={-14} stroke="#fff" strokeWidth={1.5} />
        <Line x1={-18} y1={-22} x2={-18} y2={-16} stroke="#fff" strokeWidth={1.5} />
        <Line x1={-22} y1={-19} x2={-14} y2={-19} stroke="#fff" strokeWidth={1.5} />
        <Circle cx={28} cy={28} r={2.5} fill="#fff" />
        <Circle cx={-24} cy={22} r={2} fill="#fff" />
      </G>

      {/* ── Scattered dots / stars ── */}
      <G opacity={0.25}>
        <Circle cx={cx - 80} cy={70}  r={2.5} fill="#fff" />
        <Circle cx={cx + 60} cy={55}  r={2}   fill="#fff" />
        <Circle cx={cx + 90} cy={height * 0.4} r={2.5} fill="#fff" />
        <Circle cx={cx - 60} cy={height * 0.72} r={2} fill="#fff" />
        <Circle cx={cx + 20} cy={height - 200} r={3} fill="#fff" />
        {/* 4-pointed star */}
        <Path d={`M${cx+40} 100 L${cx+43} 108 L${cx+51} 108 L${cx+44} 113 L${cx+47} 121 L${cx+40} 116 L${cx+33} 121 L${cx+36} 113 L${cx+29} 108 L${cx+37} 108 Z`} fill="#fff" opacity={0.4} />
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

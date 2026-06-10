import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Ellipse, G, Line } from 'react-native-svg';
import { storage, STORAGE_KEYS } from '../src/hooks/useStorage';

const { width, height } = Dimensions.get('window');

function MotherBabyIllustration() {
  const s = width * 0.78;
  const ox = width * 0.12;
  const oy = height * 0.08;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <G opacity={0.19} transform={`translate(${ox}, ${oy})`}>
        {/* ── MOTHER ── */}
        {/* Head */}
        <Circle cx={s * 0.56} cy={s * 0.09} r={s * 0.09} fill="none" stroke="#fff" strokeWidth={2.8} />
        {/* Hair (long) */}
        <Path d={`M${s*0.47} ${s*0.03} C${s*0.38} ${s*0.00} ${s*0.32} ${s*0.10} ${s*0.30} ${s*0.25} C${s*0.29} ${s*0.38} ${s*0.31} ${s*0.50} ${s*0.33} ${s*0.62}`}
          stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Path d={`M${s*0.65} ${s*0.03} C${s*0.74} ${s*0.00} ${s*0.80} ${s*0.10} ${s*0.82} ${s*0.25} C${s*0.83} ${s*0.38} ${s*0.81} ${s*0.50} ${s*0.79} ${s*0.62}`}
          stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {/* Neck */}
        <Line x1={s*0.54} y1={s*0.18} x2={s*0.52} y2={s*0.27} stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
        <Line x1={s*0.58} y1={s*0.18} x2={s*0.60} y2={s*0.27} stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
        {/* Shoulders */}
        <Path d={`M${s*0.34} ${s*0.30} C${s*0.40} ${s*0.27} ${s*0.48} ${s*0.26} ${s*0.56} ${s*0.27}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Path d={`M${s*0.60} ${s*0.27} C${s*0.68} ${s*0.26} ${s*0.76} ${s*0.27} ${s*0.82} ${s*0.30}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* Body sides */}
        <Path d={`M${s*0.34} ${s*0.30} C${s*0.30} ${s*0.42} ${s*0.28} ${s*0.58} ${s*0.30} ${s*0.72} C${s*0.31} ${s*0.84} ${s*0.36} ${s*0.94} ${s*0.38} ${s*1.00}`}
          stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Path d={`M${s*0.82} ${s*0.30} C${s*0.86} ${s*0.42} ${s*0.88} ${s*0.58} ${s*0.86} ${s*0.72} C${s*0.85} ${s*0.84} ${s*0.80} ${s*0.94} ${s*0.78} ${s*1.00}`}
          stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {/* Left arm wrapping around baby */}
        <Path d={`M${s*0.34} ${s*0.30} C${s*0.22} ${s*0.38} ${s*0.16} ${s*0.54} ${s*0.18} ${s*0.68} C${s*0.20} ${s*0.76} ${s*0.28} ${s*0.80} ${s*0.36} ${s*0.78}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* Right arm wrapping */}
        <Path d={`M${s*0.82} ${s*0.30} C${s*0.94} ${s*0.38} ${s*1.00} ${s*0.54} ${s*0.98} ${s*0.68} C${s*0.96} ${s*0.76} ${s*0.88} ${s*0.80} ${s*0.80} ${s*0.78}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* ── BABY (cradled) ── */}
        {/* Baby head */}
        <Circle cx={s*0.58} cy={s*0.60} r={s*0.07} fill="none" stroke="#fff" strokeWidth={2.5} />
        {/* Baby swaddle body */}
        <Ellipse cx={s*0.56} cy={s*0.74} rx={s*0.13} ry={s*0.09} fill="none" stroke="#fff" strokeWidth={2.2} />
        {/* Baby tiny hand */}
        <Path d={`M${s*0.66} ${s*0.68} C${s*0.71} ${s*0.70} ${s*0.73} ${s*0.76} ${s*0.69} ${s*0.79}`}
          stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <Circle cx={s*0.69} cy={s*0.81} r={s*0.025} fill="none" stroke="#fff" strokeWidth={1.8} />

        {/* Mother's hands joining under baby */}
        <Path d={`M${s*0.36} ${s*0.78} C${s*0.42} ${s*0.84} ${s*0.50} ${s*0.87} ${s*0.58} ${s*0.86}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Path d={`M${s*0.80} ${s*0.78} C${s*0.74} ${s*0.84} ${s*0.66} ${s*0.87} ${s*0.58} ${s*0.86}`}
          stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Small heart floating above */}
        <Path d={`M${s*0.56} ${s*(-0.05)} C${s*0.56} ${s*(-0.09)} ${s*0.52} ${s*(-0.11)} ${s*0.52} ${s*(-0.07)} C${s*0.52} ${s*(-0.03)} ${s*0.56} ${s*0.00} ${s*0.56} ${s*0.00} C${s*0.56} ${s*0.00} ${s*0.60} ${s*(-0.03)} ${s*0.60} ${s*(-0.07)} C${s*0.60} ${s*(-0.11)} ${s*0.56} ${s*(-0.09)} ${s*0.56} ${s*(-0.05)} Z`}
          fill="#fff" opacity={0.75} />
      </G>

      {/* ── Rose flower top-right ── */}
      <G opacity={0.22} transform={`translate(${width - 62}, 85)`}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const r = deg * (Math.PI / 180);
          const px = Math.cos(r) * 24;
          const py = Math.sin(r) * 24;
          return (
            <Ellipse key={i} cx={px} cy={py} rx={13} ry={8}
              fill="none" stroke="#fff" strokeWidth={1.8}
              transform={`rotate(${deg}, ${px}, ${py})`} />
          );
        })}
        <Circle cx={0} cy={0} r={8} fill="none" stroke="#fff" strokeWidth={2} />
        <Circle cx={0} cy={0} r={3.5} fill="#fff" opacity={0.6} />
        <Path d="M0 8 C-3 20 -4 30 -2 40" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <Path d="M-2 30 C-10 24 -14 16 -8 10 C-4 18 -2 26 -2 30 Z" fill="#fff" opacity={0.55} />
      </G>

      {/* ── Baby footprint bottom-left ── */}
      <G opacity={0.20} transform={`translate(22, ${height - 160})`}>
        <Ellipse cx={18} cy={26} rx={16} ry={22} fill="none" stroke="#fff" strokeWidth={1.8} />
        <Circle cx={4}   cy={4}    r={5.5} fill="none" stroke="#fff" strokeWidth={1.6} />
        <Circle cx={12}  cy={0.5}  r={5}   fill="none" stroke="#fff" strokeWidth={1.6} />
        <Circle cx={21}  cy={-0.5} r={4.5} fill="none" stroke="#fff" strokeWidth={1.6} />
        <Circle cx={29}  cy={2}    r={4}   fill="none" stroke="#fff" strokeWidth={1.6} />
        <Circle cx={35}  cy={7}    r={3.5} fill="none" stroke="#fff" strokeWidth={1.6} />
      </G>

      {/* ── Sparkles ── */}
      <G opacity={0.28}>
        <Circle cx={38} cy={80} r={2.5} fill="#fff" />
        <Circle cx={width - 112} cy={62} r={2} fill="#fff" />
        <Circle cx={width * 0.28} cy={height * 0.46} r={2} fill="#fff" />
        <Circle cx={width * 0.72} cy={height * 0.88} r={2.5} fill="#fff" />
        <Circle cx={width * 0.14} cy={height * 0.66} r={2} fill="#fff" />
        <Path d={`M${width*0.78} ${height*0.13} L${width*0.78+3} ${height*0.13+8} L${width*0.78+10} ${height*0.13+8} L${width*0.78+4} ${height*0.13+13} L${width*0.78+7} ${height*0.13+20} L${width*0.78} ${height*0.13+16} L${width*0.78-7} ${height*0.13+20} L${width*0.78-4} ${height*0.13+13} L${width*0.78-10} ${height*0.13+8} L${width*0.78-3} ${height*0.13+8} Z`}
          fill="#fff" opacity={0.5} />
      </G>
    </Svg>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    storage.get(STORAGE_KEYS.ONBOARDING_DONE, false).then((done) => {
      if (done) router.replace('/(tabs)');
    });
  }, []);

  return (
    <LinearGradient
      colors={['#1E1047', '#4C1D95', '#6D28D9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <MotherBabyIllustration />

      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <Text style={styles.appName}>
            <Text style={styles.appNameBold}>Rose</Text>
            <Text style={styles.appNameLight}> Care</Text>
          </Text>
          <Text style={styles.tagline}>Votre accompagnement fertilité et maternité</Text>
        </View>

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
  appName: {
    fontSize: 46,
    letterSpacing: 3,
    marginBottom: 14,
  },
  appNameBold: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appNameLight: {
    fontWeight: '200',
    color: 'rgba(233,213,255,0.9)',
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

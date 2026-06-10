import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';
import { pregnancyWeeks } from '../../src/data/weeklyData';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { differenceInWeeks, parseISO } from 'date-fns';

const { width } = Dimensions.get('window');

const TRIMESTER_COLORS: Record<1 | 2 | 3, [string, string]> = {
  1: [Colors.primaryDark, Colors.primary],
  2: [Colors.primary, Colors.primaryLight],
  3: [Colors.primaryLight, Colors.primarySoft],
};

export default function PregnancyScreen() {
  const router = useRouter();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3 | null>(null);
  const [pregnancyStart] = useStorage(STORAGE_KEYS.PREGNANCY_START, '');

  const currentWeek = pregnancyStart
    ? Math.min(40, Math.max(1, differenceInWeeks(new Date(), parseISO(pregnancyStart)) + 1))
    : 0;

  const filteredWeeks = selectedTrimester
    ? pregnancyWeeks.filter(w => w.trimester === selectedTrimester)
    : pregnancyWeeks;

  const conceptionTips = [
    { icon: '🌡️', title: 'Température basale', desc: 'Mesurez chaque matin pour détecter l\'ovulation' },
    { icon: '💊', title: 'Acide folique', desc: '400µg/jour avant conception et 1er trimestre' },
    { icon: '🏃‍♀️', title: 'Mode de vie sain', desc: 'Arrêtez tabac, alcool, limitez le café' },
    { icon: '💆‍♀️', title: 'Réduire le stress', desc: 'Le cortisol perturbe l\'ovulation' },
    { icon: '🥦', title: 'Alimentation', desc: 'Légumes verts, protéines, oméga-3' },
    { icon: '🩺', title: 'Bilan préconceptionnel', desc: 'Consultez votre gynécologue avant' },
  ];

  const fertilityInfo = [
    { icon: 'calendar-outline' as const, title: 'Jours fertiles', desc: 'Généralement 5 jours avant et 1 jour après l\'ovulation' },
    { icon: 'flask-outline' as const, title: 'Bilan de fertilité', desc: 'Spermogramme + bilan hormonal si difficultés après 12 mois' },
    { icon: 'medical-outline' as const, title: 'FIV & AMP', desc: 'Techniques d\'Assistance Médicale à la Procréation disponibles' },
    { icon: 'business-outline' as const, title: 'Clinique La Rose', desc: 'Consultez nos spécialistes en fertilité' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Ma Grossesse</Text>
          <Text style={styles.headerSubtitle}>De la conception à l'accouchement</Text>
          {currentWeek > 0 && (
            <TouchableOpacity
              style={styles.currentWeekBtn}
              onPress={() => router.push(`/pregnancy/week/${currentWeek}` as any)}
            >
              <Ionicons name="arrow-forward-circle-outline" size={16} color={Colors.white} />
              <Text style={styles.currentWeekBtnText}>Ma semaine actuelle (S{currentWeek})</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        <View style={styles.content}>

          {/* Conception Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conception & Fertilité</Text>
            <Text style={styles.sectionSubtitle}>Conseils pour concevoir naturellement</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {conceptionTips.map((tip, idx) => (
                <View key={idx} style={styles.tipCard}>
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDesc}>{tip.desc}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Fertility Help Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Traitement de l'Infertilité</Text>
            {fertilityInfo.map((item, idx) => (
              <View key={idx} style={styles.fertilityRow}>
                <View style={styles.fertilityIconWrap}>
                  <Ionicons name={item.icon} size={22} color={Colors.primary} />
                </View>
                <View style={styles.fertilityText}>
                  <Text style={styles.fertilityTitle}>{item.title}</Text>
                  <Text style={styles.fertilityDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Trimester Filter */}
          <Text style={styles.sectionTitle}>Semaine par Semaine</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterBtn, !selectedTrimester && styles.filterBtnActive]}
              onPress={() => setSelectedTrimester(null)}
            >
              <Text style={[styles.filterBtnText, !selectedTrimester && styles.filterBtnTextActive]}>Tout</Text>
            </TouchableOpacity>
            {([1, 2, 3] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.filterBtn, selectedTrimester === t && styles.filterBtnActive]}
                onPress={() => setSelectedTrimester(selectedTrimester === t ? null : t)}
              >
                <Text style={[styles.filterBtnText, selectedTrimester === t && styles.filterBtnTextActive]}>
                  T{t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Weekly Grid */}
          <View style={styles.weekGrid}>
            {filteredWeeks.map((week) => {
              const isCurrentWeek = week.week === currentWeek;
              const isPassed = week.week < currentWeek;
              const colors = TRIMESTER_COLORS[week.trimester as 1 | 2 | 3];

              return (
                <TouchableOpacity
                  key={week.week}
                  style={[
                    styles.weekCard,
                    isCurrentWeek && styles.weekCardCurrent,
                    isPassed && styles.weekCardPassed,
                  ]}
                  onPress={() => router.push(`/pregnancy/week/${week.week}` as any)}
                >
                  {isCurrentWeek ? (
                    <LinearGradient colors={colors} style={styles.weekGradient}>
                      <Text style={styles.weekEmoji}>{week.fruitEmoji}</Text>
                      <Text style={[styles.weekNum, { color: Colors.white }]}>S{week.week}</Text>
                      <View style={styles.currentBadge}>
                        <Ionicons name="checkmark" size={10} color={Colors.white} />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.weekPlain, isPassed && { backgroundColor: Colors.lilac }]}>
                      <Text style={styles.weekEmoji}>{week.fruitEmoji}</Text>
                      <Text style={[styles.weekNum, isPassed && { color: Colors.primary }]}>S{week.week}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    marginBottom: 16,
  },
  currentWeekBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  currentWeekBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  horizontalScroll: {
    marginHorizontal: -4,
  },
  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    width: 140,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  fertilityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  fertilityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lilac,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  fertilityText: {
    flex: 1,
  },
  fertilityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  fertilityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterBtnTextActive: {
    color: Colors.white,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  weekCard: {
    width: (width - 60) / 5,
    borderRadius: 14,
    overflow: 'hidden',
  },
  weekCardCurrent: {
    transform: [{ scale: 1.08 }],
  },
  weekCardPassed: {
    opacity: 0.9,
  },
  weekGradient: {
    padding: 10,
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
    position: 'relative',
  },
  weekPlain: {
    padding: 10,
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  weekNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  currentBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

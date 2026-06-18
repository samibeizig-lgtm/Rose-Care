import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
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
import { pregnancyWeeks } from '../../src/data/weeklyData';
import { useStorage, storage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { differenceInWeeks, parseISO, addDays, parse, isValid, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePickerModal from '../../src/components/DatePickerModal';

const { width } = Dimensions.get('window');
const BANNER_H = Math.round((width - 32) * 630 / 1200);
const WAVE_H = 50;

const TRIMESTER_COLORS: Record<1 | 2 | 3, [string, string]> = {
  1: [Colors.primaryDark, Colors.primary],
  2: [Colors.primary, Colors.primaryLight],
  3: [Colors.primaryLight, Colors.primarySoft],
};

export default function PregnancyScreen() {
  const router = useRouter();
  const { isDark, th } = useTheme();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3 | null>(null);
  const [pregnancyStart, setPregnancyStart] = useStorage(STORAGE_KEYS.PREGNANCY_START, '');
  const [lastPeriodDate, setLastPeriodDate] = useStorage(STORAGE_KEYS.LAST_PERIOD_DATE, '');
  const [showDDPInput, setShowDDPInput] = useState(false);
  const [ddpInput, setDdpInput] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
    }, [])
  );

  useEffect(() => {
    if (lastPeriodDate) {
      setDdpInput(lastPeriodDate);
      try {
        const parsed = parse(lastPeriodDate, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) setSelectedDate(parsed);
      } catch {}
    }
  }, [lastPeriodDate]);

  const currentWeek = pregnancyStart
    ? Math.min(40, Math.max(1, differenceInWeeks(new Date(), parseISO(pregnancyStart)) + 1))
    : 0;

  const filteredWeeks = selectedTrimester
    ? pregnancyWeeks.filter(w => w.trimester === selectedTrimester)
    : pregnancyWeeks;

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    setDdpInput(format(date, 'dd/MM/yyyy'));
  };

  const handleSaveDDP = async () => {
    if (!selectedDate) {
      Alert.alert('Date manquante', 'Veuillez sélectionner la date de vos dernières règles');
      return;
    }
    const isoDate = selectedDate.toISOString();
    const dueDate = addDays(selectedDate, 280);
    await setPregnancyStart(isoDate);
    await setLastPeriodDate(ddpInput);
    await storage.set(STORAGE_KEYS.DUE_DATE, dueDate.toISOString());
    setShowDDPInput(false);
    Alert.alert('Enregistré', `Début de grossesse : Semaine 1\nDate prévue d'accouchement : ${format(dueDate, 'dd MMMM yyyy', { locale: fr })}`);
  };

  const dueDate = pregnancyStart
    ? addDays(parseISO(pregnancyStart), 280)
    : null;

  const trimesterName = currentWeek <= 12
    ? '1er Trimestre'
    : currentWeek <= 27
      ? '2ème Trimestre'
      : '3ème Trimestre';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        {/* Header */}
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Ma Grossesse</Text>
          <Text style={styles.headerSubtitle}>Suivi semaine par semaine</Text>

          {currentWeek > 0 && (
            <TouchableOpacity
              style={styles.currentWeekBtn}
              onPress={() => router.push(`/pregnancy/week/${currentWeek}` as any)}
            >
              <Ionicons name="arrow-forward-circle-outline" size={16} color={Colors.white} />
              <Text style={styles.currentWeekBtnText}>Ma semaine actuelle (S{currentWeek})</Text>
            </TouchableOpacity>
          )}
          <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
            <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
          </Svg>
        </LinearGradient>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>

          {/* Banner */}
          <View style={styles.imageBanner}>
            <Image
              source={require('../../assets/images/pregnancy-banner.jpg')}
              style={{ width: width - 32, height: BANNER_H }}
              resizeMode="stretch"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
            />
            <View style={styles.imageBannerInner}>
              <Text style={styles.imageBannerTitle}>Ma Grossesse 🤰</Text>
              <Text style={styles.imageBannerSub}>Développement bébé · Semaine par semaine</Text>
            </View>
          </View>

          {/* Quick access cards */}
          <View style={styles.quickRow}>
            <TouchableOpacity style={[styles.quickCard, { backgroundColor: th.card, borderColor: th.border }]} onPress={() => router.push('/essentials' as any)} activeOpacity={0.85}>
              <LinearGradient colors={['#7C3AED', '#A78BFA']} style={styles.quickIconBg}>
                <Ionicons name="bag-outline" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickCardTitle, { color: th.text }]}>Trousse & Valise</Text>
              <Text style={[styles.quickCardSub, { color: th.textSub }]}>Essentiels maternité</Text>
              <Ionicons name="chevron-forward" size={14} color={th.textSub} style={{ marginTop: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickCard, { backgroundColor: th.card, borderColor: th.border }]} onPress={() => router.push('/journal' as any)} activeOpacity={0.85}>
              <LinearGradient colors={['#4B0082', '#7F00FF']} style={styles.quickIconBg}>
                <Ionicons name="book-outline" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickCardTitle, { color: th.text }]}>Journal</Text>
              <Text style={[styles.quickCardSub, { color: th.textSub }]}>Notes & souvenirs</Text>
              <Ionicons name="chevron-forward" size={14} color={th.textSub} style={{ marginTop: 'auto' }} />
            </TouchableOpacity>
          </View>

          {/* DDP Card */}
          <View style={[styles.ddpCard, { backgroundColor: th.card, borderColor: th.border }]}>
            <View style={styles.ddpHeader}>
              <View style={styles.ddpIconBox}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.ddpInfo}>
                <Text style={styles.ddpLabel}>Date des dernières règles</Text>
                {lastPeriodDate ? (
                  <Text style={[styles.ddpValue, { color: th.text }]}>{lastPeriodDate}</Text>
                ) : (
                  <Text style={styles.ddpEmpty}>Non renseignée</Text>
                )}
              </View>
              <TouchableOpacity style={styles.ddpEditBtn} onPress={() => setShowDDPInput(!showDDPInput)}>
                <Ionicons name={showDDPInput ? 'chevron-up' : 'create-outline'} size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {showDDPInput && (
              <View style={styles.ddpForm}>
                <Text style={styles.ddpFormLabel}>Sélectionnez la date de vos dernières règles</Text>
                <TouchableOpacity style={styles.ddpInputRow} onPress={() => setDatePickerVisible(true)}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.ddpInput, !selectedDate && { color: Colors.textMuted }]}>
                    {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                  </Text>
                  <Ionicons name="chevron-down-outline" size={14} color={Colors.textLight} />
                </TouchableOpacity>
                <DatePickerModal
                  visible={datePickerVisible}
                  onClose={() => setDatePickerVisible(false)}
                  onSelect={handleDateSelected}
                  selectedDate={selectedDate}
                  title="Date des dernières règles"
                  maxDate={new Date()}
                />
                <View style={styles.ddpFormHint}>
                  <Ionicons name="information-circle-outline" size={14} color={Colors.primarySoft} style={{ marginRight: 6 }} />
                  <Text style={styles.ddpHintText}>
                    La date d'accouchement est calculée à 40 semaines (280 jours) à partir des dernières règles.
                  </Text>
                </View>
                <TouchableOpacity style={styles.ddpSaveBtn} onPress={handleSaveDDP}>
                  <LinearGradient colors={Colors.gradient.primary} style={styles.ddpSaveGrad}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
                    <Text style={styles.ddpSaveText}>Enregistrer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {currentWeek > 0 && dueDate && !showDDPInput && (
              <View style={styles.ddpStats}>
                <View style={styles.ddpStat}>
                  <Text style={styles.ddpStatValue}>S{currentWeek}</Text>
                  <Text style={styles.ddpStatLabel}>{trimesterName}</Text>
                </View>
                <View style={styles.ddpStatDivider} />
                <View style={styles.ddpStat}>
                  <Text style={styles.ddpStatValue}>
                    {Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}j
                  </Text>
                  <Text style={styles.ddpStatLabel}>avant le terme</Text>
                </View>
                <View style={styles.ddpStatDivider} />
                <View style={styles.ddpStat}>
                  <Text style={styles.ddpStatValue}>{format(dueDate, 'dd/MM', { locale: fr })}</Text>
                  <Text style={styles.ddpStatLabel}>date prévue</Text>
                </View>
              </View>
            )}
          </View>

          {/* Trimester Filter */}
          <Text style={[styles.sectionTitle, { color: th.text }]}>Semaine par Semaine</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterBtn, { backgroundColor: th.card, borderColor: th.border }, !selectedTrimester && styles.filterBtnActive]}
              onPress={() => setSelectedTrimester(null)}
            >
              <Text style={[styles.filterBtnText, { color: th.textSub }, !selectedTrimester && styles.filterBtnTextActive]}>Tout</Text>
            </TouchableOpacity>
            {([1, 2, 3] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.filterBtn, { backgroundColor: th.card, borderColor: th.border }, selectedTrimester === t && styles.filterBtnActive]}
                onPress={() => setSelectedTrimester(selectedTrimester === t ? null : t)}
              >
                <Text style={[styles.filterBtnText, { color: th.textSub }, selectedTrimester === t && styles.filterBtnTextActive]}>
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
                    <View style={[styles.weekPlain, { backgroundColor: th.card, borderColor: th.border }, isPassed && { backgroundColor: Colors.lilac }]}>
                      <Text style={styles.weekEmoji}>{week.fruitEmoji}</Text>
                      <Text style={[styles.weekNum, { color: th.text }, isPassed && { color: Colors.primary }]}>S{week.week}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </Animated.View>
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
    paddingBottom: 32 + WAVE_H,
    overflow: 'hidden',
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
  ddpCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ddpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ddpIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ddpInfo: {
    flex: 1,
  },
  ddpLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ddpValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  ddpEmpty: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  ddpEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ddpForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ddpFormLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  ddpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  ddpInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  ddpFormHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  ddpHintText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  ddpSaveBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  ddpSaveGrad: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ddpSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  ddpStats: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    justifyContent: 'space-around',
  },
  ddpStat: {
    alignItems: 'center',
  },
  ddpStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  ddpStatLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  ddpStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 14,
    marginTop: 4,
    letterSpacing: 0.2,
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
    justifyContent: 'center',
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
  imageBanner: {
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
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#4B0082',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickCardSub: {
    fontSize: 12,
    lineHeight: 16,
  },
});

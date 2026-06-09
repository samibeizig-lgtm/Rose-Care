import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { getWeekData } from '../../src/data/weeklyData';
import ProgressBar from '../../src/components/ProgressBar';
import { differenceInWeeks, parseISO, addWeeks, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [profile] = useStorage(STORAGE_KEYS.USER_PROFILE, { name: 'Belle Maman', mode: 'pregnant' });
  const [dueDate] = useStorage(STORAGE_KEYS.DUE_DATE, '');
  const [pregnancyStart] = useStorage(STORAGE_KEYS.PREGNANCY_START, '');
  const [babyName] = useStorage(STORAGE_KEYS.BABY_NAME, '');
  const [appointments] = useStorage(STORAGE_KEYS.APPOINTMENTS, []);

  const currentWeek = pregnancyStart
    ? Math.min(40, Math.max(1, differenceInWeeks(new Date(), parseISO(pregnancyStart)) + 1))
    : 0;

  const weekData = currentWeek > 0 ? getWeekData(currentWeek) : null;
  const progress = currentWeek / 40;

  const daysLeft = dueDate
    ? Math.max(0, Math.ceil((parseISO(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const trimesterName = currentWeek <= 12 ? '1er Trimestre' : currentWeek <= 27 ? '2ème Trimestre' : '3ème Trimestre';

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const quickActions = [
    { icon: '🤰', label: 'Ma grossesse', route: '/(tabs)/pregnancy', color: Colors.primaryLight },
    { icon: '💊', label: 'Ma santé', route: '/(tabs)/health', color: '#C8E6C9' },
    { icon: '🧘', label: 'Zen', route: '/(tabs)/zen', color: Colors.zenLight },
    { icon: '🏥', label: 'La Rose', route: '/(tabs)/more', color: Colors.goldLight },
    { icon: '📋', label: 'CNAM', route: '/cnam', color: '#E3F2FD' },
    { icon: '🖼️', label: 'Échographies', route: '/ultrasound', color: '#FFF8E1' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header Hero */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, '#F4A7B5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>Bonjour, {profile?.name || 'Belle Maman'} 🌸</Text>
              <Text style={styles.heroDate}>{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/health/add' as any)}>
              <Ionicons name="add-circle" size={32} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {currentWeek > 0 ? (
            <>
              <View style={styles.weekBadge}>
                <Text style={styles.weekNumber}>Semaine {currentWeek}</Text>
                <Text style={styles.weekTrimester}>{trimesterName}</Text>
              </View>

              {weekData && (
                <View style={styles.heroInfo}>
                  <Text style={styles.heroFruit}>{weekData.fruitEmoji}</Text>
                  <View style={styles.heroInfoText}>
                    <Text style={styles.heroTitle}>{weekData.title}</Text>
                    <Text style={styles.heroSubtitle}>Bébé : {weekData.babyWeight} • {weekData.babyLength}</Text>
                    <Text style={styles.heroSubtitle}>Comme une {weekData.fruitComparison}</Text>
                  </View>
                </View>
              )}

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>Progression de la grossesse</Text>
                  <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                {daysLeft !== null && (
                  <Text style={styles.daysLeft}>
                    {daysLeft === 0 ? '🎉 C\'est le jour J !' : `${daysLeft} jours avant votre date prévue`}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <View style={styles.setupPrompt}>
              <Text style={styles.setupText}>Configurez votre profil pour commencer le suivi</Text>
              <TouchableOpacity style={styles.setupBtn} onPress={() => router.push('/health/add' as any)}>
                <Text style={styles.setupBtnText}>Commencer →</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        <View style={styles.content}>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Accès rapide</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.quickItem, { backgroundColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              >
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Week Tip */}
          {weekData && (
            <View style={styles.tipCard}>
              <LinearGradient colors={['#FFF0F5', '#F8D7E3']} style={styles.tipGradient}>
                <Text style={styles.tipTitle}>💡 Conseil de la semaine {currentWeek}</Text>
                <Text style={styles.tipText}>{weekData.nutritionTip}</Text>
              </LinearGradient>
            </View>
          )}

          {/* Baby Development Teaser */}
          {weekData && (
            <TouchableOpacity
              style={styles.devCard}
              onPress={() => router.push(`/pregnancy/week/${currentWeek}` as any)}
            >
              <LinearGradient colors={[Colors.secondary, Colors.secondaryLight]} style={styles.devGradient}>
                <View style={styles.devHeader}>
                  <Text style={styles.devTitle}>Développement de bébé</Text>
                  <Text style={styles.devArrow}>→</Text>
                </View>
                <Text style={styles.devEmoji}>{weekData.fruitEmoji}</Text>
                <Text style={styles.devText}>{weekData.babyDevelopment[0]}</Text>
                <Text style={styles.devMore}>Voir tous les détails</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Emotional Note */}
          {weekData && (
            <View style={styles.emotionCard}>
              <Text style={styles.emotionTitle}>Message pour toi 💕</Text>
              <Text style={styles.emotionText}>{weekData.emotionalNote}</Text>
            </View>
          )}

          {/* Next Appointment Reminder */}
          <View style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Text style={styles.reminderEmoji}>📅</Text>
            </View>
            <View style={styles.reminderText}>
              <Text style={styles.reminderTitle}>Prochain rendez-vous</Text>
              <Text style={styles.reminderSubtitle}>
                {currentWeek < 14 ? 'Bilan du 1er trimestre' :
                  currentWeek < 22 ? 'Échographie morphologique' :
                    currentWeek < 28 ? 'Test glycémie (HGPO)' :
                      currentWeek < 32 ? 'Écho 3ème trimestre' :
                        'Consultation mensuelle'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/health' as any)}>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Trimester Progress */}
          {currentWeek > 0 && (
            <View style={styles.trimesterCard}>
              <Text style={styles.sectionTitle}>Progression par trimestre</Text>
              <ProgressBar
                progress={Math.min(1, currentWeek / 12)}
                color={Colors.primary}
                label="1er Trimestre (S1-S12)"
                showPercent
              />
              <View style={{ height: 12 }} />
              <ProgressBar
                progress={currentWeek <= 12 ? 0 : Math.min(1, (currentWeek - 12) / 15)}
                color={Colors.secondary}
                label="2ème Trimestre (S13-S27)"
                showPercent
              />
              <View style={{ height: 12 }} />
              <ProgressBar
                progress={currentWeek <= 27 ? 0 : Math.min(1, (currentWeek - 27) / 13)}
                color={Colors.zen}
                label="3ème Trimestre (S28-S40)"
                showPercent
              />
            </View>
          )}

          <View style={{ height: 20 }} />
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
  hero: {
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  heroDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  notifBtn: {
    padding: 4,
  },
  weekBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  weekTrimester: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroFruit: {
    fontSize: 48,
    marginRight: 16,
  },
  heroInfoText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  daysLeft: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  setupPrompt: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  setupText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  setupBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  setupBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
    marginTop: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickItem: {
    width: (width - 52) / 3,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  tipCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tipGradient: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  devCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  devGradient: {
    padding: 20,
  },
  devHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  devTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  devArrow: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
  devEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  devText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 21,
    marginBottom: 8,
  },
  devMore: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
  },
  emotionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  emotionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    backgroundColor: Colors.accent,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderEmoji: {
    fontSize: 22,
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  trimesterCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

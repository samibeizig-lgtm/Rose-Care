import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../../src/theme/colors';
import { useTheme } from '../../../src/theme/ThemeContext';
import { getWeekData } from '../../../src/data/weeklyData';

const SECTION_COLORS = {
  development: ['#4C1D95', '#6D28D9'] as [string, string],
  symptoms: ['#2D1B69', '#6D28D9'] as [string, string],
  todo: [Colors.success, '#81C784'] as [string, string],
  avoid: [Colors.error, '#EF9A9A'] as [string, string],
  nutrition: ['#6D28D9', '#8B5CF6'] as [string, string],
  medical: ['#2D1B69', '#4C1D95'] as [string, string],
};

export default function WeekDetailScreen() {
  const { isDark, th } = useTheme();
  const { week } = useLocalSearchParams<{ week: string }>();
  const router = useRouter();
  const weekNumber = parseInt(week || '1');
  const data = getWeekData(weekNumber);

  const [expandedSection, setExpandedSection] = useState<string | null>('development');

  if (!data) return null;

  const trimesterColor =
    data.trimester === 1 ? Colors.primaryDeep :
    data.trimester === 2 ? Colors.primary : Colors.primarySoft;

  const sections = [
    {
      id: 'development',
      title: '👶 Développement de Bébé',
      items: data.babyDevelopment,
      colors: SECTION_COLORS.development,
    },
    {
      id: 'symptoms',
      title: '🤰 Symptômes de Maman',
      items: data.momSymptoms,
      colors: SECTION_COLORS.symptoms,
    },
    {
      id: 'todo',
      title: '✅ À Faire cette Semaine',
      items: data.todoList,
      colors: SECTION_COLORS.todo,
    },
    {
      id: 'avoid',
      title: '⚠️ À Éviter',
      items: data.avoidList,
      colors: SECTION_COLORS.avoid,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: th.bg }]} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[trimesterColor, Colors.primaryLight]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroNav}>
          {weekNumber > 1 && (
            <TouchableOpacity style={styles.navBtn} onPress={() => router.replace(`/pregnancy/week/${weekNumber - 1}` as any)}>
              <Text style={styles.navBtnText}>← S{weekNumber - 1}</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {weekNumber < 40 && (
            <TouchableOpacity style={styles.navBtn} onPress={() => router.replace(`/pregnancy/week/${weekNumber + 1}` as any)}>
              <Text style={styles.navBtnText}>S{weekNumber + 1} →</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.heroCenter}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
            <Text style={styles.heroEmoji}>{data.fruitEmoji}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Semaine {weekNumber}</Text>
            <Text style={styles.heroTrimester}>{data.trimester}ème trimestre</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{data.title}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Poids</Text>
            <Text style={styles.statValue}>{data.babyWeight}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Taille</Text>
            <Text style={styles.statValue}>{data.babyLength}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Comme</Text>
            <Text style={styles.statValue}>{data.fruitComparison}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Sections */}
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.sectionCard}
            onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={expandedSection === section.id ? section.colors : [th.card, th.card]}
              style={[styles.sectionHeader, { borderColor: th.border }]}
            >
              <Text style={[
                styles.sectionTitle,
                { color: th.text },
                expandedSection === section.id && { color: Colors.white }
              ]}>
                {section.title}
              </Text>
              <Text style={[
                styles.sectionChevron,
                { color: th.textMuted },
                expandedSection === section.id && { color: Colors.white }
              ]}>
                {expandedSection === section.id ? '▲' : '▼'}
              </Text>
            </LinearGradient>

            {expandedSection === section.id && (
              <View style={[styles.sectionBody, { backgroundColor: th.card, borderColor: th.border }]}>
                {section.items.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: section.colors[0] }]} />
                    <Text style={[styles.listItemText, { color: th.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Nutrition */}
        <View style={styles.infoCard}>
          <LinearGradient colors={['#6D28D9', '#8B5CF6']} style={styles.infoGradient}>
            <Text style={styles.infoIcon}>🥗</Text>
            <Text style={styles.infoTitle}>Nutrition cette semaine</Text>
            <Text style={styles.infoText}>{data.nutritionTip}</Text>
          </LinearGradient>
        </View>

        {/* Medical Note */}
        <View style={styles.infoCard}>
          <View style={[styles.medicalCard, { backgroundColor: th.infoBox }]}>
            <Text style={styles.infoIcon}>🩺</Text>
            <Text style={styles.medicalTitle}>Note médicale</Text>
            <Text style={[styles.medicalText, { color: th.text }]}>{data.medicalNote}</Text>
          </View>
        </View>

        {/* Emotional Note */}
        <View style={[styles.emotionCard, { backgroundColor: th.infoBox, borderColor: th.border }]}>
          <Text style={[styles.emotionText, { color: th.text }]}>{data.emotionalNote}</Text>
        </View>

        {/* Navigation Bottom */}
        <View style={styles.bottomNav}>
          {weekNumber > 1 && (
            <TouchableOpacity
              style={[styles.bottomNavBtn, { marginRight: 8, backgroundColor: th.card, borderColor: th.border }]}
              onPress={() => router.replace(`/pregnancy/week/${weekNumber - 1}` as any)}
            >
              <Text style={[styles.bottomNavText, { color: th.text }]}>← Semaine {weekNumber - 1}</Text>
            </TouchableOpacity>
          )}
          {weekNumber < 40 && (
            <TouchableOpacity
              style={[styles.bottomNavBtn, styles.bottomNavBtnPrimary]}
              onPress={() => router.replace(`/pregnancy/week/${weekNumber + 1}` as any)}
            >
              <Text style={[styles.bottomNavText, { color: Colors.white }]}>Semaine {weekNumber + 1} →</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroNav: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  navBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  heroCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroBadge: {},
  heroBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  heroTrimester: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  content: {
    padding: 16,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionChevron: {
    fontSize: 12,
    color: Colors.textLight,
  },
  sectionBody: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.border,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoGradient: {
    padding: 16,
  },
  infoIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
  },
  medicalCard: {
    backgroundColor: Colors.lilac,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  medicalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  medicalText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  emotionCard: {
    backgroundColor: Colors.lilac,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emotionText: {
    fontSize: 15,
    color: Colors.primaryDark,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  bottomNavBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomNavBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bottomNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});

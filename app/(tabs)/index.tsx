import React, { useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { getWeekData } from '../../src/data/weeklyData';
import ProgressBar from '../../src/components/ProgressBar';
import { differenceInWeeks, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const WAVE_H = 56;

const dailyTips = [
  'Boire 8 à 10 verres d\'eau par jour aide votre corps à former le liquide amniotique.',
  'Les oméga-3 (poissons gras, noix) favorisent le développement cérébral de bébé.',
  'Le fer est essentiel pendant la grossesse. Privilégiez lentilles, épinards et viande rouge.',
  'Une marche de 30 min par jour améliore la circulation et réduit les œdèmes.',
  'L\'acide folique est crucial dans les 12 premières semaines pour prévenir les malformations.',
  'Dormir sur le côté gauche améliore la circulation vers le placenta.',
  'Le calcium (produits laitiers, amandes) renforce les os de bébé et les vôtres.',
  'Évitez la charcuterie crue et les fromages à pâte molle (listériose).',
  'La vitamine D se synthétise avec 20 min de soleil quotidien.',
  'Le magnésium aide à réduire les crampes nocturnes et l\'anxiété.',
  'Limitez la caféine à 200 mg/jour (2 cafés max).',
  'Les légumineuses apportent protéines et fibres sans surcharger le foie.',
  'Massez votre ventre avec de l\'huile d\'argan pour prévenir les vergetures.',
  'Le zinc (fruits de mer, graines de courge) soutient le système immunitaire.',
  'Évitez les positions allongées sur le dos après 20 SA (compression de la veine cave).',
  'La piscine est l\'activité physique la plus douce et recommandée en grossesse.',
  'Mangez des petites portions fréquentes pour éviter les nausées.',
  'La vitamine B6 (bananes, poulet) atténue les nausées du matin.',
  'Surveillez votre tension : > 140/90 nécessite une consultation urgente.',
  'Les dattes consommées en fin de grossesse peuvent faciliter l\'accouchement.',
  'Préparez votre périnée avec des exercices de Kegel dès le 1er trimestre.',
  'Le gingembre en infusion est un remède naturel contre les nausées.',
  'Portez des chaussures confortables pour éviter les douleurs au dos.',
  'Notez les mouvements de bébé : 10 mouvements en 2h est rassurant après 28 SA.',
  'L\'art-thérapie et la musique réduisent le stress prénatal.',
  'Votre bébé reconnaît votre voix dès la semaine 18. Parlez-lui !',
  'La framboise en fin de grossesse (infusion feuilles) prépare l\'utérus.',
  'Préparez votre sac de maternité à partir de la semaine 36.',
  'Consultez un ostéopathe en cas de douleurs lombaires persistantes.',
  'Profitez de cette période : prendre soin de vous EST prendre soin de bébé.',
];

const breathingDaily = [
  { title: 'Cohérence cardiaque', desc: 'Inspirez 5s, expirez 5s. Répétez 6 min. Idéal le matin au réveil.', icon: 'radio-button-on-outline' as const },
  { title: 'Technique 4-7-8', desc: 'Inspirez 4s, retenez 7s, expirez 8s. Parfait avant de dormir.', icon: 'water-outline' as const },
  { title: 'Respiration abdominale', desc: 'Posez une main sur le ventre, inspirez profondément 3 fois. Oxygène bébé.', icon: 'leaf-outline' as const },
  { title: 'Souffle naturel', desc: 'Observez votre respiration sans la modifier. 5 minutes de pleine conscience.', icon: 'cloud-outline' as const },
  { title: 'Expiration longue', desc: 'Inspirez 3s, expirez 6s. L\'expiration longue active le système parasympathique.', icon: 'arrow-down-circle-outline' as const },
  { title: 'Respiration en carré', desc: 'Inspirez 4s, retenez 4s, expirez 4s, retenez 4s. Equilibre le mental.', icon: 'square-outline' as const },
  { title: 'Bourdonnement (Bhramari)', desc: 'Inspirez et expirez en faisant vibrer les lèvres. Calme l\'anxiété.', icon: 'musical-note-outline' as const },
];

const dailyInfo = [
  'À la semaine 6, le cœur de bébé bat déjà — 150 à 170 fois par minute !',
  'À 12 semaines, tous les organes de bébé sont formés. C\'est la fin de la période embryonnaire.',
  'Le placenta produit de la progestérone qui détend les muscles, causant parfois des brûlures d\'estomac.',
  'Bébé perçoit la lumière à partir de la semaine 25 et peut fermer les yeux.',
  'Le vernix caseosa, un enduit blanc protecteur, recouvre la peau de bébé à partir de 20 SA.',
  'Votre volume sanguin augmente de 50% pendant la grossesse pour nourrir le placenta.',
  'Les jumeaux dizygotes (faux jumeaux) ont chacun leur propre placenta.',
  'Le liquide amniotique est renouvelé toutes les 3 heures.',
  'Bébé pratique la déglutition dès 11 SA en avalant du liquide amniotique.',
  'Les empreintes digitales de bébé se forment entre 17 et 19 SA.',
  'Le cerveau de bébé produit 250 000 nouvelles cellules par minute au 2ème trimestre.',
  'À partir de 20 SA, bébé entend la musique et la voix de sa maman.',
  'La lanugo (duvet fin) couvre le corps de bébé à partir de 14 SA pour maintenir la chaleur.',
  'Les reins de bébé fonctionnent dès 11 SA et produisent de l\'urine.',
  'Le colostrum, premier lait ultra-riche, peut s\'écouler dès le 2ème trimestre.',
  'Bébé fait ses premiers mouvements respiratoires (exercice) vers 10 SA.',
  'La couleur des yeux de bébé peut changer dans les 6 mois suivant la naissance.',
  'Une grossesse multiple double le risque de prématurité — suivi renforcé recommandé.',
  'Le méconium, premier selles de bébé, se forme dès 16 SA mais ne sort qu\'à la naissance.',
  'À terme, le placenta pèse environ 500g et mesure 20 cm.',
  'Bébé ouvre et ferme les poings, suce son pouce dès 15 SA.',
  'Le fer stocké in utero suffit pour les 6 premiers mois de vie.',
  'Les contractions de Braxton-Hicks préparent l\'utérus à l\'accouchement dès 20 SA.',
  'À 32 SA, bébé peut faire des rêves (cycles de sommeil paradoxal détectables).',
  'La position idéale pour l\'accouchement est la tête en bas (présentation céphalique).',
  'Le fœtus développe des préférences gustatives selon l\'alimentation maternelle.',
  'À 37 SA, la grossesse est considérée à terme.',
  'Le vernix protège la peau de bébé contre le liquide amniotique.',
  'Le cordon ombilical contient deux artères et une veine.',
  'Après la naissance, bébé reconnaît votre voix et votre odeur dès les premières heures.',
];

const MODULES = [
  { icon: 'heart-outline', label: 'Grossesse', colors: ['#4B0082', '#7F00FF'] as [string, string], route: '/(tabs)/pregnancy' },
  { icon: 'sparkles-outline', label: 'Fertilité', colors: ['#7F00FF', '#9933FF'] as [string, string], route: '/(tabs)/fertilite' },
  { icon: 'pulse-outline', label: 'Santé', colors: ['#5B00B5', '#7F00FF'] as [string, string], route: '/(tabs)/health' },
  { icon: 'leaf-outline', label: 'Zen', colors: ['#4B0082', '#5B21B6'] as [string, string], route: '/(tabs)/zen' },
  { icon: 'bag-outline', label: 'Essentiels', colors: ['#7C3AED', '#A78BFA'] as [string, string], route: '/essentials' },
  { icon: 'calendar-outline', label: 'Calendrier', colors: ['#5B21B6', '#7F00FF'] as [string, string], route: '/menstrual' },
];

const MODULE_W = (width - 48 - 12) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [profile] = useStorage(STORAGE_KEYS.USER_PROFILE, { name: 'Belle Maman', mode: 'pregnant' });
  const [dueDate] = useStorage(STORAGE_KEYS.DUE_DATE, '');
  const [pregnancyStart] = useStorage(STORAGE_KEYS.PREGNANCY_START, '');

  const currentWeek = pregnancyStart
    ? Math.min(40, Math.max(1, differenceInWeeks(new Date(), parseISO(pregnancyStart)) + 1))
    : 0;

  const weekData = currentWeek > 0 ? getWeekData(currentWeek) : null;
  const progress = currentWeek / 40;

  const daysLeft = dueDate
    ? Math.max(0, Math.ceil((parseISO(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const trimesterName = currentWeek <= 12 ? '1er Trim.' : currentWeek <= 27 ? '2ème Trim.' : '3ème Trim.';

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const dayIndex = (new Date().getDate() - 1) % dailyTips.length;
  const breathIndex = new Date().getDay() % breathingDaily.length;
  const infoIndex = (new Date().getDate() - 1) % dailyInfo.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ─── Hero header ─── */}
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            {/* Top row */}
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.greeting}>Bonjour, {profile?.name || 'Belle Maman'} 🌸</Text>
                <Text style={styles.heroDate}>{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</Text>
              </View>
              <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/health/add' as any)}>
                <Ionicons name="person-outline" size={22} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Stats row */}
            {currentWeek > 0 ? (
              <View style={styles.statsRow}>
                <View style={styles.statChip}>
                  <Text style={styles.statValue}>S{currentWeek}</Text>
                  <Text style={styles.statLabel}>Semaine</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statChip}>
                  <Text style={styles.statValue}>{trimesterName}</Text>
                  <Text style={styles.statLabel}>Trimestre</Text>
                </View>
                {daysLeft !== null && (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>{daysLeft}j</Text>
                      <Text style={styles.statLabel}>Restants</Text>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <TouchableOpacity style={styles.setupChip} onPress={() => router.push('/health/add' as any)}>
                <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.setupChipText}>Configurer mon profil</Text>
              </TouchableOpacity>
            )}

            {/* Progress bar */}
            {currentWeek > 0 && (
              <View style={styles.progressWrap}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>Progression grossesse</Text>
                  <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
            )}
          </LinearGradient>

          {/* Wave at bottom of hero */}
          <Svg
            width={width}
            height={WAVE_H}
            style={{ marginTop: -1 }}
            viewBox={`0 0 ${width} ${WAVE_H}`}
          >
            <Path
              d={`M0,0 Q${width * 0.5},${WAVE_H} ${width},0 L${width},${WAVE_H} L0,${WAVE_H} Z`}
              fill="#FFFFFF"
            />
          </Svg>
        </View>

        {/* ─── White content ─── */}
        <View style={styles.content}>

          {/* Modules grid */}
          <Text style={styles.sectionLabel}>MODULES</Text>
          <View style={styles.modulesGrid}>
            {MODULES.map((mod) => (
              <TouchableOpacity
                key={mod.label}
                style={styles.moduleCard}
                onPress={() => router.push(mod.route as any)}
                activeOpacity={0.82}
              >
                <LinearGradient
                  colors={mod.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moduleGrad}
                >
                  <View style={styles.moduleIconWrap}>
                    <Ionicons name={mod.icon as any} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.moduleLabel}>{mod.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conseil du jour */}
          <Text style={styles.sectionLabel}>AUJOURD'HUI</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lilac }]}>
                <Ionicons name="bulb-outline" size={18} color={Colors.primaryDeep} />
              </View>
              <Text style={styles.cardTitle}>Conseil du jour</Text>
            </View>
            <Text style={styles.cardText}>{dailyTips[dayIndex]}</Text>
          </View>

          {/* Exercice respiration */}
          <TouchableOpacity
            style={styles.breathCard}
            onPress={() => router.push('/(tabs)/zen' as any)}
            activeOpacity={0.9}
          >
            <LinearGradient colors={Colors.gradient.soft} style={styles.breathGrad}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name={breathingDaily[breathIndex].icon} size={18} color={Colors.white} />
                </View>
                <Text style={[styles.cardTitle, { color: Colors.white }]}>Exercice du jour</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />
              </View>
              <Text style={styles.breathTitle}>{breathingDaily[breathIndex].title}</Text>
              <Text style={styles.breathDesc}>{breathingDaily[breathIndex].desc}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Info du jour */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.infoLight }]}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
              </View>
              <Text style={styles.cardTitle}>Le saviez-vous ?</Text>
            </View>
            <Text style={styles.cardText}>{dailyInfo[infoIndex]}</Text>
          </View>

          {/* Week tip & baby dev */}
          {weekData && (
            <>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: Colors.lilac }]}>
                    <Ionicons name="sparkles-outline" size={18} color={Colors.primaryDeep} />
                  </View>
                  <Text style={styles.cardTitle}>Semaine {currentWeek}</Text>
                </View>
                <Text style={styles.cardText}>{weekData.nutritionTip}</Text>
              </View>

              <TouchableOpacity
                style={styles.devCard}
                onPress={() => router.push(`/pregnancy/week/${currentWeek}` as any)}
                activeOpacity={0.9}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.devGrad}>
                  <View style={styles.devRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.devTitle}>Développement de bébé</Text>
                      <Text style={styles.devSub}>{weekData.babyWeight} · {weekData.babyLength}</Text>
                      <Text style={styles.devText}>{weekData.babyDevelopment[0]}</Text>
                    </View>
                    <Text style={styles.devEmoji}>{weekData.fruitEmoji}</Text>
                  </View>
                  <View style={styles.devFooter}>
                    <Text style={styles.devMore}>Voir tous les détails</Text>
                    <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.7)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: Colors.roseLight }]}>
                    <Ionicons name="heart-outline" size={18} color={Colors.roseDark} />
                  </View>
                  <Text style={styles.cardTitle}>Message pour toi</Text>
                </View>
                <Text style={[styles.cardText, { fontStyle: 'italic' }]}>{weekData.emotionalNote}</Text>
              </View>
            </>
          )}

          {/* Prochain RDV */}
          <Text style={styles.sectionLabel}>RENDEZ-VOUS</Text>
          <TouchableOpacity
            style={styles.reminderCard}
            onPress={() => router.push('/(tabs)/health' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.reminderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lilac, width: 48, height: 48, borderRadius: 24 }]}>
                <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>Prochain rendez-vous</Text>
                <Text style={styles.reminderSub}>
                  {currentWeek < 14 ? 'Bilan du 1er trimestre' :
                    currentWeek < 22 ? 'Échographie morphologique' :
                      currentWeek < 28 ? 'Test glycémie (HGPO)' :
                        currentWeek < 32 ? 'Écho 3ème trimestre' :
                          'Consultation mensuelle'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Trimester progress */}
          {currentWeek > 0 && (
            <>
              <Text style={styles.sectionLabel}>PROGRESSION</Text>
              <View style={styles.card}>
                <ProgressBar progress={Math.min(1, currentWeek / 12)} color={Colors.primary} label="1er Trimestre (S1–S12)" showPercent />
                <View style={{ height: 12 }} />
                <ProgressBar progress={currentWeek <= 12 ? 0 : Math.min(1, (currentWeek - 12) / 15)} color={Colors.primaryLight} label="2ème Trimestre (S13–S27)" showPercent />
                <View style={{ height: 12 }} />
                <ProgressBar progress={currentWeek <= 27 ? 0 : Math.min(1, (currentWeek - 27) / 13)} color={Colors.mauve} label="3ème Trimestre (S28–S40)" showPercent />
              </View>
            </>
          )}

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Hero */
  heroWrap: {
    overflow: 'visible',
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  heroDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  setupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  setupChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressWrap: {
    marginTop: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    backgroundColor: Colors.lavender,
    borderRadius: 4,
  },

  /* Content */
  content: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 12,
  },

  /* Modules grid */
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: MODULE_W,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  moduleGrad: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  moduleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  moduleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* White cards */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cardText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  /* Breathing card */
  breathCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  breathGrad: {
    padding: 18,
  },
  breathTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 5,
  },
  breathDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
  },

  /* Dev card */
  devCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  devGrad: {
    padding: 18,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  devTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 3,
  },
  devSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 6,
  },
  devText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  devEmoji: {
    fontSize: 44,
    marginLeft: 12,
  },
  devFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  devMore: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },

  /* Reminder card */
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reminderSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

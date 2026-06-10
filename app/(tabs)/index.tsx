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
import Colors from '../../src/theme/colors';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { getWeekData } from '../../src/data/weeklyData';
import ProgressBar from '../../src/components/ProgressBar';
import { differenceInWeeks, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const dayIndex = (new Date().getDate() - 1) % dailyTips.length;
  const breathIndex = new Date().getDay() % breathingDaily.length;
  const infoIndex = (new Date().getDate() - 1) % dailyInfo.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header Hero */}
        <LinearGradient
          colors={Colors.gradient.primary}
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
              <Ionicons name="add-circle-outline" size={32} color={Colors.white} />
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

          {/* Conseil du jour */}
          <View style={styles.dailyCard}>
            <LinearGradient colors={Colors.gradient.card} style={styles.dailyCardGrad}>
              <View style={styles.dailyTitleRow}>
                <View style={styles.dailyIconBox}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.primaryDeep} />
                </View>
                <Text style={styles.dailyTitle}>Conseil du jour</Text>
              </View>
              <Text style={styles.dailyText}>{dailyTips[dayIndex]}</Text>
            </LinearGradient>
          </View>

          {/* Exercice respiration du jour */}
          <View style={styles.breathCard}>
            <LinearGradient colors={Colors.gradient.soft} style={styles.breathCardGrad}>
              <View style={styles.dailyTitleRow}>
                <View style={[styles.dailyIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name={breathingDaily[breathIndex].icon} size={18} color={Colors.white} />
                </View>
                <Text style={[styles.dailyTitle, { color: Colors.white }]}>Exercice respiration du jour</Text>
              </View>
              <Text style={styles.breathTitle}>{breathingDaily[breathIndex].title}</Text>
              <Text style={styles.breathDesc}>{breathingDaily[breathIndex].desc}</Text>
              <TouchableOpacity
                style={styles.breathBtn}
                onPress={() => router.push('/(tabs)/zen' as any)}
              >
                <Ionicons name="play-circle-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.breathBtnText}>Pratiquer maintenant</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Information du jour */}
          <View style={styles.infoCard}>
            <View style={styles.infoTitleRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoTitle}>Information du jour</Text>
            </View>
            <Text style={styles.infoText}>{dailyInfo[infoIndex]}</Text>
          </View>

          {/* Week Tip */}
          {weekData && (
            <View style={styles.tipCard}>
              <LinearGradient colors={Colors.gradient.card} style={styles.tipGradient}>
                <View style={styles.tipTitleRow}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.primaryDark} />
                  <Text style={styles.tipTitle}>Conseil de la semaine {currentWeek}</Text>
                </View>
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
              <LinearGradient colors={Colors.gradient.soft} style={styles.devGradient}>
                <View style={styles.devHeader}>
                  <Text style={styles.devTitle}>Développement de bébé</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
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
              <View style={styles.emotionTitleRow}>
                <Ionicons name="heart-outline" size={18} color={Colors.primary} />
                <Text style={styles.emotionTitle}>Message pour toi</Text>
              </View>
              <Text style={styles.emotionText}>{weekData.emotionalNote}</Text>
            </View>
          )}

          {/* Next Appointment Reminder */}
          <View style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
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
                color={Colors.primaryLight}
                label="2ème Trimestre (S13-S27)"
                showPercent
              />
              <View style={{ height: 12 }} />
              <ProgressBar
                progress={currentWeek <= 27 ? 0 : Math.min(1, (currentWeek - 27) / 13)}
                color={Colors.mauve}
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.lavender,
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
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
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 14,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  dailyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  dailyCardGrad: {
    padding: 20,
  },
  dailyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dailyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.3,
  },
  dailyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  breathCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  breathCardGrad: {
    padding: 20,
  },
  breathTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  breathDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 14,
  },
  breathBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  breathBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.mauve,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  tipCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  tipGradient: {
    padding: 20,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryDark,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
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
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  emotionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emotionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
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
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    backgroundColor: Colors.lilac,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

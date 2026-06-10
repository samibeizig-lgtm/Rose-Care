import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useStorage, storage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { getWeekData } from '../../src/data/weeklyData';
import ProgressBar from '../../src/components/ProgressBar';
import DrawerMenu from '../../src/components/DrawerMenu';
import { differenceInWeeks, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const YEARS = Array.from({ length: 60 }, (_, i) => String(2006 - i));
const ITEM_H = 44;

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
  'Le méconium, premières selles de bébé, se forme dès 16 SA mais ne sort qu\'à la naissance.',
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

function WheelCol({ items, selectedIndex, onSelect, colWidth }: { items: string[]; selectedIndex: number; onSelect: (i: number) => void; colWidth: number }) {
  const ref = useRef<FlatList>(null);
  useEffect(() => {
    ref.current?.scrollToIndex({ index: selectedIndex, animated: false });
  }, []);
  return (
    <View style={{ width: colWidth, height: ITEM_H * 5, overflow: 'hidden' }}>
      <View style={[{ position: 'absolute', left: 4, right: 4, height: ITEM_H, top: ITEM_H * 2, backgroundColor: 'rgba(127,0,255,0.1)', borderRadius: 8, zIndex: 1 }]} pointerEvents="none" />
      <FlatList
        ref={ref}
        data={items}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({ length: ITEM_H, offset: ITEM_H * index, index })}
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          onSelect(Math.max(0, Math.min(idx, items.length - 1)));
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => { ref.current?.scrollToIndex({ index, animated: true }); onSelect(index); }}
            style={{ height: ITEM_H, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ fontSize: index === selectedIndex ? 17 : 14, color: index === selectedIndex ? Colors.primary : 'rgba(30,27,75,0.4)', fontWeight: index === selectedIndex ? '700' : '400' }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [profile, setProfile] = useStorage(STORAGE_KEYS.USER_PROFILE, { name: 'Belle Maman', mode: 'pregnant' });
  const [dueDate] = useStorage(STORAGE_KEYS.DUE_DATE, '');
  const [pregnancyStart] = useStorage(STORAGE_KEYS.PREGNANCY_START, '');

  // Profile edit state
  const [editPrenom, setEditPrenom] = useState('');
  const [editNom, setEditNom] = useState('');
  const [editDayIdx, setEditDayIdx] = useState(14);
  const [editMonthIdx, setEditMonthIdx] = useState(0);
  const [editYearIdx, setEditYearIdx] = useState(25);

  // Random indices per launch
  const [indices] = useState(() => ({
    tip: Math.floor(Math.random() * dailyTips.length),
    breath: Math.floor(Math.random() * breathingDaily.length),
    info: Math.floor(Math.random() * dailyInfo.length),
  }));

  // Card entrance animation
  const cardAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(cardAnim, { toValue: 1, duration: 600, useNativeDriver: true, delay: 200 }).start();
  }, []);

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

  const openProfileEdit = () => {
    const p = profile as any;
    setEditPrenom(p?.name && p.name !== 'Belle Maman' ? p.name : '');
    setEditNom(p?.lastName || '');
    const bd = p?.birthDate || '';
    if (bd) {
      const parts = bd.split('/');
      if (parts.length === 3) {
        setEditDayIdx(DAYS.indexOf(parts[0].padStart(2, '0')));
        setEditMonthIdx(parseInt(parts[1], 10) - 1);
        setEditYearIdx(YEARS.indexOf(parts[2]));
      }
    }
    setProfileModalVisible(true);
  };

  const saveProfile = async () => {
    const birthDate = `${DAYS[editDayIdx]}/${String(editMonthIdx + 1).padStart(2, '0')}/${YEARS[editYearIdx]}`;
    const updated = { ...(profile as any), name: editPrenom || 'Belle Maman', lastName: editNom, birthDate, mode: 'pregnant' };
    await setProfile(updated);
    await storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    setProfileModalVisible(false);
  };

  const colW = (width - 80) / 3;

  const cardStyle = {
    opacity: cardAnim,
    transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ─── Hero ─── */}
        <LinearGradient colors={Colors.gradient.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
              <Ionicons name="menu" size={26} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.heroGreeting}>
              <Text style={styles.greeting}>Bonjour, {(profile as any)?.name || 'Belle Maman'} 🌸</Text>
              <Text style={styles.heroDate}>{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</Text>
            </View>
          </View>

          {currentWeek > 0 ? (
            <>
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
              <View style={styles.progressWrap}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>Progression grossesse</Text>
                  <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
            </>
          ) : null}

          {/* Wave */}
          <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
            <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill="#FFFFFF" />
          </Svg>
        </LinearGradient>

        {/* ─── White content ─── */}
        <Animated.View style={[styles.content, cardStyle]}>

          {/* Statistique grossesse motivationnelle */}
          {daysLeft !== null && daysLeft > 0 && (
            <View style={styles.pregnancyStatCard}>
              <Ionicons name="heart" size={18} color={Colors.rose} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.pregnancyStatText}>Courage ! Il ne reste que</Text>
                <Text style={styles.pregnancyStatDays}>{daysLeft} jours avant la naissance 🌸</Text>
              </View>
            </View>
          )}

          <Text style={styles.sectionLabel}>AUJOURD'HUI</Text>

          {/* Conseil du jour */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.lilac }]}>
                <Ionicons name="bulb-outline" size={18} color={Colors.primaryDeep} />
              </View>
              <Text style={styles.cardTitle}>Conseil du jour</Text>
            </View>
            <Text style={styles.cardText}>{dailyTips[indices.tip]}</Text>
          </View>

          {/* Exercice du jour */}
          <TouchableOpacity style={styles.breathCard} onPress={() => router.push('/(tabs)/zen' as any)} activeOpacity={0.9}>
            <LinearGradient colors={Colors.gradient.soft} style={styles.breathGrad}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name={breathingDaily[indices.breath].icon} size={18} color={Colors.white} />
                </View>
                <Text style={[styles.cardTitle, { color: Colors.white }]}>Exercice du jour</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />
              </View>
              <Text style={styles.breathTitle}>{breathingDaily[indices.breath].title}</Text>
              <Text style={styles.breathDesc}>{breathingDaily[indices.breath].desc}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Le saviez-vous */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.infoLight }]}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
              </View>
              <Text style={styles.cardTitle}>Le saviez-vous ?</Text>
            </View>
            <Text style={styles.cardText}>{dailyInfo[indices.info]}</Text>
          </View>

          {/* Baby dev */}
          {weekData && (
            <>
              <Text style={styles.sectionLabel}>BÉBÉ CETTE SEMAINE</Text>
              <TouchableOpacity
                style={styles.devCard}
                onPress={() => router.push(`/pregnancy/week/${currentWeek}` as any)}
                activeOpacity={0.9}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.devGrad}>
                  <View style={styles.devRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.devTitle}>Développement — Semaine {currentWeek}</Text>
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
                  <View style={[styles.iconCircle, { backgroundColor: Colors.lilac }]}>
                    <Ionicons name="sparkles-outline" size={18} color={Colors.primaryDeep} />
                  </View>
                  <Text style={styles.cardTitle}>Conseil semaine {currentWeek}</Text>
                </View>
                <Text style={styles.cardText}>{weekData.nutritionTip}</Text>
              </View>

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

          {/* Rendez-vous */}
          <Text style={styles.sectionLabel}>RENDEZ-VOUS</Text>
          <TouchableOpacity style={styles.reminderCard} onPress={() => router.push('/(tabs)/health' as any)} activeOpacity={0.85}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.lilac, width: 48, height: 48, borderRadius: 24 }]}>
              <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.reminderTitle}>Prochain rendez-vous</Text>
              <Text style={styles.reminderSub}>
                {currentWeek < 14 ? 'Bilan du 1er trimestre' : currentWeek < 22 ? 'Échographie morphologique' : currentWeek < 28 ? 'Test glycémie (HGPO)' : currentWeek < 32 ? 'Écho 3ème trimestre' : 'Consultation mensuelle'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Progression trimestres */}
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
        </Animated.View>
      </ScrollView>

      {/* ─── Drawer ─── */}
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} onOpenProfile={openProfileEdit} />

      {/* ─── Profile edit modal ─── */}
      <Modal visible={profileModalVisible} transparent animationType="slide" onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mon Profil</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={editPrenom}
              onChangeText={setEditPrenom}
              placeholder="Votre prénom"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={editNom}
              onChangeText={setEditNom}
              placeholder="Votre nom"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Date de naissance</Text>
            <View style={styles.wheelRow}>
              <WheelCol items={DAYS} selectedIndex={editDayIdx} onSelect={setEditDayIdx} colWidth={colW} />
              <WheelCol items={MONTHS} selectedIndex={editMonthIdx} onSelect={setEditMonthIdx} colWidth={colW} />
              <WheelCol items={YEARS} selectedIndex={editYearIdx} onSelect={setEditYearIdx} colWidth={colW} />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
              <LinearGradient colors={Colors.gradient.primary} style={styles.saveBtnGrad}>
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: WAVE_H + 16,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGreeting: { flex: 1 },
  greeting: { fontSize: 19, fontWeight: '700', color: Colors.white },
  heroDate: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, textTransform: 'capitalize' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statChip: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.22)' },

  setupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  setupChipText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  progressWrap: { marginTop: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  progressPct: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  progressTrack: { height: 7, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 7, backgroundColor: Colors.lavender, borderRadius: 4 },

  content: { paddingHorizontal: 20, backgroundColor: '#FFFFFF' },

  pregnancyStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.roseLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.rose + '40',
  },
  pregnancyStatText: { fontSize: 12, color: Colors.roseDark, fontWeight: '500' },
  pregnancyStatDays: { fontSize: 15, fontWeight: '800', color: Colors.roseDark },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  breathCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 14, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 6 },
  breathGrad: { padding: 18 },
  breathTitle: { fontSize: 16, fontWeight: '700', color: Colors.white, marginBottom: 5 },
  breathDesc: { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 20 },

  devCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 14, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 6 },
  devGrad: { padding: 18 },
  devRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  devTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, marginBottom: 3 },
  devSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 },
  devText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  devEmoji: { fontSize: 44, marginLeft: 12 },
  devFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  devMore: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' },

  reminderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 14, shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  reminderSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  inputLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: Colors.lilac, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.text, marginBottom: 16 },
  wheelRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
});

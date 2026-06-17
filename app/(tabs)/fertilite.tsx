import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Dimensions, Modal, TextInput, Alert, Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useTheme } from '../../src/theme/ThemeContext';
import { useStorage, storage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { addDays, format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePickerModal from '../../src/components/DatePickerModal';
import { useFocusEffect, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

const cyclePhases = [
  { name: 'Menstruation', days: 'J1 – J5', icon: 'water-outline', desc: 'Début du cycle. Le corps élimine la muqueuse utérine.' },
  { name: 'Phase folliculaire', days: 'J6 – J13', icon: 'sunny-outline', desc: 'Les follicules mûrissent. Le taux d\'œstrogènes augmente.' },
  { name: 'Ovulation', days: 'J14', icon: 'sparkles-outline', desc: 'Libération de l\'ovule. Pic de fertilité sur 12 à 24h.' },
  { name: 'Phase lutéale', days: 'J15 – J28', icon: 'moon-outline', desc: 'Le corps se prépare à une éventuelle grossesse.' },
];

const conceptionTips = [
  { icon: 'calendar-outline', title: 'Connaître son cycle', desc: 'Suivez vos cycles pendant 3 mois pour identifier votre fenêtre fertile.' },
  { icon: 'nutrition-outline', title: 'Alimentation', desc: 'Folates, zinc, vitamines D & B9 améliorent la qualité des ovocytes.' },
  { icon: 'body-outline', title: 'Mode de vie', desc: 'Évitez tabac, alcool, stress excessif et maintien d\'un poids santé.' },
  { icon: 'time-outline', title: 'Timing des rapports', desc: 'Les 5 jours avant l\'ovulation et le jour J sont les plus fertiles.' },
  { icon: 'medical-outline', title: 'Bilan pré-conceptionnel', desc: 'Consultez votre gynécologue pour un bilan complet avant de concevoir.' },
  { icon: 'heart-outline', title: 'Gestion du stress', desc: 'Le cortisol perturbe les hormones de la reproduction. Pratiquez la relaxation.' },
];

const fertilityTreatments = [
  {
    name: 'FIV',
    full: 'Fécondation in vitro',
    desc: 'Fécondation de l\'ovule et du spermatozoïde en laboratoire, puis transfert de l\'embryon.',
    success: '30–40%',
  },
  {
    name: 'ICSI',
    full: 'Injection intracytoplasmique',
    desc: 'Injection directe d\'un spermatozoïde dans l\'ovule. Recommandé en cas d\'infertilité masculine.',
    success: '35–45%',
  },
  {
    name: 'IUI',
    full: 'Insémination artificielle',
    desc: 'Dépôt des spermatozoïdes directement dans l\'utérus au moment de l\'ovulation.',
    success: '10–20%',
  },
  {
    name: 'Stimulation ovarienne',
    full: 'Induction de l\'ovulation',
    desc: 'Médicaments pour stimuler la production d\'ovules chez les femmes ayant des cycles irréguliers.',
    success: '20–30%',
  },
];

const faqs = [
  { q: 'À quel moment du cycle suis-je la plus fertile ?', a: 'Les 5 jours avant l\'ovulation et le jour J constituent la fenêtre fertile. Pour un cycle de 28 jours, c\'est généralement autour du J14.' },
  { q: 'Combien de temps faut-il en moyenne pour concevoir ?', a: 'Chez les couples fertiles, 85% conçoivent dans l\'année. Si aucune grossesse après 12 mois (ou 6 mois après 35 ans), consultez un spécialiste.' },
  { q: 'Le stress peut-il réduire la fertilité ?', a: 'Oui. Le stress chronique élève le cortisol, qui perturbe les hormones LH et FSH essentielles à l\'ovulation. La relaxation et le yoga prénatal aident.' },
  { q: 'Quels examens pour un bilan de fertilité ?', a: 'Pour la femme : bilan hormonal (FSH, LH, AMH), échographie pelvienne, bilan thyroïdien. Pour l\'homme : spermogramme. À faire en couple dès 6–12 mois sans grossesse.' },
  { q: 'Comment détecter l\'ovulation naturellement ?', a: 'Plusieurs méthodes : température basale (hausse de 0,2–0,5°C après l\'ovulation), glaire cervicale (transparente et filante au moment fertile), tests d\'ovulation urinaires.' },
  { q: 'L\'alimentation influence-t-elle la fertilité ?', a: 'Oui. Les folates (épinards, légumineuses), le zinc, les oméga-3 et la vitamine D sont essentiels. Évitez les aliments ultra-transformés, l\'alcool et le tabac.' },
  { q: 'Le poids corporel a-t-il un impact sur la fertilité ?', a: 'Un IMC en dehors de la fourchette normale (18.5–25) peut perturber l\'ovulation. Aussi bien la sous-nutrition que l\'obésité réduisent les chances de conception.' },
  { q: 'Qu\'est-ce que l\'insuffisance ovarienne prématurée ?', a: 'C\'est un arrêt du fonctionnement normal des ovaires avant 40 ans. Elle touche 1% des femmes. Un bilan hormonal (FSH élevée, AMH basse) permet le diagnostic.' },
  { q: 'L\'âge de l\'homme affecte-t-il la fertilité du couple ?', a: 'Oui. Après 40 ans, la qualité du sperme décline : moins de mobilité, plus de fragmentation de l\'ADN. Cela augmente légèrement le risque de fausse couche.' },
  { q: 'Qu\'est-ce que le syndrome des ovaires polykystiques (SOPK) ?', a: 'C\'est la cause la plus fréquente d\'infertilité anovulatoire. Signes : cycles irréguliers, acné, excès de pilosité. Traitable par mode de vie et médicaments.' },
  { q: 'La thyroïde peut-elle influencer la fertilité ?', a: 'Oui. L\'hypothyroïdie et l\'hyperthyroïdie perturbent toutes deux l\'ovulation et augmentent le risque de fausse couche. Un bilan TSH est recommandé avant toute PMA.' },
  { q: 'Qu\'est-ce que la réserve ovarienne ?', a: 'C\'est la quantité et la qualité d\'ovocytes restants. Elle est évaluée par le taux d\'AMH (hormone anti-müllerienne) et le compte des follicules antraux à l\'échographie.' },
  { q: 'Combien de tentatives de FIV sont généralement nécessaires ?', a: 'En moyenne, 2 à 3 cycles sont nécessaires pour obtenir une grossesse. Le taux de succès cumulatif après 3 tentatives atteint 60–70% selon l\'âge.' },
  { q: 'Les rapports sexuels trop fréquents réduisent-ils les chances ?', a: 'Non, des rapports tous les 1 à 2 jours pendant la période fertile sont optimaux. Contrairement aux idées reçues, l\'abstinence prolongée diminue la qualité du sperme.' },
  { q: 'Le café peut-il affecter la fertilité ?', a: 'À forte dose (plus de 5 tasses/jour), la caféine réduit légèrement la fertilité féminine et augmente le risque de fausse couche. 2 tasses/jour restent sans impact significatif.' },
  { q: 'Qu\'est-ce que l\'endométriose et comment affecte-t-elle la fertilité ?', a: 'C\'est une présence de tissu utérin hors de l\'utérus. Elle touche 10% des femmes et 30–50% des femmes infertiles. Elle peut être traitée chirurgicalement.' },
  { q: 'Les compléments alimentaires améliorent-ils la fertilité ?', a: 'L\'acide folique (400 µg/jour) est indispensable. La CoQ10, la vitamine E, et le zinc peuvent améliorer la qualité ovocytaire et spermatique.' },
  { q: 'Faut-il consulter un médecin avant de concevoir ?', a: 'Oui, une consultation préconceptionnelle permet d\'évaluer les risques, mettre à jour les vaccins, supplémenter en folates et corriger d\'éventuels problèmes thyroïdiens.' },
  { q: 'L\'arrêt de la contraception hormonale retarde-t-il la conception ?', a: 'Chez la plupart des femmes, les cycles reprennent dans le premier mois. Chez certaines, cela peut prendre 3 à 6 mois. C\'est normal et sans incidence à long terme.' },
  { q: 'Qu\'est-ce que la procréation médicalement assistée (PMA) ?', a: 'La PMA regroupe l\'insémination artificielle, la FIV et l\'ICSI. Elle est proposée après 12 mois d\'infertilité chez les moins de 35 ans, 6 mois après 35 ans, ou d\'emblée en cas de pathologie connue.' },
];

interface FertileWindow {
  fertileStart: Date;
  fertileEnd: Date;
  ovulation: Date;
  nextPeriod: Date;
}

export default function FertiliteScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
    }, [])
  );
  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [cycleLength, setCycleLength] = useStorage(STORAGE_KEYS.CYCLE_LENGTH, '28');
  const [lastPeriodDate, setLastPeriodDate] = useStorage(STORAGE_KEYS.LAST_PERIOD_DATE, '');
  const [cycleLengthInput, setCycleLengthInput] = useState('28');
  const [lastPeriodInput, setLastPeriodInput] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [result, setResult] = useState<FertileWindow | null>(null);

  useEffect(() => {
    setCycleLengthInput(cycleLength || '28');
    setLastPeriodInput(lastPeriodDate || '');
    if (lastPeriodDate) {
      try {
        const parsed = parse(lastPeriodDate, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) setSelectedDate(parsed);
      } catch {}
      computeResult(lastPeriodDate, cycleLength || '28');
    }
  }, [cycleLength, lastPeriodDate]);

  const computeResult = (periodDate: string, length: string) => {
    try {
      const parsed = parse(periodDate, 'dd/MM/yyyy', new Date());
      if (!isValid(parsed)) return;
      const len = parseInt(length, 10);
      if (isNaN(len) || len < 21 || len > 45) return;
      const ovulation = addDays(parsed, len - 14);
      const fertileStart = addDays(ovulation, -5);
      const fertileEnd = addDays(ovulation, 1);
      const nextPeriod = addDays(parsed, len);
      setResult({ fertileStart, fertileEnd, ovulation, nextPeriod });
    } catch {
      // ignore
    }
  };

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    const formatted = format(date, 'dd/MM/yyyy');
    setLastPeriodInput(formatted);
  };

  const handleCalculate = async () => {
    const len = parseInt(cycleLengthInput, 10);
    if (isNaN(len) || len < 21 || len > 45) {
      Alert.alert('Durée invalide', 'Entrez une durée entre 21 et 45 jours.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Date manquante', 'Veuillez sélectionner la date de vos dernières règles.');
      return;
    }
    await setCycleLength(cycleLengthInput);
    await setLastPeriodDate(lastPeriodInput);
    computeResult(lastPeriodInput, cycleLengthInput);
  };

  const sections = ['Cycle', 'Conseils', 'Traitements', 'FAQ'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={Colors.gradient.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Fertilité</Text>
        <Text style={styles.headerSub}>Comprendre et optimiser votre fertilité</Text>

        {/* Section pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pills}>
          {sections.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.pill, activeSection === i && styles.pillActive]}
              onPress={() => setActiveSection(i)}
            >
              <Text style={[styles.pillText, activeSection === i && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
          <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
        </Svg>
      </LinearGradient>

      <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body} style={{ opacity: fadeAnim, backgroundColor: th.bg }}>

        {/* Banner */}
        <View style={styles.imageBanner}>
          <Image
            source={require('../../assets/images/fertility-banner.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
          />
          <View style={styles.imageBannerInner}>
            <Text style={styles.imageBannerTitle}>Fertilité & Cycle 🌺</Text>
            <Text style={styles.imageBannerSub}>Comprenez votre cycle · Optimisez vos chances</Text>
          </View>
        </View>

        {/* Calendrier menstruel */}
        <TouchableOpacity
          style={[styles.calendarCard, { backgroundColor: th.card, borderColor: th.border }]}
          onPress={() => router.push('/menstrual' as any)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#5B21B6', '#7F00FF']} style={styles.calendarIconBg}>
            <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.calendarCardTitle, { color: th.text }]}>Calendrier Menstruel</Text>
            <Text style={[styles.calendarCardSub, { color: th.textSub }]}>Suivez vos cycles et fenêtres fertiles</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={th.textSub || '#9CA3AF'} />
        </TouchableOpacity>

        {/* Cycle phases */}
        {activeSection === 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Les phases du cycle menstruel</Text>
            <Text style={[styles.sectionDesc, { color: th.textSub }]}>
              Un cycle moyen dure 28 jours, mais peut varier de 21 à 35 jours. Connaître ses phases est essentiel pour identifier la fenêtre fertile.
            </Text>
            {cyclePhases.map((phase, i) => (
              <View key={i} style={[styles.phaseCard, { backgroundColor: th.card }]}>
                <View style={styles.phaseIconBox}>
                  <Ionicons name={phase.icon as any} size={22} color={Colors.white} />
                </View>
                <View style={styles.phaseText}>
                  <View style={styles.phaseTop}>
                    <Text style={[styles.phaseName, { color: th.text }]}>{phase.name}</Text>
                    <View style={styles.phaseDaysBadge}>
                      <Text style={styles.phaseDays}>{phase.days}</Text>
                    </View>
                  </View>
                  <Text style={[styles.phaseDesc, { color: th.textSub }]}>{phase.desc}</Text>
                </View>
              </View>
            ))}

            {/* Ovulation calculator */}
            <TouchableOpacity onPress={() => setCalcModalVisible(true)} activeOpacity={0.9}>
              <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.calcCard}>
                <Ionicons name="calculator-outline" size={28} color={Colors.white} style={{ marginBottom: 10 }} />
                <Text style={styles.calcTitle}>Calculer ma fenêtre fertile</Text>
                {result ? (
                  <View style={styles.calcResultPreview}>
                    <View style={styles.calcResultRow}>
                      <Ionicons name="sparkles-outline" size={14} color={Colors.lavender} style={{ marginRight: 6 }} />
                      <Text style={styles.calcResultText}>
                        Fertile : {format(result.fertileStart, 'dd/MM', { locale: fr })} → {format(result.fertileEnd, 'dd/MM', { locale: fr })}
                      </Text>
                    </View>
                    <View style={styles.calcResultRow}>
                      <Ionicons name="ellipse-outline" size={14} color={Colors.pink} style={{ marginRight: 6 }} />
                      <Text style={styles.calcResultText}>
                        Ovulation : {format(result.ovulation, 'dd MMMM', { locale: fr })}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.calcDesc}>Entrez vos données pour calculer votre ovulation et fenêtre fertile.</Text>
                )}
                <View style={styles.calcBtn}>
                  <Text style={styles.calcBtnText}>{result ? 'Modifier les données' : 'Ouvrir le calculateur'}</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primaryDeep} style={{ marginLeft: 6 }} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Conception tips */}
        {activeSection === 1 && (
          <View>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Optimiser ses chances de concevoir</Text>
            <Text style={[styles.sectionDesc, { color: th.textSub }]}>
              Des habitudes simples peuvent considérablement améliorer votre fertilité naturelle.
            </Text>
            {conceptionTips.map((tip, i) => (
              <View key={i} style={[styles.tipCard, { backgroundColor: th.card }]}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon as any} size={20} color={Colors.primary} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={[styles.tipTitle, { color: th.text }]}>{tip.title}</Text>
                  <Text style={[styles.tipDesc, { color: th.textSub }]}>{tip.desc}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.infoBox, { backgroundColor: th.infoBox }]}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primaryLight} style={{ marginBottom: 8 }} />
              <Text style={styles.infoText}>
                En Tunisie, le suivi de fertilité est pris en charge partiellement par la CNAM. Consultez l'onglet CNAM pour les détails.
              </Text>
            </View>
          </View>
        )}

        {/* Fertility treatments */}
        {activeSection === 2 && (
          <View>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Parcours de fertilité médicalisé</Text>
            <Text style={[styles.sectionDesc, { color: th.textSub }]}>
              Si la conception naturelle n'aboutit pas, des traitements médicaux existent. Votre médecin vous guidera vers la solution adaptée.
            </Text>
            {fertilityTreatments.map((t, i) => (
              <View key={i} style={[styles.treatCard, { backgroundColor: th.card }]}>
                <View style={styles.treatHeader}>
                  <View>
                    <Text style={styles.treatAbbr}>{t.name}</Text>
                    <Text style={[styles.treatFull, { color: th.textSub }]}>{t.full}</Text>
                  </View>
                  <View style={styles.successBadge}>
                    <Text style={styles.successLabel}>Taux</Text>
                    <Text style={styles.successRate}>{t.success}</Text>
                  </View>
                </View>
                <Text style={[styles.treatDesc, { color: th.textSub }]}>{t.desc}</Text>
              </View>
            ))}

            <View style={styles.clinicCard}>
              <Ionicons name="medical-outline" size={24} color={Colors.white} style={{ marginBottom: 8 }} />
              <Text style={styles.clinicTitle}>Clinique La Rose</Text>
              <Text style={styles.clinicDesc}>
                Notre équipe de gynécologues spécialisés vous accompagne dans votre parcours PMA.
              </Text>
            </View>
          </View>
        )}

        {/* FAQ */}
        {activeSection === 3 && (
          <View>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Questions fréquentes</Text>
            {faqs.map((faq, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.faqCard, { backgroundColor: th.card }]}
                onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                activeOpacity={0.8}
              >
                <View style={styles.faqQuestion}>
                  <Text style={[styles.faqQ, { color: th.text }]}>{faq.q}</Text>
                  <Ionicons
                    name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                {expandedFaq === i && (
                  <Text style={[styles.faqA, { color: th.textSub, borderTopColor: th.border }]}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </Animated.ScrollView>

      {/* Calculator Modal */}
      <Modal visible={calcModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: th.border, backgroundColor: th.card }]}>
            <TouchableOpacity onPress={() => setCalcModalVisible(false)} style={styles.modalClose}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: th.text }]}>Calculateur fertile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <View style={styles.modalSection}>
              <Ionicons name="calendar-outline" size={40} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text style={styles.modalIntro}>
                Entrez la date de vos dernières règles et la durée moyenne de votre cycle pour calculer votre fenêtre fertile.
              </Text>
            </View>

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Date des dernières règles *</Text>
            <TouchableOpacity style={[styles.datePickerBtn, { backgroundColor: th.inputBg, borderColor: th.border }]} onPress={() => setDatePickerVisible(true)}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={styles.inputIcon} />
              <Text style={[styles.datePickerText, !selectedDate && styles.datePickerPlaceholder]}>
                {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
              </Text>
              <Ionicons name="chevron-down-outline" size={16} color={Colors.textLight} />
            </TouchableOpacity>

            <DatePickerModal
              visible={datePickerVisible}
              onClose={() => setDatePickerVisible(false)}
              onSelect={handleDateSelected}
              selectedDate={selectedDate}
              title="Date des dernières règles"
              maxDate={new Date()}
            />

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Durée de votre cycle (jours)</Text>
            <View style={[styles.inputRow, { backgroundColor: th.inputBg, borderColor: th.border }]}>
              <Ionicons name="repeat-outline" size={18} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: th.text }]}
                placeholder="28"
                placeholderTextColor={th.textMuted}
                value={cycleLengthInput}
                onChangeText={setCycleLengthInput}
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.cycleHint}>Entre 21 et 45 jours (moyenne : 28 jours)</Text>

            <TouchableOpacity style={styles.calcSubmitBtn} onPress={handleCalculate}>
              <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.calcSubmitGrad}>
                <Ionicons name="calculator-outline" size={18} color={Colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.calcSubmitText}>Calculer</Text>
              </LinearGradient>
            </TouchableOpacity>

            {result && (
              <View style={styles.resultsCard}>
                <LinearGradient colors={Colors.gradient.card} style={styles.resultsGrad}>
                  <Text style={styles.resultsTitle}>Vos résultats</Text>

                  <View style={styles.resultItem}>
                    <View style={[styles.resultDot, { backgroundColor: Colors.rose }]} />
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Fenêtre fertile</Text>
                      <Text style={styles.resultValue}>
                        {format(result.fertileStart, 'dd MMMM', { locale: fr })} → {format(result.fertileEnd, 'dd MMMM yyyy', { locale: fr })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultDivider} />

                  <View style={styles.resultItem}>
                    <View style={[styles.resultDot, { backgroundColor: Colors.primary }]} />
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Jour d'ovulation estimé</Text>
                      <Text style={styles.resultValue}>
                        {format(result.ovulation, 'EEEE dd MMMM yyyy', { locale: fr })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultDivider} />

                  <View style={styles.resultItem}>
                    <View style={[styles.resultDot, { backgroundColor: Colors.mauve }]} />
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Prochaines règles prévues</Text>
                      <Text style={styles.resultValue}>
                        {format(result.nextPeriod, 'dd MMMM yyyy', { locale: fr })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultNote}>
                    <Ionicons name="information-circle-outline" size={15} color={Colors.textSecondary} style={{ marginRight: 6, marginTop: 1 }} />
                    <Text style={styles.resultNoteText}>
                      Ces dates sont des estimations basées sur un cycle régulier. Consultez un médecin pour un suivi personnalisé.
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: WAVE_H,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(233,213,255,0.85)',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '400',
  },
  pillsScroll: { marginBottom: 0 },
  pills: { gap: 8, paddingBottom: 20 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  pillActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  pillText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  pillTextActive: { color: Colors.primaryDeep },
  body: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  sectionDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  phaseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  phaseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  phaseText: { flex: 1 },
  phaseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  phaseName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  phaseDaysBadge: {
    backgroundColor: Colors.lilac,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  phaseDays: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  phaseDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
  calcCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  calcTitle: { fontSize: 17, fontWeight: '600', color: Colors.white, marginBottom: 12 },
  calcDesc: { fontSize: 13, color: 'rgba(233,213,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  calcResultPreview: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  calcResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calcResultText: {
    fontSize: 14,
    color: 'rgba(233,213,255,0.95)',
    fontWeight: '500',
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  calcBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDeep,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  tipDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
  infoBox: {
    backgroundColor: Colors.lilac,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  treatCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  treatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  treatAbbr: { fontSize: 17, fontWeight: '700', color: Colors.primary },
  treatFull: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  successBadge: {
    alignItems: 'center',
    backgroundColor: Colors.lilac,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  successLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  successRate: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  treatDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 20 },
  clinicCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  clinicTitle: { fontSize: 18, fontWeight: '600', color: Colors.white, marginBottom: 8 },
  clinicDesc: { fontSize: 13, color: 'rgba(233,213,255,0.85)', textAlign: 'center', lineHeight: 20 },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text, lineHeight: 20 },
  faqA: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 21,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  modalClose: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalIntro: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  datePickerPlaceholder: {
    color: Colors.textMuted,
    fontWeight: '400',
  },
  cycleHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
    marginLeft: 4,
  },
  calcSubmitBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  calcSubmitGrad: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  calcSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  resultsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  resultsGrad: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  resultDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 14,
    flexShrink: 0,
  },
  resultContent: { flex: 1 },
  resultLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  resultDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 0,
  },
  resultNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.lilac,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  resultNoteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  imageBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 4,
  },
  bannerImage: {
    width: '100%',
    aspectRatio: 1200 / 630,
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
  calendarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#4B0082',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  calendarCardSub: {
    fontSize: 12,
    lineHeight: 17,
  },
});

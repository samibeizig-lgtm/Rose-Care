import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Dimensions, Modal, TextInput, Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';
import { useStorage, storage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { addDays, format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePickerModal from '../../src/components/DatePickerModal';

const { width } = Dimensions.get('window');

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
  { q: 'À quel moment du cycle suis-je la plus fertile ?', a: 'Les 5 jours avant l\'ovulation et le jour de l\'ovulation constituent la fenêtre fertile. Pour un cycle de 28 jours, c\'est généralement autour du J14.' },
  { q: 'Combien de temps faut-il en moyenne pour concevoir ?', a: 'Chez les couples fertiles, 85% conçoivent dans l\'année. Si aucune grossesse après 12 mois (ou 6 mois après 35 ans), consultez un spécialiste.' },
  { q: 'Le stress peut-il réduire la fertilité ?', a: 'Oui. Le stress chronique élève le cortisol, qui perturbe les hormones LH et FSH essentielles à l\'ovulation.' },
  { q: 'Quels examens pour un bilan de fertilité ?', a: 'Pour la femme : bilan hormonal, échographie pelvienne, bilan thyroïdien. Pour l\'homme : spermogramme. À faire en couple dès 6–12 mois sans grossesse.' },
];

interface FertileWindow {
  fertileStart: Date;
  fertileEnd: Date;
  ovulation: Date;
  nextPeriod: Date;
}

export default function FertiliteScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ImageBackground
        source={require('../../assets/images/fertility-banner.jpg')}
        style={styles.header}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(157,23,77,0.55)', 'rgba(219,39,119,0.80)']}
          style={StyleSheet.absoluteFill}
        />
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
      </ImageBackground>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Cycle phases */}
        {activeSection === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Les phases du cycle menstruel</Text>
            <Text style={styles.sectionDesc}>
              Un cycle moyen dure 28 jours, mais peut varier de 21 à 35 jours. Connaître ses phases est essentiel pour identifier la fenêtre fertile.
            </Text>
            {cyclePhases.map((phase, i) => (
              <View key={i} style={styles.phaseCard}>
                <View style={styles.phaseIconBox}>
                  <Ionicons name={phase.icon as any} size={22} color={Colors.white} />
                </View>
                <View style={styles.phaseText}>
                  <View style={styles.phaseTop}>
                    <Text style={styles.phaseName}>{phase.name}</Text>
                    <View style={styles.phaseDaysBadge}>
                      <Text style={styles.phaseDays}>{phase.days}</Text>
                    </View>
                  </View>
                  <Text style={styles.phaseDesc}>{phase.desc}</Text>
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
            <Text style={styles.sectionTitle}>Optimiser ses chances de concevoir</Text>
            <Text style={styles.sectionDesc}>
              Des habitudes simples peuvent considérablement améliorer votre fertilité naturelle.
            </Text>
            {conceptionTips.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon as any} size={20} color={Colors.primary} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDesc}>{tip.desc}</Text>
                </View>
              </View>
            ))}

            <View style={styles.infoBox}>
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
            <Text style={styles.sectionTitle}>Parcours de fertilité médicalisé</Text>
            <Text style={styles.sectionDesc}>
              Si la conception naturelle n'aboutit pas, des traitements médicaux existent. Votre médecin vous guidera vers la solution adaptée.
            </Text>
            {fertilityTreatments.map((t, i) => (
              <View key={i} style={styles.treatCard}>
                <View style={styles.treatHeader}>
                  <View>
                    <Text style={styles.treatAbbr}>{t.name}</Text>
                    <Text style={styles.treatFull}>{t.full}</Text>
                  </View>
                  <View style={styles.successBadge}>
                    <Text style={styles.successLabel}>Taux</Text>
                    <Text style={styles.successRate}>{t.success}</Text>
                  </View>
                </View>
                <Text style={styles.treatDesc}>{t.desc}</Text>
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
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
            {faqs.map((faq, i) => (
              <TouchableOpacity
                key={i}
                style={styles.faqCard}
                onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                activeOpacity={0.8}
              >
                <View style={styles.faqQuestion}>
                  <Text style={styles.faqQ}>{faq.q}</Text>
                  <Ionicons
                    name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                {expandedFaq === i && (
                  <Text style={styles.faqA}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Calculator Modal */}
      <Modal visible={calcModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCalcModalVisible(false)} style={styles.modalClose}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Calculateur fertile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <View style={styles.modalSection}>
              <Ionicons name="calendar-outline" size={40} color={Colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text style={styles.modalIntro}>
                Entrez la date de vos dernières règles et la durée moyenne de votre cycle pour calculer votre fenêtre fertile.
              </Text>
            </View>

            <Text style={styles.inputLabel}>Date des dernières règles *</Text>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setDatePickerVisible(true)}>
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

            <Text style={styles.inputLabel}>Durée de votre cycle (jours)</Text>
            <View style={styles.inputRow}>
              <Ionicons name="repeat-outline" size={18} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="28"
                placeholderTextColor={Colors.textMuted}
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
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
});

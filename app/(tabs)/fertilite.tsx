import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';

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

export default function FertiliteScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const sections = ['Cycle', 'Conseils', 'Traitements', 'FAQ'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.header}>
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
      </LinearGradient>

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

            {/* Ovulation calculator teaser */}
            <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.calcCard}>
              <Ionicons name="calculator-outline" size={28} color={Colors.white} style={{ marginBottom: 10 }} />
              <Text style={styles.calcTitle}>Calculer ma fenêtre fertile</Text>
              <Text style={styles.calcDesc}>
                Notez le premier jour de vos règles dans l'onglet Santé pour calculer votre ovulation automatiquement.
              </Text>
            </LinearGradient>
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
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: 2,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(233,213,255,0.75)',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '300',
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
  calcTitle: { fontSize: 17, fontWeight: '600', color: Colors.white, marginBottom: 8 },
  calcDesc: { fontSize: 13, color: 'rgba(233,213,255,0.85)', textAlign: 'center', lineHeight: 20 },
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
});

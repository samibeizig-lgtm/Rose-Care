import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';
import { useTheme } from '../src/theme/ThemeContext';

export default function CNAMScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('declaration');

  const cnaminSections = [
    {
      id: 'declaration',
      icon: 'document-text-outline' as const,
      title: 'Déclaration de Grossesse',
      color: Colors.primary,
      content: [
        { type: 'step', text: 'Chez votre médecin : demandez le formulaire de déclaration de grossesse' },
        { type: 'step', text: 'Le médecin remplit le certificat médical et la déclaration' },
        { type: 'step', text: 'Déposez les documents à votre caisse CNAM locale' },
        { type: 'step', text: 'Délai : dans les 3 premiers mois de grossesse' },
        { type: 'info', text: 'Après déclaration, vous bénéficiez de la prise en charge à 100% pour les soins de maternité.' },
      ],
    },
    {
      id: 'prise_en_charge',
      icon: 'medical-outline' as const,
      title: 'Prise en Charge des Soins',
      color: Colors.primarySoft,
      content: [
        { type: 'subtitle', text: 'Consultations prises en charge :' },
        { type: 'item', text: '7 consultations prénatales (selon calendrier officiel)' },
        { type: 'item', text: '3 échographies obstétricales (1er, 2ème, 3ème trimestre)' },
        { type: 'item', text: 'Analyses biologiques prescrites' },
        { type: 'item', text: 'Hospitalisation pour accouchement' },
        { type: 'item', text: 'Suites de couches (3 jours vaginal, 5 jours césarienne)' },
        { type: 'subtitle', text: 'Documents nécessaires :' },
        { type: 'item', text: 'Carte CNAM valide' },
        { type: 'item', text: 'Ordonnance du médecin' },
        { type: 'item', text: 'Carnet de santé maternité' },
        { type: 'info', text: 'Certains soins nécessitent une entente préalable. Vérifiez toujours avant.' },
      ],
    },
    {
      id: 'conge_maternite',
      icon: 'calendar-outline' as const,
      title: 'Congé Maternité en Tunisie',
      color: Colors.success,
      content: [
        { type: 'tableHeader', text: '', col1: 'Type de Congé', col2: 'Durée' },
        { type: 'tableRow', text: '', col1: 'Congé Prénatal', col2: '15 jours max', alt: false },
        { type: 'tableRow', text: '', col1: 'Congé Postnatal', col2: '3 mois (4 mois cas spéciaux*)', alt: true },
        { type: 'tableRow', text: '', col1: 'Congé Paternité', col2: '7 jours (10 j cas spéciaux*)', alt: false },
        { type: 'tableRow', text: '', col1: 'Congé Accouchement', col2: '1 à 4 mois optionnel', alt: true },
        { type: 'tableRow', text: '', col1: 'Repos Allaitement', col2: '9 mois – 1h/jour payée', alt: false },
        { type: 'info', text: 'Loi n°44 du 12 août 2024. *Cas spéciaux : naissances multiples, prématuré, handicap, malformations congénitales.' },
        { type: 'subtitle', text: 'Rémunération :' },
        { type: 'item', text: 'Secteur public : plein traitement pour les congés prénatal et postnatal' },
        { type: 'item', text: 'Secteur privé (CNSS) : 2/3 du salaire journalier pour le postnatal' },
        { type: 'item', text: 'Congé accouchement (optionnel) : demi-traitement' },
        { type: 'item', text: 'Repos allaitement : intégralement rémunéré' },
        { type: 'subtitle', text: 'Procédure :' },
        { type: 'step', text: 'Obtenez un certificat médical attestant la date prévue d\'accouchement' },
        { type: 'step', text: 'Remettez-le à votre employeur au moins 1 mois avant le début du congé' },
        { type: 'step', text: 'Après accouchement : envoyez l\'extrait de naissance à la CNAM' },
      ],
    },
    {
      id: 'allocations',
      icon: 'cash-outline' as const,
      title: 'Allocations et Aides',
      color: Colors.primaryLight,
      content: [
        { type: 'subtitle', text: 'Allocations familiales (CNSS) :' },
        { type: 'item', text: '1er enfant : 40 DT/mois' },
        { type: 'item', text: '2ème enfant : 40 DT/mois' },
        { type: 'item', text: '3ème enfant : 40 DT/mois (plafonné)' },
        { type: 'subtitle', text: 'Conditions :' },
        { type: 'item', text: 'Être affiliée à la CNSS (secteur privé) ou CNRPS (public)' },
        { type: 'item', text: 'Enfant à charge jusqu\'à 25 ans si étudiant' },
        { type: 'info', text: 'Contactez votre caisse régionale CNSS pour les détails selon votre situation.' },
      ],
    },
    {
      id: 'hospitalisation',
      icon: 'business-outline' as const,
      title: 'Hospitalisation pour Accouchement',
      color: Colors.primaryDeep,
      content: [
        { type: 'subtitle', text: 'Ce que couvre la CNAM :' },
        { type: 'item', text: 'Frais d\'hospitalisation à la maternité conventionnée' },
        { type: 'item', text: 'Accouchement vaginal ou par césarienne' },
        { type: 'item', text: 'Soins pour le nouveau-né (si besoin d\'unité néonatale)' },
        { type: 'item', text: 'Médicaments administrés durant l\'hospitalisation' },
        { type: 'subtitle', text: 'Documents à préparer :' },
        { type: 'step', text: 'Carte CNAM + CIN' },
        { type: 'step', text: 'Carnet de santé maternité' },
        { type: 'step', text: 'Toutes les analyses et échographies' },
        { type: 'step', text: 'Résultat du groupe sanguin' },
        { type: 'step', text: 'Bilan prénatal complet' },
        { type: 'info', text: 'La Clinique La Rose est conventionnée CNAM. Votre accouchement est pris en charge.' },
      ],
    },
    {
      id: 'contacts_cnam',
      icon: 'call-outline' as const,
      title: 'Contacts CNAM',
      color: Colors.mauve,
      content: [
        { type: 'item', text: 'Siège CNAM : 71 100 100' },
        { type: 'item', text: 'Numéro vert : 80 100 100 (Gratuit)' },
        { type: 'item', text: 'Site web : www.cnam.nat.tn' },
        { type: 'item', text: 'Agence Tunis : Route de La Marsa, Tunis' },
        { type: 'item', text: 'Horaires : Lun-Ven 8h30-16h30' },
        { type: 'info', text: 'Présentez-vous avec tous vos documents et votre CIN.' },
      ],
    },
  ];

  const checklist = [
    'Déclaration de grossesse chez le médecin',
    'Dépôt de la déclaration à la CNAM',
    'Vérification de la validité de la carte CNAM',
    'Informer l\'employeur de la grossesse',
    'Préparer lettre de congé maternité',
    'Vérifier convention maternité avec clinique',
    'Préparer dossier administratif pour accouchement',
  ];

  const [checks, setChecks] = useState(checklist.map(() => false));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name="document-text-outline" size={40} color={Colors.lavender} />
        </View>
        <Text style={styles.headerTitle}>Dossier CNAM</Text>
        <Text style={styles.headerSubtitle}>
          Tout savoir sur votre prise en charge maternité en Tunisie
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        <View style={styles.content}>

          {/* Quick checklist */}
          <View style={[styles.checklistCard, { backgroundColor: th.card, borderColor: th.border }]}>
            <View style={styles.checklistTitleRow}>
              <Ionicons name="checkmark-done-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.checklistTitle, { color: th.text }]}>Ma Checklist Administrative</Text>
            </View>
            {checklist.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.checkRow, idx === checklist.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  const newChecks = [...checks];
                  newChecks[idx] = !newChecks[idx];
                  setChecks(newChecks);
                }}
              >
                <View style={[styles.checkBox, checks[idx] && styles.checkBoxDone]}>
                  {checks[idx] && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Text style={[styles.checkText, checks[idx] && styles.checkTextDone, { color: checks[idx] ? th.textMuted : th.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sections */}
          {cnaminSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.sectionCard, { backgroundColor: th.card, borderColor: expandedSection === section.id ? section.color : th.border }]}
              onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBox, { backgroundColor: section.color + '20' }]}>
                  <Ionicons name={section.icon} size={18} color={section.color} />
                </View>
                <Text style={[styles.sectionTitle, { color: th.text }]}>{section.title}</Text>
                <Ionicons
                  name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={section.color}
                />
              </View>

              {expandedSection === section.id && (
                <View style={styles.sectionBody}>
                  {section.content.map((item, idx) => (
                    <View key={idx} style={[
                      item.type === 'info' ? [styles.infoBox, { backgroundColor: th.infoBox }] :
                      item.type === 'tableHeader' || item.type === 'tableRow' ? {} :
                      styles.contentRow,
                      item.type === 'subtitle' ? styles.subtitleRow : {},
                    ]}>
                      {item.type === 'step' && (
                        <>
                          <View style={[styles.stepBadge, { backgroundColor: section.color }]}>
                            <Text style={styles.stepBadgeText}>
                              {section.content.slice(0, idx + 1).filter(c => c.type === 'step').length}
                            </Text>
                          </View>
                          <Text style={[styles.contentText, { color: th.text }]}>{item.text}</Text>
                        </>
                      )}
                      {item.type === 'item' && (
                        <>
                          <View style={[styles.bullet, { backgroundColor: section.color }]} />
                          <Text style={[styles.contentText, { color: th.text }]}>{item.text}</Text>
                        </>
                      )}
                      {item.type === 'subtitle' && (
                        <Text style={[styles.subtitleText, { color: section.color }]}>{item.text}</Text>
                      )}
                      {item.type === 'info' && (
                        <View style={styles.infoContent}>
                          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} style={{ marginRight: 6, marginTop: 1, flexShrink: 0 }} />
                          <Text style={[styles.infoText, { color: th.text }]}>{item.text}</Text>
                        </View>
                      )}
                      {item.type === 'tableHeader' && (
                        <View style={[styles.tableHeaderRow, { backgroundColor: section.color + '20' }]}>
                          <Text style={[styles.tableCol1, styles.tableHeaderText, { color: section.color }]}>{(item as any).col1}</Text>
                          <Text style={[styles.tableCol2, styles.tableHeaderText, { color: section.color }]}>{(item as any).col2}</Text>
                        </View>
                      )}
                      {item.type === 'tableRow' && (
                        <View style={[styles.tableDataRow, (item as any).alt && [styles.tableDataRowAlt, { backgroundColor: isDark ? th.surface : '#F5F0FF' }], { borderBottomColor: th.border }]}>
                          <Text style={[styles.tableCol1, { color: th.text }]}>{(item as any).col1}</Text>
                          <Text style={[styles.tableCol2, { color: th.textSub }]}>{(item as any).col2}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Quick Contact */}
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:80100100')}>
              <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.contactBtnGrad}>
                <Ionicons name="call" size={20} color={Colors.white} />
                <Text style={styles.contactBtnText}>Appeler CNAM (Gratuit)</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://www.cnam.nat.tn')}>
              <View style={styles.contactBtnOutline}>
                <Ionicons name="globe-outline" size={20} color={Colors.primary} />
                <Text style={[styles.contactBtnText, { color: Colors.primary }]}>Site CNAM</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  backBtn: { position: 'absolute', top: 16, left: 16, padding: 8 },
  headerIconWrap: { marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 280 },
  content: { padding: 16 },
  checklistCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  checklistTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checklistTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 10 },
  checkBox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  checkBoxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkText: { flex: 1, fontSize: 14, color: Colors.text },
  checkTextDone: { textDecorationLine: 'line-through', color: Colors.textLight },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  sectionIconBox: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.text },
  sectionBody: { padding: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: Colors.border },
  contentRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, gap: 10 },
  subtitleRow: { paddingVertical: 10 },
  infoBox: { backgroundColor: Colors.lilac, borderRadius: 10, padding: 12, marginVertical: 8 },
  infoContent: { flexDirection: 'row', alignItems: 'flex-start' },
  stepBadge: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  contentText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  subtitleText: { fontSize: 14, fontWeight: '700' },
  infoText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  tableHeaderRow: { flexDirection: 'row', borderRadius: 8, paddingVertical: 9, paddingHorizontal: 10, marginBottom: 2 },
  tableDataRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tableDataRowAlt: { backgroundColor: '#F5F0FF' },
  tableCol1: { flex: 1.2, fontSize: 13, fontWeight: '600', color: Colors.text },
  tableCol2: { flex: 1, fontSize: 13, color: Colors.textSecondary, textAlign: 'right' as const },
  tableHeaderText: { fontWeight: '700', fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  contactCard: { flexDirection: 'row', gap: 10, marginTop: 8 },
  contactBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  contactBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  contactBtnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 14 },
  contactBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

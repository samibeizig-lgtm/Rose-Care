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

export default function CNAMScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('declaration');

  const cnaminSections = [
    {
      id: 'declaration',
      title: '📋 Déclaration de Grossesse',
      color: Colors.primary,
      content: [
        { type: 'step', text: 'Chez votre médecin : demandez le formulaire de déclaration de grossesse' },
        { type: 'step', text: 'Le médecin remplit le certificat médical et la déclaration' },
        { type: 'step', text: 'Déposez les documents à votre caisse CNAM locale' },
        { type: 'step', text: 'Délai : dans les 3 premiers mois de grossesse' },
        { type: 'info', text: '✅ Après déclaration, vous bénéficiez de la prise en charge à 100% pour les soins de maternité.' },
      ],
    },
    {
      id: 'prise_en_charge',
      title: '💊 Prise en Charge des Soins',
      color: Colors.info,
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
        { type: 'info', text: '⚠️ Certains soins nécessitent une entente préalable. Vérifiez toujours avant.' },
      ],
    },
    {
      id: 'conge_maternite',
      title: '🏖️ Congé Maternité en Tunisie',
      color: Colors.success,
      content: [
        { type: 'subtitle', text: 'Durée légale :' },
        { type: 'item', text: 'Secteur public : 2 mois (30 jours avant + 30 jours après)' },
        { type: 'item', text: 'Secteur privé : 30 jours (prorogeable selon convention)' },
        { type: 'item', text: 'Naissance prématurée : prolongation possible' },
        { type: 'item', text: 'Naissances multiples : prolongation de 15 jours par enfant supplémentaire' },
        { type: 'subtitle', text: 'Procédure :' },
        { type: 'step', text: 'Obtenez un certificat médical attestant la grossesse et la date prévue d\'accouchement' },
        { type: 'step', text: 'Remettez-le à votre employeur au moins 1 mois avant le début du congé' },
        { type: 'step', text: 'Votre employeur déclare à la CNAM pour les indemnités' },
        { type: 'step', text: 'Après accouchement : envoyez l\'extrait de naissance à la CNAM' },
        { type: 'info', text: '💡 Vous pouvez prendre jusqu\'à 2 ans de congé parental non payé selon la loi tunisienne.' },
      ],
    },
    {
      id: 'allocations',
      title: '💰 Allocations et Aides',
      color: Colors.gold,
      content: [
        { type: 'subtitle', text: 'Allocations familiales (CNSS) :' },
        { type: 'item', text: '1er enfant : 40 DT/mois' },
        { type: 'item', text: '2ème enfant : 40 DT/mois' },
        { type: 'item', text: '3ème enfant : 40 DT/mois (plafonné)' },
        { type: 'subtitle', text: 'Conditions :' },
        { type: 'item', text: 'Être affiliée à la CNSS (secteur privé) ou CNRPS (public)' },
        { type: 'item', text: 'Enfant à charge jusqu\'à 25 ans si étudiant' },
        { type: 'info', text: '📍 Contactez votre caisse régionale CNSS pour les détails selon votre situation.' },
      ],
    },
    {
      id: 'hospitalisation',
      title: '🏥 Hospitalisation pour Accouchement',
      color: Colors.secondary,
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
        { type: 'info', text: '🌹 La Clinique La Rose est conventionnée CNAM. Votre accouchement est pris en charge.' },
      ],
    },
    {
      id: 'contacts_cnam',
      title: '📞 Contacts CNAM',
      color: Colors.zen,
      content: [
        { type: 'item', text: '📞 Siège CNAM : 71 100 100' },
        { type: 'item', text: '📱 Numéro vert : 80 100 100 (Gratuit)' },
        { type: 'item', text: '🌐 Site web : www.cnam.nat.tn' },
        { type: 'item', text: '📍 Agence Tunis : Route de La Marsa, Tunis' },
        { type: 'item', text: '⏰ Horaires : Lun-Ven 8h30-16h30' },
        { type: 'info', text: '💡 Présentez-vous avec tous vos documents et votre CIN.' },
      ],
    },
  ];

  const checklist = [
    { done: false, text: 'Déclaration de grossesse chez le médecin' },
    { done: false, text: 'Dépôt de la déclaration à la CNAM' },
    { done: false, text: 'Vérification de la validité de la carte CNAM' },
    { done: false, text: 'Informer l\'employeur de la grossesse' },
    { done: false, text: 'Préparer lettre de congé maternité' },
    { done: false, text: 'Vérifier convention maternité avec clinique' },
    { done: false, text: 'Préparer dossier administratif pour accouchement' },
  ];

  const [checks, setChecks] = useState(checklist.map(c => c.done));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0288D1', '#29B6F6', '#81D4FA']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>🏛️</Text>
        <Text style={styles.headerTitle}>Dossier CNAM</Text>
        <Text style={styles.headerSubtitle}>
          Tout savoir sur votre prise en charge maternité en Tunisie
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Quick checklist */}
          <View style={styles.checklistCard}>
            <Text style={styles.checklistTitle}>✅ Ma Checklist Administrative</Text>
            {checklist.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.checkRow}
                onPress={() => {
                  const newChecks = [...checks];
                  newChecks[idx] = !newChecks[idx];
                  setChecks(newChecks);
                }}
              >
                <View style={[styles.checkBox, checks[idx] && styles.checkBoxDone]}>
                  {checks[idx] && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Text style={[styles.checkText, checks[idx] && styles.checkTextDone]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sections */}
          {cnaminSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.sectionCard, expandedSection === section.id && { borderColor: section.color }]}
              onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={[styles.chevronBadge, { backgroundColor: section.color + '20' }]}>
                  <Text style={[styles.chevron, { color: section.color }]}>
                    {expandedSection === section.id ? '▲' : '▼'}
                  </Text>
                </View>
              </View>

              {expandedSection === section.id && (
                <View style={styles.sectionBody}>
                  {section.content.map((item, idx) => (
                    <View key={idx} style={[
                      item.type === 'info' ? styles.infoBox : styles.contentRow,
                      item.type === 'subtitle' ? styles.subtitleRow : {},
                    ]}>
                      {item.type === 'step' && (
                        <>
                          <View style={[styles.stepBadge, { backgroundColor: section.color }]}>
                            <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                          </View>
                          <Text style={styles.contentText}>{item.text}</Text>
                        </>
                      )}
                      {item.type === 'item' && (
                        <>
                          <View style={[styles.bullet, { backgroundColor: section.color }]} />
                          <Text style={styles.contentText}>{item.text}</Text>
                        </>
                      )}
                      {item.type === 'subtitle' && (
                        <Text style={[styles.subtitleText, { color: section.color }]}>{item.text}</Text>
                      )}
                      {item.type === 'info' && (
                        <Text style={styles.infoText}>{item.text}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Quick Contact */}
          <View style={styles.contactCard}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL('tel:80100100')}
            >
              <LinearGradient colors={['#0288D1', '#29B6F6']} style={styles.contactBtnGrad}>
                <Ionicons name="call" size={20} color={Colors.white} />
                <Text style={styles.contactBtnText}>Appeler CNAM (Gratuit)</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL('https://www.cnam.nat.tn')}
            >
              <View style={styles.contactBtnOutline}>
                <Ionicons name="globe-outline" size={20} color={Colors.info} />
                <Text style={[styles.contactBtnText, { color: Colors.info }]}>Site CNAM</Text>
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
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 280 },
  content: { padding: 16 },
  checklistCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  checklistTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 10 },
  checkBox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.info, justifyContent: 'center', alignItems: 'center' },
  checkBoxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkText: { flex: 1, fontSize: 14, color: Colors.text },
  checkTextDone: { textDecorationLine: 'line-through', color: Colors.textLight },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.text },
  chevronBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  chevron: { fontSize: 12, fontWeight: '700' },
  sectionBody: { padding: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: Colors.border },
  contentRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, gap: 10 },
  subtitleRow: { paddingVertical: 10 },
  infoBox: { backgroundColor: Colors.infoLight, borderRadius: 10, padding: 12, marginVertical: 8 },
  stepBadge: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  contentText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  subtitleText: { fontSize: 14, fontWeight: '700' },
  infoText: { fontSize: 14, color: Colors.text, lineHeight: 21 },
  contactCard: { flexDirection: 'row', gap: 10, marginTop: 8 },
  contactBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  contactBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  contactBtnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8, borderWidth: 1.5, borderColor: Colors.info, borderRadius: 14 },
  contactBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

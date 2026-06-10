import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'bp' | 'glucose' | 'mood' | 'symptoms';
  value: string;
  value2?: string;
  note?: string;
}

interface Appointment {
  id: string;
  date: string;
  title: string;
  doctor?: string;
  location?: string;
  note?: string;
  done: boolean;
}

const MOOD_OPTIONS = ['😊 Bien', '😴 Fatiguée', '🤢 Nausées', '😰 Anxieuse', '💪 Énergique', '😢 Triste', '🥰 Heureuse'];

export default function HealthScreen() {
  const [records, setRecords] = useStorage<HealthRecord[]>(STORAGE_KEYS.HEALTH_RECORDS, []);
  const [appointments, setAppointments] = useStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  const [activeTab, setActiveTab] = useState<'suivi' | 'rdv' | 'conseils'>('suivi');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'bp' | 'glucose' | 'mood' | 'appointment' | 'symptoms'>('weight');
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [rdvDate, setRdvDate] = useState('');
  const [rdvTitle, setRdvTitle] = useState('');
  const [rdvDoctor, setRdvDoctor] = useState('');

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setInputValue('');
    setInputValue2('');
    setInputNote('');
    setSelectedMood('');
    setRdvDate('');
    setRdvTitle('');
    setRdvDoctor('');
    setModalVisible(true);
  };

  const saveRecord = () => {
    if (modalType === 'appointment') {
      if (!rdvTitle || !rdvDate) {
        Alert.alert('Erreur', 'Veuillez remplir la date et le titre du rendez-vous.');
        return;
      }
      const newAppt: Appointment = {
        id: Date.now().toString(),
        date: rdvDate,
        title: rdvTitle,
        doctor: rdvDoctor,
        note: inputNote,
        done: false,
      };
      setAppointments([...appointments, newAppt].sort((a, b) => a.date.localeCompare(b.date)));
    } else {
      const value = modalType === 'mood' ? selectedMood : inputValue;
      if (!value) return;
      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: modalType as any,
        value,
        value2: inputValue2 || undefined,
        note: inputNote || undefined,
      };
      setRecords([newRecord, ...records]);
    }
    setModalVisible(false);
  };

  const toggleAppointmentDone = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const getLastRecord = (type: HealthRecord['type']) => {
    return records.find(r => r.type === type);
  };

  const weightRecords = records.filter(r => r.type === 'weight').slice(0, 10);
  const bpRecords = records.filter(r => r.type === 'bp').slice(0, 5);
  const glucoseRecords = records.filter(r => r.type === 'glucose').slice(0, 5);

  const healthCards = [
    {
      type: 'weight' as const,
      icon: 'scale-outline' as const,
      title: 'Poids',
      value: getLastRecord('weight')?.value,
      unit: 'kg',
      gradient: Colors.gradient.health as [string, string],
      normal: '(+1-2kg/mois en T2-T3)',
    },
    {
      type: 'bp' as const,
      icon: 'heart-outline' as const,
      title: 'Tension',
      value: getLastRecord('bp') ? `${getLastRecord('bp')!.value}/${getLastRecord('bp')!.value2}` : undefined,
      unit: 'mmHg',
      gradient: [Colors.primaryDeep, Colors.primary] as [string, string],
      normal: 'Normale < 140/90',
    },
    {
      type: 'glucose' as const,
      icon: 'water-outline' as const,
      title: 'Glycémie',
      value: getLastRecord('glucose')?.value,
      unit: 'mg/dL',
      gradient: [Colors.primary, Colors.primarySoft] as [string, string],
      normal: 'À jeun < 92 mg/dL',
    },
    {
      type: 'mood' as const,
      icon: 'happy-outline' as const,
      title: 'Humeur',
      value: getLastRecord('mood')?.value,
      unit: '',
      gradient: Colors.gradient.soft as [string, string],
      normal: 'Notez vos émotions',
    },
  ];

  const prenatalAdvice = [
    {
      category: 'Consultations',
      icon: 'stethoscope-outline' as const,
      color: Colors.primary,
      items: [
        '1ère consultation : semaine 8-10 (bilan complet)',
        'Échographie 1er trimestre : 11-13 SA',
        'Échographie morphologique : 20-22 SA',
        'Echographie 3ème trimestre : 32-34 SA',
        'Consultations mensuelles obligatoires',
        'Bilan CNAM : présenter carnet à chaque visite',
      ],
    },
    {
      category: 'Vaccination',
      icon: 'shield-checkmark-outline' as const,
      color: Colors.success,
      items: [
        'Grippe saisonnière : recommandée à tout trimestre',
        'Coqueluche : vaccin conseillé à 20-36 SA',
        'COVID-19 : recommandé selon protocole national',
        'Tétanos : vérifier à jour avant grossesse',
      ],
    },
    {
      category: 'Analyses obligatoires',
      icon: 'flask-outline' as const,
      color: Colors.primaryLight,
      items: [
        'Groupe sanguin + Rhésus (à la 1ère consultation)',
        'NFS complète',
        'Sérologie toxoplasmose, rubéole, syphilis',
        'Glycémie à jeun',
        'ECBU (examen cytobactériologique des urines)',
        'Test de Kleihauer si Rh négatif',
        'HGPO (test glucose) à 24-28 SA',
      ],
    },
    {
      category: 'Signes d\'alarme',
      icon: 'warning-outline' as const,
      color: Colors.error,
      items: [
        'Saignements abondants → URGENCE',
        'Perte des eaux → aller à la maternité',
        'Contractions régulières avant 37 SA → URGENCE',
        'Maux de tête sévères + vision trouble → Urgence',
        'Diminution des mouvements de bébé',
        'Douleur intense abdominale',
        'Fièvre > 38.5°C',
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header + Tabs */}
      <View style={styles.tabsHeader}>
        <LinearGradient colors={Colors.gradient.primary} style={styles.headerGradient}>
          <View style={styles.headerRow}>
            <Ionicons name="medkit-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
            <Text style={styles.headerTitle}>Suivi Santé</Text>
          </View>
          <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
            <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill="#FFFFFF" />
          </Svg>
        </LinearGradient>
        <View style={styles.tabsRow}>
          {(['suivi', 'rdv', 'conseils'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Ionicons
                name={tab === 'suivi' ? 'bar-chart-outline' : tab === 'rdv' ? 'calendar-outline' : 'bulb-outline'}
                size={14}
                color={activeTab === tab ? Colors.white : Colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'suivi' ? 'Suivi' : tab === 'rdv' ? 'Rendez-vous' : 'Conseils'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'suivi' && (
          <View style={styles.content}>
            {/* Health Cards */}
            <View style={styles.cardsGrid}>
              {healthCards.map((card) => (
                <TouchableOpacity
                  key={card.type}
                  style={styles.healthCard}
                  onPress={() => openModal(card.type)}
                >
                  <LinearGradient colors={card.gradient} style={styles.healthCardGradient}>
                    <Ionicons name={card.icon} size={26} color="rgba(255,255,255,0.9)" style={{ marginBottom: 6 }} />
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    {card.value ? (
                      <Text style={styles.cardValue}>{card.value} {card.unit}</Text>
                    ) : (
                      <Text style={styles.cardEmpty}>Ajouter +</Text>
                    )}
                    <Text style={styles.cardNormal}>{card.normal}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {/* Symptoms */}
            <TouchableOpacity style={styles.symptomsBtn} onPress={() => openModal('symptoms')}>
              <LinearGradient colors={Colors.gradient.card} style={styles.symptomsBtnGradient}>
                <Ionicons name="pulse-outline" size={20} color={Colors.primaryDark} style={{ marginRight: 8 }} />
                <Text style={styles.symptomsBtnText}>Noter mes symptômes du jour</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Weight LineChart */}
            {weightRecords.length >= 2 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="trending-up-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Évolution du Poids</Text>
                </View>
                <LineChart
                  data={{
                    labels: weightRecords.slice(0, 7).reverse().map(r => format(new Date(r.date), 'dd/MM', { locale: fr })),
                    datasets: [{ data: weightRecords.slice(0, 7).reverse().map(r => parseFloat(r.value) || 0) }],
                  }}
                  width={width - 64}
                  height={160}
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(109, 40, 217, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(91, 33, 182, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: Colors.primary },
                    propsForBackgroundLines: { stroke: Colors.border },
                  }}
                  bezier
                  style={{ borderRadius: 12, marginVertical: 4 }}
                  yAxisSuffix=" kg"
                />
              </View>
            )}
            {weightRecords.length === 1 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="trending-up-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Évolution du Poids</Text>
                </View>
                <View style={styles.bpRow}>
                  <Text style={styles.recordDate}>{format(new Date(weightRecords[0].date), 'dd/MM HH:mm', { locale: fr })}</Text>
                  <Text style={[styles.bpValue, { color: Colors.primary }]}>{weightRecords[0].value} kg</Text>
                </View>
                <Text style={styles.chartHint}>Ajoutez plus de mesures pour voir l'évolution</Text>
              </View>
            )}

            {/* BP LineChart */}
            {bpRecords.length >= 2 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="heart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Tension Artérielle (systolique)</Text>
                </View>
                <LineChart
                  data={{
                    labels: bpRecords.slice(0, 7).reverse().map(r => format(new Date(r.date), 'dd/MM', { locale: fr })),
                    datasets: [
                      {
                        data: bpRecords.slice(0, 7).reverse().map(r => parseFloat(r.value) || 0),
                        color: (opacity = 1) => `rgba(109, 40, 217, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={width - 64}
                  height={160}
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(109, 40, 217, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(91, 33, 182, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: Colors.primary },
                    propsForBackgroundLines: { stroke: Colors.border },
                  }}
                  bezier
                  style={{ borderRadius: 12, marginVertical: 4 }}
                  yAxisSuffix=" mmHg"
                />
                {bpRecords.slice(0, 5).map((r) => (
                  <View key={r.id} style={styles.bpRow}>
                    <Text style={styles.recordDate}>{format(new Date(r.date), 'dd/MM HH:mm', { locale: fr })}</Text>
                    <Text style={[styles.bpValue, parseFloat(r.value) >= 140 ? { color: Colors.error } : { color: Colors.success }]}>
                      {r.value}/{r.value2} mmHg
                    </Text>
                    {parseFloat(r.value) >= 140 && <Ionicons name="warning-outline" size={16} color={Colors.warning} />}
                  </View>
                ))}
              </View>
            )}
            {bpRecords.length === 1 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="heart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Tension Artérielle</Text>
                </View>
                <View style={styles.bpRow}>
                  <Text style={styles.recordDate}>{format(new Date(bpRecords[0].date), 'dd/MM HH:mm', { locale: fr })}</Text>
                  <Text style={[styles.bpValue, parseFloat(bpRecords[0].value) >= 140 ? { color: Colors.error } : { color: Colors.success }]}>
                    {bpRecords[0].value}/{bpRecords[0].value2} mmHg
                  </Text>
                </View>
                <Text style={styles.chartHint}>Ajoutez plus de mesures pour voir l'évolution</Text>
              </View>
            )}

            {/* Glucose LineChart */}
            {glucoseRecords.length >= 2 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="water-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Glycémie</Text>
                </View>
                <LineChart
                  data={{
                    labels: glucoseRecords.slice(0, 7).reverse().map(r => format(new Date(r.date), 'dd/MM', { locale: fr })),
                    datasets: [{ data: glucoseRecords.slice(0, 7).reverse().map(r => parseFloat(r.value) || 0) }],
                  }}
                  width={width - 64}
                  height={160}
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(109, 40, 217, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(91, 33, 182, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: Colors.primary },
                    propsForBackgroundLines: { stroke: Colors.border },
                  }}
                  bezier
                  style={{ borderRadius: 12, marginVertical: 4 }}
                  yAxisSuffix=" mg/dL"
                />
                {glucoseRecords.slice(0, 5).map((r) => (
                  <View key={r.id} style={styles.bpRow}>
                    <Text style={styles.recordDate}>{format(new Date(r.date), 'dd/MM HH:mm', { locale: fr })}</Text>
                    <Text style={[styles.bpValue, parseFloat(r.value) > 126 ? { color: Colors.error } : { color: Colors.success }]}>
                      {r.value} mg/dL
                    </Text>
                    {parseFloat(r.value) > 126 && <Ionicons name="warning-outline" size={16} color={Colors.warning} />}
                  </View>
                ))}
              </View>
            )}
            {glucoseRecords.length === 1 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="water-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Glycémie</Text>
                </View>
                <View style={styles.bpRow}>
                  <Text style={styles.recordDate}>{format(new Date(glucoseRecords[0].date), 'dd/MM HH:mm', { locale: fr })}</Text>
                  <Text style={[styles.bpValue, parseFloat(glucoseRecords[0].value) > 126 ? { color: Colors.error } : { color: Colors.success }]}>
                    {glucoseRecords[0].value} mg/dL
                  </Text>
                </View>
                <Text style={styles.chartHint}>Ajoutez plus de mesures pour voir l'évolution</Text>
              </View>
            )}

            {/* Recent Moods */}
            {records.filter(r => r.type === 'mood').length > 0 && (
              <View style={styles.chartCard}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="happy-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chartTitle}>Mon Humeur</Text>
                </View>
                {records.filter(r => r.type === 'mood').slice(0, 5).map((r) => (
                  <View key={r.id} style={styles.bpRow}>
                    <Text style={styles.recordDate}>{format(new Date(r.date), 'dd/MM', { locale: fr })}</Text>
                    <Text style={styles.moodValue}>{r.value}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'rdv' && (
          <View style={styles.content}>
            <TouchableOpacity style={styles.addRdvBtn} onPress={() => openModal('appointment')}>
              <LinearGradient colors={Colors.gradient.primary} style={styles.addRdvGradient}>
                <Ionicons name="add-circle-outline" size={22} color={Colors.white} />
                <Text style={styles.addRdvText}>Ajouter un rendez-vous</Text>
              </LinearGradient>
            </TouchableOpacity>

            {appointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={56} color={Colors.mauve} />
                <Text style={styles.emptyText}>Aucun rendez-vous planifié</Text>
                <Text style={styles.emptySubtext}>Ajoutez vos consultations et échographies</Text>
              </View>
            ) : (
              appointments.map((appt) => (
                <View key={appt.id} style={[styles.apptCard, appt.done && styles.apptCardDone]}>
                  <TouchableOpacity onPress={() => toggleAppointmentDone(appt.id)} style={styles.apptCheck}>
                    <View style={[styles.checkCircle, appt.done && styles.checkCircleDone]}>
                      {appt.done && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.apptInfo}>
                    <Text style={[styles.apptTitle, appt.done && styles.apptTitleDone]}>{appt.title}</Text>
                    <Text style={styles.apptDate}>📅 {appt.date}</Text>
                    {appt.doctor && <Text style={styles.apptDoctor}>👨‍⚕️ {appt.doctor}</Text>}
                    {appt.note && <Text style={styles.apptNote}>{appt.note}</Text>}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'conseils' && (
          <View style={styles.content}>
            {prenatalAdvice.map((section, idx) => (
              <View key={idx} style={styles.adviceCard}>
                <View style={[styles.adviceHeader, { backgroundColor: section.color + '15' }]}>
                  <Ionicons name={section.icon as any} size={22} color={section.color} style={{ marginRight: 10 }} />
                  <Text style={[styles.adviceCategory, { color: section.color }]}>{section.category}</Text>
                </View>
                {section.items.map((item, i) => (
                  <View key={i} style={styles.adviceItem}>
                    <View style={[styles.adviseBullet, { backgroundColor: section.color }]} />
                    <Text style={styles.adviceText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalType === 'weight' ? 'Ajouter le Poids' :
               modalType === 'bp' ? 'Ajouter la Tension' :
               modalType === 'glucose' ? 'Ajouter la Glycémie' :
               modalType === 'mood' ? 'Comment vous sentez-vous ?' :
               modalType === 'appointment' ? 'Nouveau Rendez-vous' :
               'Symptômes du jour'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {modalType === 'weight' && (
              <>
                <Text style={styles.inputLabel}>Poids (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 65.5"
                  placeholderTextColor={Colors.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
              </>
            )}

            {modalType === 'bp' && (
              <>
                <Text style={styles.inputLabel}>Tension systolique (haute)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="Ex: 120"
                  placeholderTextColor={Colors.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
                <Text style={styles.inputLabel}>Tension diastolique (basse)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="Ex: 80"
                  placeholderTextColor={Colors.textMuted}
                  value={inputValue2}
                  onChangeText={setInputValue2}
                />
                <View style={styles.bpInfo}>
                  <Text style={styles.bpInfoText}>🟢 Normale : &lt; 140/90 mmHg</Text>
                  <Text style={styles.bpInfoText}>🟡 Élevée : 140-159/90-99 mmHg</Text>
                  <Text style={styles.bpInfoText}>🔴 Urgence : &gt; 160/100 mmHg</Text>
                </View>
              </>
            )}

            {modalType === 'glucose' && (
              <>
                <Text style={styles.inputLabel}>Glycémie (mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 85"
                  placeholderTextColor={Colors.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
                <View style={styles.bpInfo}>
                  <Text style={styles.bpInfoText}>🟢 À jeun normale : &lt; 92 mg/dL</Text>
                  <Text style={styles.bpInfoText}>🟡 Diabète possible : 92-125 mg/dL</Text>
                  <Text style={styles.bpInfoText}>🔴 Diabète : &gt; 126 mg/dL</Text>
                </View>
              </>
            )}

            {modalType === 'mood' && (
              <>
                <Text style={styles.inputLabel}>Comment vous sentez-vous aujourd'hui ?</Text>
                <View style={styles.moodGrid}>
                  {MOOD_OPTIONS.map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[styles.moodOption, selectedMood === mood && styles.moodOptionSelected]}
                      onPress={() => setSelectedMood(mood)}
                    >
                      <Text style={[styles.moodOptionText, selectedMood === mood && styles.moodOptionTextSelected]}>
                        {mood}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {modalType === 'symptoms' && (
              <>
                <Text style={styles.inputLabel}>Décrivez vos symptômes</Text>
                <TextInput
                  style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Ex: Nausées le matin, maux de dos, fatigue..."
                  placeholderTextColor={Colors.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
              </>
            )}

            {modalType === 'appointment' && (
              <>
                <Text style={styles.inputLabel}>Titre du rendez-vous *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Échographie morphologique"
                  placeholderTextColor={Colors.textMuted}
                  value={rdvTitle}
                  onChangeText={setRdvTitle}
                  autoFocus
                />
                <Text style={styles.inputLabel}>Date et heure *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 15/07/2024 à 10h30"
                  placeholderTextColor={Colors.textMuted}
                  value={rdvDate}
                  onChangeText={setRdvDate}
                />
                <Text style={styles.inputLabel}>Médecin / Clinique</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Dr. Amira Ben Salem - Clinique La Rose"
                  placeholderTextColor={Colors.textMuted}
                  value={rdvDoctor}
                  onChangeText={setRdvDoctor}
                />
              </>
            )}

            {modalType !== 'appointment' && (
              <>
                <Text style={styles.inputLabel}>Note (optionnel)</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Remarques..."
                  placeholderTextColor={Colors.textMuted}
                  value={inputNote}
                  onChangeText={setInputNote}
                />
              </>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={saveRecord}>
              <LinearGradient colors={Colors.gradient.primary} style={styles.saveBtnGradient}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsHeader: {
    backgroundColor: Colors.surface,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18 + WAVE_H,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  content: {
    padding: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  healthCard: {
    width: (width - 44) / 2,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  healthCardGradient: {
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  cardEmpty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
  },
  cardNormal: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  symptomsBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  symptomsBtnGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  symptomsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  recordDate: {
    fontSize: 12,
    color: Colors.textLight,
    width: 50,
  },
  recordBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  recordFill: {
    height: 8,
    borderRadius: 4,
  },
  recordValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    width: 55,
    textAlign: 'right',
  },
  chartHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
    fontStyle: 'italic',
  },
  bpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bpValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  moodValue: {
    fontSize: 15,
    color: Colors.text,
  },
  addRdvBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  addRdvGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  addRdvText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
  },
  apptCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  apptCardDone: {
    opacity: 0.6,
  },
  apptCheck: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  apptInfo: {
    flex: 1,
  },
  apptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  apptTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  apptDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  apptDoctor: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  apptNote: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  adviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  adviceCategory: {
    fontSize: 16,
    fontWeight: '700',
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  adviseBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
    flexShrink: 0,
  },
  adviceText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  bpInfo: {
    backgroundColor: Colors.lilac,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  bpInfoText: {
    fontSize: 13,
    color: Colors.text,
  },
  moodGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  moodOption: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  moodOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  moodOptionText: {
    fontSize: 15,
    color: Colors.text,
  },
  moodOptionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  saveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 40,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});

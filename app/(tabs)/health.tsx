import React, { useState, useRef, useCallback } from 'react';
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
  Animated,
  Image,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as Notifications from 'expo-notifications';
import Colors from '../../src/theme/colors';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFocusEffect } from 'expo-router';
import { useStorage, STORAGE_KEYS } from '../../src/hooks/useStorage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'bp' | 'glucose' | 'mood' | 'symptoms' | 'temperature';
  value: string;
  value2?: string;
  note?: string;
}

interface Echographie {
  id: string;
  date: string;
  week: string;
  title: string;
  note?: string;
  photos?: string[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  note?: string;
  active: boolean;
}

const MOOD_OPTIONS = ['😊 Bien', '😴 Fatiguée', '🤢 Nausées', '😰 Anxieuse', '💪 Énergique', '😢 Triste', '🥰 Heureuse'];
const FREQUENCY_OPTIONS = ['1x par jour', '2x par jour', '3x par jour', 'Le matin', 'Le soir', 'Avant les repas', 'Après les repas'];

export default function HealthScreen() {
  const { isDark, th } = useTheme();
  const [records, setRecords] = useStorage<HealthRecord[]>(STORAGE_KEYS.HEALTH_RECORDS, []);
  const [echographies, setEchographies] = useStorage<Echographie[]>('echographies', []);
  const [medications, setMedications] = useStorage<Medication[]>('medications', []);
  const [activeTab, setActiveTab] = useState<'suivi' | 'echographies' | 'traitement' | 'conseils'>('suivi');
  const [expandedAdvice, setExpandedAdvice] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'bp' | 'glucose' | 'mood' | 'symptoms' | 'temperature' | 'echographie' | 'medication'>('weight');
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [echoDate, setEchoDate] = useState('');
  const [echoWeek, setEchoWeek] = useState('');
  const [echoTitle, setEchoTitle] = useState('');
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState(FREQUENCY_OPTIONS[0]);
  const [medTime, setMedTime] = useState('08:00');
  const [echoPhotos, setEchoPhotos] = useState<string[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
    }, [])
  );

  // Request notification permissions once on mount
  React.useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});
  }, []);

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setInputValue('');
    setInputValue2('');
    setInputNote('');
    setSelectedMood('');
    setEchoDate('');
    setEchoWeek('');
    setEchoTitle('');
    setMedName('');
    setMedDosage('');
    setMedFrequency(FREQUENCY_OPTIONS[0]);
    setMedTime('08:00');
    setEchoPhotos([]);
    setModalVisible(true);
  };

  const scheduleNotification = async (med: Medication) => {
    try {
      const [h, m] = med.time.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 Médicament : ${med.name}`,
          body: `Rappel : ${med.dosage} — ${med.frequency}`,
        },
        trigger: { hour: h, minute: m, repeats: true } as any,
      });
    } catch {}
  };

  const saveRecord = () => {
    if (modalType === 'echographie') {
      if (!echoTitle || !echoDate) {
        Alert.alert('Erreur', 'Veuillez remplir la date et le titre.');
        return;
      }
      const newEcho: Echographie = {
        id: Date.now().toString(),
        date: echoDate,
        week: echoWeek,
        title: echoTitle,
        note: inputNote || undefined,
        photos: echoPhotos.length > 0 ? echoPhotos : undefined,
      };
      setEchographies([newEcho, ...echographies]);
    } else if (modalType === 'medication') {
      if (!medName || !medDosage) {
        Alert.alert('Erreur', 'Veuillez remplir le nom et le dosage.');
        return;
      }
      const newMed: Medication = {
        id: Date.now().toString(),
        name: medName,
        dosage: medDosage,
        frequency: medFrequency,
        time: medTime,
        note: inputNote || undefined,
        active: true,
      };
      setMedications([newMed, ...medications]);
      scheduleNotification(newMed);
      Alert.alert('✅ Traitement ajouté', `Rappel programmé à ${medTime} — ${medFrequency}`);
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

  const toggleMedication = (id: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const deleteMedication = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer ce traitement ?', [
      { text: 'Annuler' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setMedications(medications.filter(m => m.id !== id)) },
    ]);
  };

  const deleteEchographie = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cette échographie ?', [
      { text: 'Annuler' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setEchographies(echographies.filter(e => e.id !== id)) },
    ]);
  };

  const pickEchoPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Autorisez l\'accès à la galerie pour ajouter des photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setEchoPhotos(prev => [...prev, result.assets[0].uri].slice(0, 6));
    }
  };

  const getLastRecord = (type: HealthRecord['type']) => {
    return records.find(r => r.type === type);
  };

  const weightRecords = records.filter(r => r.type === 'weight').slice(0, 10);
  const bpRecords = records.filter(r => r.type === 'bp').slice(0, 5);
  const glucoseRecords = records.filter(r => r.type === 'glucose').slice(0, 5);
  const temperatureRecords = records.filter(r => r.type === 'temperature').slice(0, 10);

  const healthCards = [
    {
      type: 'weight' as const,
      icon: 'scale-outline' as const,
      title: 'Poids',
      value: getLastRecord('weight')?.value,
      unit: 'kg',
      gradient: Colors.gradient.health as [string, string],
      normal: '+1-2kg/mois T2-T3',
    },
    {
      type: 'bp' as const,
      icon: 'heart-outline' as const,
      title: 'Tension',
      value: getLastRecord('bp') ? `${getLastRecord('bp')!.value}/${getLastRecord('bp')!.value2}` : undefined,
      unit: 'mmHg',
      gradient: [Colors.primaryDeep, Colors.primary] as [string, string],
      normal: '< 140/90 mmHg',
    },
    {
      type: 'glucose' as const,
      icon: 'water-outline' as const,
      title: 'Glycémie',
      value: getLastRecord('glucose')?.value,
      unit: 'mg/dL',
      gradient: [Colors.primary, Colors.primarySoft] as [string, string],
      normal: 'À jeun < 92',
    },
    {
      type: 'temperature' as const,
      icon: 'thermometer-outline' as const,
      title: 'Température',
      value: getLastRecord('temperature')?.value,
      unit: '°C',
      gradient: ['#EF4444', '#F97316'] as [string, string],
      normal: 'Normale 36.5–37.5',
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
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      {/* Header + Tabs */}
      <View style={[styles.tabsHeader, { backgroundColor: th.card }]}>
        <LinearGradient colors={Colors.gradient.primary} style={styles.headerGradient}>
          <View style={styles.headerRow}>
            <Ionicons name="medkit-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
            <Text style={styles.headerTitle}>Suivi Santé</Text>
          </View>
          <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
            <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
          </Svg>
        </LinearGradient>
        <View style={[styles.tabsRow, { backgroundColor: th.card, borderBottomColor: th.border }]}>
          {([
            { id: 'suivi', label: 'Suivi', icon: 'bar-chart-outline' },
            { id: 'echographies', label: 'Échos', icon: 'images-outline' },
            { id: 'traitement', label: 'Traitement', icon: 'medical-outline' },
            { id: 'conseils', label: 'Conseils', icon: 'bulb-outline' },
          ] as const).map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={13}
                color={activeTab === tab.id ? Colors.white : Colors.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.ScrollView showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim, backgroundColor: th.bg }}>
        {activeTab === 'suivi' && (
          <View style={styles.content}>
            {/* Image banner */}
            <View style={styles.imageBanner}>
              <Image
                source={require('../../assets/images/health-banner.jpg')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.72)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.imageBannerInner}>
                <Text style={styles.imageBannerTitle}>Suivi Santé</Text>
                <Text style={styles.imageBannerSub}>Suivez vos constantes vitales tout au long de la grossesse</Text>
              </View>
            </View>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="trending-up-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Évolution du Poids</Text>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="trending-up-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Évolution du Poids</Text>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="heart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Tension Artérielle (systolique)</Text>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="heart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Tension Artérielle</Text>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="water-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Glycémie</Text>
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
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="water-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Glycémie</Text>
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

            {/* Temperature LineChart */}
            {temperatureRecords.length >= 2 && (
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="thermometer-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Température</Text>
                </View>
                <LineChart
                  data={{
                    labels: temperatureRecords.slice(0, 7).reverse().map(r => format(new Date(r.date), 'dd/MM', { locale: fr })),
                    datasets: [{ data: temperatureRecords.slice(0, 7).reverse().map(r => parseFloat(r.value) || 0) }],
                  }}
                  width={width - 64}
                  height={160}
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(91, 33, 182, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: '#EF4444' },
                    propsForBackgroundLines: { stroke: Colors.border },
                  }}
                  bezier
                  style={{ borderRadius: 12, marginVertical: 4 }}
                  yAxisSuffix="°C"
                />
                {temperatureRecords.slice(0, 5).map((r) => (
                  <View key={r.id} style={styles.bpRow}>
                    <Text style={styles.recordDate}>{format(new Date(r.date), 'dd/MM HH:mm', { locale: fr })}</Text>
                    <Text style={[styles.bpValue, parseFloat(r.value) >= 38 ? { color: Colors.error } : parseFloat(r.value) >= 37.5 ? { color: Colors.warning } : { color: Colors.success }]}>
                      {r.value}°C
                    </Text>
                    {parseFloat(r.value) >= 38 && <Ionicons name="warning-outline" size={16} color={Colors.warning} />}
                  </View>
                ))}
              </View>
            )}
            {temperatureRecords.length === 1 && (
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="thermometer-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Température</Text>
                </View>
                <View style={styles.bpRow}>
                  <Text style={styles.recordDate}>{format(new Date(temperatureRecords[0].date), 'dd/MM HH:mm', { locale: fr })}</Text>
                  <Text style={[styles.bpValue, parseFloat(temperatureRecords[0].value) >= 38 ? { color: Colors.error } : { color: Colors.success }]}>
                    {temperatureRecords[0].value}°C
                  </Text>
                </View>
                <Text style={styles.chartHint}>Ajoutez plus de mesures pour voir l'évolution</Text>
              </View>
            )}

            {/* Recent Moods */}
            {records.filter(r => r.type === 'mood').length > 0 && (
              <View style={[styles.chartCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.chartTitleRow}>
                  <Ionicons name="happy-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.chartTitle, { color: th.text }]}>Mon Humeur</Text>
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

        {activeTab === 'echographies' && (
          <View style={styles.content}>
            <TouchableOpacity style={styles.addRdvBtn} onPress={() => openModal('echographie')}>
              <LinearGradient colors={Colors.gradient.primary} style={styles.addRdvGradient}>
                <Ionicons name="add-circle-outline" size={22} color={Colors.white} />
                <Text style={styles.addRdvText}>Ajouter une échographie</Text>
              </LinearGradient>
            </TouchableOpacity>

            {echographies.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="images-outline" size={56} color={Colors.mauve} />
                <Text style={styles.emptyText}>Aucune échographie enregistrée</Text>
                <Text style={styles.emptySubtext}>Notez la date, la semaine et vos observations</Text>
              </View>
            ) : (
              echographies.map((echo) => (
                <View key={echo.id} style={[styles.echoCard, { backgroundColor: th.card, borderColor: th.border }]}>
                  <View style={styles.echoCardTop}>
                    <View style={styles.echoIconBox}>
                      <Ionicons name="scan-outline" size={28} color={Colors.primary} />
                    </View>
                    <View style={styles.echoInfo}>
                      <Text style={[styles.echoTitle, { color: th.text }]}>{echo.title}</Text>
                      <Text style={[styles.echoMeta, { color: th.textSub }]}>📅 {echo.date}{echo.week ? ` · SA ${echo.week}` : ''}</Text>
                      {echo.note && <Text style={styles.echoNote}>{echo.note}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => deleteEchographie(echo.id)} style={styles.echoDeleteBtn}>
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                  {echo.photos && echo.photos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.echoPhotosRow} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
                      {echo.photos.map((uri, idx) => (
                        <TouchableOpacity key={idx} onPress={() => setLightboxPhoto(uri)} activeOpacity={0.85}>
                          <Image source={{ uri }} style={styles.echoThumb} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'traitement' && (
          <View style={styles.content}>
            <View style={styles.traitementInfo}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.traitementInfoText}>Les rappels seront programmés à l'heure choisie. Consultez toujours votre médecin.</Text>
            </View>

            <TouchableOpacity style={styles.addRdvBtn} onPress={() => openModal('medication')}>
              <LinearGradient colors={['#059669', '#10B981']} style={styles.addRdvGradient}>
                <Ionicons name="add-circle-outline" size={22} color={Colors.white} />
                <Text style={styles.addRdvText}>Ajouter un traitement</Text>
              </LinearGradient>
            </TouchableOpacity>

            {medications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="medical-outline" size={56} color={Colors.mauve} />
                <Text style={styles.emptyText}>Aucun traitement enregistré</Text>
                <Text style={styles.emptySubtext}>Ajoutez vos médicaments avec rappel</Text>
              </View>
            ) : (
              medications.map((med) => (
                <View key={med.id} style={[styles.medCard, { backgroundColor: th.card, borderColor: th.border }, !med.active && { opacity: 0.5 }]}>
                  <View style={[styles.medIconBox, { backgroundColor: med.active ? '#D1FAE5' : Colors.border }]}>
                    <Ionicons name="medical-outline" size={22} color={med.active ? '#059669' : Colors.textMuted} />
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={[styles.medName, { color: th.text }]}>{med.name}</Text>
                    <Text style={[styles.medDosage, { color: th.textSub }]}>{med.dosage} · {med.frequency}</Text>
                    <View style={styles.medTimeRow}>
                      <Ionicons name="alarm-outline" size={13} color={Colors.textMuted} />
                      <Text style={styles.medTime}>{med.time}</Text>
                    </View>
                  </View>
                  <View style={styles.medActions}>
                    <TouchableOpacity onPress={() => toggleMedication(med.id)} style={styles.medToggle}>
                      <Ionicons name={med.active ? 'pause-circle-outline' : 'play-circle-outline'} size={22} color={med.active ? '#059669' : Colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMedication(med.id)} style={styles.medDelete}>
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'conseils' && (
          <View style={styles.content}>
            {prenatalAdvice.map((section, idx) => (
              <View key={idx} style={[styles.adviceCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <TouchableOpacity
                  style={[styles.adviceHeader, { backgroundColor: section.color + '15' }]}
                  onPress={() => setExpandedAdvice(expandedAdvice === idx ? null : idx)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={section.icon as any} size={20} color={section.color} style={{ marginRight: 10 }} />
                  <Text style={[styles.adviceCategory, { color: section.color, flex: 1 }]}>{section.category}</Text>
                  <Ionicons
                    name={expandedAdvice === idx ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={section.color}
                  />
                </TouchableOpacity>
                {expandedAdvice === idx && section.items.map((item, i) => (
                  <View key={i} style={styles.adviceItem}>
                    <View style={[styles.adviseBullet, { backgroundColor: section.color }]} />
                    <Text style={[styles.adviceText, { color: th.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Lightbox */}
      <Modal visible={!!lightboxPhoto} transparent animationType="fade" onRequestClose={() => setLightboxPhoto(null)}>
        <TouchableOpacity style={styles.lightboxOverlay} activeOpacity={1} onPress={() => setLightboxPhoto(null)}>
          {lightboxPhoto && (
            <Image source={{ uri: lightboxPhoto }} style={styles.lightboxImage} resizeMode="contain" />
          )}
          <TouchableOpacity style={styles.lightboxClose} onPress={() => setLightboxPhoto(null)}>
            <Ionicons name="close-circle" size={36} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: th.border }]}>
            <Text style={[styles.modalTitle, { color: th.text }]}>
              {modalType === 'weight' ? 'Ajouter le Poids' :
               modalType === 'bp' ? 'Ajouter la Tension' :
               modalType === 'glucose' ? 'Ajouter la Glycémie' :
               modalType === 'temperature' ? 'Ajouter la Température' :
               modalType === 'mood' ? 'Comment vous sentez-vous ?' :
               modalType === 'echographie' ? 'Nouvelle Échographie' :
               modalType === 'medication' ? 'Nouveau Traitement' :
               'Symptômes du jour'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {modalType === 'weight' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Poids (kg)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 65.5"
                  placeholderTextColor={th.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
              </>
            )}

            {modalType === 'bp' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Tension systolique (haute)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  keyboardType="number-pad"
                  placeholder="Ex: 120"
                  placeholderTextColor={th.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Tension diastolique (basse)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  keyboardType="number-pad"
                  placeholder="Ex: 80"
                  placeholderTextColor={th.textMuted}
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
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Glycémie (mg/dL)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 85"
                  placeholderTextColor={th.textMuted}
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
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Décrivez vos symptômes</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border, height: 120, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Ex: Nausées le matin, maux de dos, fatigue..."
                  placeholderTextColor={th.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
              </>
            )}

            {modalType === 'temperature' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Température (°C)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 37.2"
                  placeholderTextColor={th.textMuted}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                />
                <View style={styles.bpInfo}>
                  <Text style={styles.bpInfoText}>🟢 Normale : 36.5–37.5°C</Text>
                  <Text style={styles.bpInfoText}>🟡 Légère fièvre : 37.5–38°C</Text>
                  <Text style={styles.bpInfoText}>🔴 Fièvre : &gt; 38°C → Consulter</Text>
                </View>
              </>
            )}

            {modalType === 'echographie' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Titre *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: Échographie morphologique"
                  placeholderTextColor={th.textMuted}
                  value={echoTitle}
                  onChangeText={setEchoTitle}
                  autoFocus
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Date *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: 15/07/2024"
                  placeholderTextColor={th.textMuted}
                  value={echoDate}
                  onChangeText={setEchoDate}
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Semaine d'aménorrhée</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: 22"
                  keyboardType="number-pad"
                  placeholderTextColor={th.textMuted}
                  value={echoWeek}
                  onChangeText={setEchoWeek}
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Observations</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border, height: 80, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Mesures, position, sexe, remarques..."
                  placeholderTextColor={th.textMuted}
                  value={inputNote}
                  onChangeText={setInputNote}
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Photos ({echoPhotos.length}/6)</Text>
                {echoPhotos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} contentContainerStyle={{ gap: 8 }}>
                    {echoPhotos.map((uri, idx) => (
                      <View key={idx} style={styles.photoThumbWrap}>
                        <Image source={{ uri }} style={styles.photoThumb} />
                        <TouchableOpacity
                          style={styles.photoThumbRemove}
                          onPress={() => setEchoPhotos(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <Ionicons name="close-circle" size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
                {echoPhotos.length < 6 && (
                  <TouchableOpacity style={[styles.photoPickBtn, { backgroundColor: th.infoBox, borderColor: th.border }]} onPress={pickEchoPhoto}>
                    <Ionicons name="camera-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.photoPickBtnText, { color: Colors.primary }]}>Ajouter une photo</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {modalType === 'medication' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Nom du médicament *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: Acide folique"
                  placeholderTextColor={th.textMuted}
                  value={medName}
                  onChangeText={setMedName}
                  autoFocus
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Dosage *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: 400 mcg / 1 comprimé"
                  placeholderTextColor={th.textMuted}
                  value={medDosage}
                  onChangeText={setMedDosage}
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Fréquence</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {FREQUENCY_OPTIONS.map(f => (
                      <TouchableOpacity
                        key={f}
                        style={[styles.freqChip, medFrequency === f && styles.freqChipActive]}
                        onPress={() => setMedFrequency(f)}
                      >
                        <Text style={[styles.freqChipText, medFrequency === f && styles.freqChipTextActive]}>{f}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Heure du rappel</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
                  placeholder="Ex: 08:00"
                  placeholderTextColor={th.textMuted}
                  value={medTime}
                  onChangeText={setMedTime}
                />
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Note (optionnel)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border, height: 60, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Instructions particulières..."
                  placeholderTextColor={th.textMuted}
                  value={inputNote}
                  onChangeText={setInputNote}
                />
              </>
            )}

            {modalType !== 'echographie' && modalType !== 'medication' && (
              <>
                <Text style={[styles.inputLabel, { color: th.textSub }]}>Note (optionnel)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border, height: 80, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Remarques..."
                  placeholderTextColor={th.textMuted}
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 2,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 10,
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
  echoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  echoCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  echoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.lilac,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  echoInfo: { flex: 1 },
  echoTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  echoMeta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  echoNote: { fontSize: 12, color: Colors.textLight, fontStyle: 'italic' },
  echoDeleteBtn: { padding: 4 },
  echoPhotosRow: { paddingBottom: 12 },
  echoThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
  photoThumbWrap: { position: 'relative' },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
  photoThumbRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  photoPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  photoPickBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '100%',
    height: '85%',
  },
  lightboxClose: {
    position: 'absolute',
    top: 56,
    right: 20,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  medDosage: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  medTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  medTime: { fontSize: 12, color: Colors.textMuted },
  medActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  medToggle: { padding: 4 },
  medDelete: { padding: 4 },
  traitementInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  traitementInfoText: { fontSize: 12, color: Colors.text, flex: 1, lineHeight: 18 },
  freqChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  freqChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  freqChipText: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  freqChipTextActive: { color: Colors.white, fontWeight: '700' },
  imageBanner: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
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
});

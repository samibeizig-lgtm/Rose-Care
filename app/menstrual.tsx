import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';
import { useStorage, STORAGE_KEYS } from '../src/hooks/useStorage';
import { addDays, format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CycleEntry {
  id: string;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  periodLength?: number;
  symptoms?: string[];
  mood?: string;
  note?: string;
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function MenstrualScreen() {
  const router = useRouter();
  const [cycles, setCycles] = useStorage<CycleEntry[]>(STORAGE_KEYS.MENSTRUAL_CYCLES, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'calendrier' | 'historique' | 'conseils'>('calendrier');

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const addCycle = () => {
    if (!newStart) {
      Alert.alert('Erreur', 'Veuillez entrer la date de début');
      return;
    }
    const newCycle: CycleEntry = {
      id: Date.now().toString(),
      startDate: newStart,
      endDate: newEnd || undefined,
      note: newNote || undefined,
    };
    setCycles([...cycles, newCycle].sort((a, b) => b.startDate.localeCompare(a.startDate)));
    setModalVisible(false);
    setNewStart('');
    setNewEnd('');
    setNewNote('');
  };

  const getLastCycle = () => cycles[0];
  const getAverageCycleLength = () => {
    if (cycles.length < 2) return 28;
    const lengths: number[] = [];
    for (let i = 0; i < cycles.length - 1; i++) {
      const diff = differenceInDays(parseISO(cycles[i].startDate), parseISO(cycles[i + 1].startDate));
      if (diff > 0 && diff < 60) lengths.push(diff);
    }
    return lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 28;
  };

  const avgCycle = getAverageCycleLength();
  const lastCycle = getLastCycle();
  const nextPeriod = lastCycle ? addDays(parseISO(lastCycle.startDate), avgCycle) : null;
  const ovulationDate = lastCycle ? addDays(parseISO(lastCycle.startDate), avgCycle - 14) : null;
  const fertileStart = ovulationDate ? addDays(ovulationDate, -5) : null;
  const fertileEnd = ovulationDate ? addDays(ovulationDate, 1) : null;

  const daysUntilNext = nextPeriod ? differenceInDays(nextPeriod, today) : null;

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const getDayStatus = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dateStr = format(date, 'yyyy-MM-dd');

    for (const cycle of cycles) {
      const startDate = parseISO(cycle.startDate);
      const endDate = cycle.endDate ? parseISO(cycle.endDate) : addDays(startDate, 5);
      if (date >= startDate && date <= endDate) return 'period';
    }

    if (fertileStart && fertileEnd && date >= fertileStart && date <= fertileEnd) return 'fertile';
    if (ovulationDate && format(date, 'yyyy-MM-dd') === format(ovulationDate, 'yyyy-MM-dd')) return 'ovulation';
    if (nextPeriod && format(date, 'yyyy-MM-dd') === format(nextPeriod, 'yyyy-MM-dd')) return 'predicted';

    return null;
  };

  const periodTips = [
    { title: 'Régularité', tip: 'Un cycle sain dure entre 21 et 35 jours.', icon: '📅' },
    { title: 'Douleurs menstruelles', tip: 'Les crampes légères sont normales. Des douleurs intenses peuvent indiquer une endométriose.', icon: '💊' },
    { title: 'Ovulation', tip: 'L\'ovulation se produit ~14 jours avant les règles suivantes.', icon: '🌱' },
    { title: 'Fenêtre fertile', tip: 'La fenêtre fertile dure environ 6 jours autour de l\'ovulation.', icon: '🎯' },
    { title: 'Température basale', tip: 'La température monte de 0.2-0.5°C après l\'ovulation.', icon: '🌡️' },
    { title: 'Glaire cervicale', tip: 'Claire et élastique comme du blanc d\'œuf = jour fertile.', icon: '💧' },
    { title: 'SPM', tip: 'Le syndrome prémenstruel dure 1-2 semaines avant les règles.', icon: '😤' },
    { title: 'Nutrition', tip: 'Le magnésium et les oméga-3 aident à réduire les crampes.', icon: '🥗' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[Colors.accentDark, Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendrier Menstruel 🌙</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgCycle}j</Text>
            <Text style={styles.statLabel}>Cycle moyen</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{daysUntilNext !== null ? (daysUntilNext >= 0 ? `J-${daysUntilNext}` : 'En retard') : '--'}</Text>
            <Text style={styles.statLabel}>Prochaines règles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{cycles.length}</Text>
            <Text style={styles.statLabel}>Cycles enregistrés</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['calendrier', 'historique', 'conseils'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'calendrier' ? '📅 Calendrier' : tab === 'historique' ? '📊 Historique' : '💡 Conseils'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {activeTab === 'calendrier' && (
            <>
              {/* Month Navigation */}
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={() => {
                  if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
                  else setSelectedMonth(m => m - 1);
                }}>
                  <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{MONTHS[selectedMonth]} {selectedYear}</Text>
                <TouchableOpacity onPress={() => {
                  if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
                  else setSelectedMonth(m => m + 1);
                }}>
                  <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Calendar Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.primary }]} /><Text style={styles.legendText}>Règles</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} /><Text style={styles.legendText}>Fertile</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.gold }]} /><Text style={styles.legendText}>Ovulation</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary }]} /><Text style={styles.legendText}>Prévision</Text></View>
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarCard}>
                <View style={styles.weekDays}>
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                    <Text key={i} style={styles.weekDay}>{d}</Text>
                  ))}
                </View>
                <View style={styles.daysGrid}>
                  {Array(firstDayOfMonth).fill(null).map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
                  {Array(daysInMonth).fill(null).map((_, i) => {
                    const day = i + 1;
                    const status = getDayStatus(day);
                    const isToday = new Date(selectedYear, selectedMonth, day).toDateString() === today.toDateString();
                    return (
                      <View key={day} style={[
                        styles.dayCell,
                        status === 'period' && styles.dayPeriod,
                        status === 'fertile' && styles.dayFertile,
                        status === 'ovulation' && styles.dayOvulation,
                        status === 'predicted' && styles.dayPredicted,
                        isToday && styles.dayToday,
                      ]}>
                        <Text style={[
                          styles.dayText,
                          status && { color: status === 'fertile' || status === 'ovulation' ? Colors.white : status === 'period' ? Colors.white : Colors.primary },
                          isToday && styles.dayTextToday,
                        ]}>
                          {day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Predictions */}
              {nextPeriod && (
                <View style={styles.predictionCard}>
                  <Text style={styles.predictionTitle}>🔮 Prévisions</Text>
                  <View style={styles.predRow}><Text style={styles.predIcon}>🩸</Text><Text style={styles.predText}>Prochaines règles : <Text style={{ fontWeight: '700', color: Colors.primary }}>{format(nextPeriod, 'dd MMMM yyyy', { locale: fr })}</Text></Text></View>
                  {ovulationDate && <View style={styles.predRow}><Text style={styles.predIcon}>🥚</Text><Text style={styles.predText}>Ovulation prévue : <Text style={{ fontWeight: '700', color: Colors.gold }}>{format(ovulationDate, 'dd MMMM yyyy', { locale: fr })}</Text></Text></View>}
                  {fertileStart && fertileEnd && <View style={styles.predRow}><Text style={styles.predIcon}>🌱</Text><Text style={styles.predText}>Période fertile : <Text style={{ fontWeight: '700', color: Colors.success }}>{format(fertileStart, 'dd/MM', { locale: fr })} - {format(fertileEnd, 'dd/MM yyyy', { locale: fr })}</Text></Text></View>}
                </View>
              )}

              {/* Add Button */}
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.addBtnGrad}>
                  <Ionicons name="add" size={20} color={Colors.white} />
                  <Text style={styles.addBtnText}>Ajouter un cycle</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'historique' && (
            <>
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.addBtnGrad}>
                  <Ionicons name="add" size={20} color={Colors.white} />
                  <Text style={styles.addBtnText}>Ajouter un cycle</Text>
                </LinearGradient>
              </TouchableOpacity>

              {cycles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🌙</Text>
                  <Text style={styles.emptyText}>Aucun cycle enregistré</Text>
                  <Text style={styles.emptySubtext}>Commencez à suivre votre cycle pour obtenir des prévisions précises.</Text>
                </View>
              ) : (
                cycles.map((cycle) => (
                  <View key={cycle.id} style={styles.cycleCard}>
                    <View style={styles.cycleDot} />
                    <View style={styles.cycleInfo}>
                      <Text style={styles.cycleDate}>Début : {cycle.startDate}</Text>
                      {cycle.endDate && <Text style={styles.cycleEnd}>Fin : {cycle.endDate}</Text>}
                      {cycle.note && <Text style={styles.cycleNote}>{cycle.note}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => setCycles(cycles.filter(c => c.id !== cycle.id))}>
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </>
          )}

          {activeTab === 'conseils' && (
            <>
              <Text style={styles.sectionTitle}>💡 Comprendre son Cycle</Text>
              {periodTips.map((tip, idx) => (
                <View key={idx} style={styles.tipCard}>
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipText}>{tip.tip}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Cycle Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouveau Cycle</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={26} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Date de début *</Text>
            <TextInput style={styles.input} value={newStart} onChangeText={setNewStart} placeholder="Ex: 2024-03-15 (AAAA-MM-JJ)" />
            <Text style={styles.inputLabel}>Date de fin</Text>
            <TextInput style={styles.input} value={newEnd} onChangeText={setNewEnd} placeholder="Ex: 2024-03-20" />
            <Text style={styles.inputLabel}>Note</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline value={newNote} onChangeText={setNewNote} placeholder="Symptômes, notes..." />
            <TouchableOpacity style={styles.saveBtn} onPress={addCycle}>
              <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.saveBtnGrad}>
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 16 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 6 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.background },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  content: { padding: 16 },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textTransform: 'capitalize' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
  calendarCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 12, marginBottom: 16, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  weekDays: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.textLight },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 2 },
  dayPeriod: { backgroundColor: Colors.primary + 'CC', borderRadius: 8 },
  dayFertile: { backgroundColor: Colors.success, borderRadius: 8 },
  dayOvulation: { backgroundColor: Colors.gold, borderRadius: 8 },
  dayPredicted: { backgroundColor: Colors.primaryLight + '80', borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  dayToday: { borderWidth: 2, borderColor: Colors.primary },
  dayText: { fontSize: 13, color: Colors.text },
  dayTextToday: { fontWeight: '800', color: Colors.primary },
  predictionCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  predictionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  predRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  predIcon: { fontSize: 20 },
  predText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  addBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  cycleCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  cycleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, marginTop: 4 },
  cycleInfo: { flex: 1 },
  cycleDate: { fontSize: 14, fontWeight: '700', color: Colors.text },
  cycleEnd: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  cycleNote: { fontSize: 12, color: Colors.textLight, marginTop: 4, fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  tipCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12, alignItems: 'flex-start' },
  tipIcon: { fontSize: 24 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tipText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 24, marginBottom: 40 },
  saveBtnGrad: { padding: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

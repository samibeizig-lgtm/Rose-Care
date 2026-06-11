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
import { useTheme } from '../src/theme/ThemeContext';
import { useStorage, STORAGE_KEYS } from '../src/hooks/useStorage';
import { addDays, format, parseISO, differenceInDays, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePickerModal from '../src/components/DatePickerModal';

interface CycleEntry {
  id: string;
  startDate: string;
  endDate?: string;
  note?: string;
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function MenstrualScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [cycles, setCycles] = useStorage<CycleEntry[]>(STORAGE_KEYS.MENSTRUAL_CYCLES, []);
  const [cycleLengthStorage, setCycleLengthStorage] = useStorage(STORAGE_KEYS.CYCLE_LENGTH, '28');
  const [lastPeriodStorage, setLastPeriodStorage] = useStorage(STORAGE_KEYS.LAST_PERIOD_DATE, '');

  const [modalVisible, setModalVisible] = useState(false);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [lastPeriodPicker, setLastPeriodPicker] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'calendrier' | 'historique' | 'conseils'>('calendrier');

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const cycleLength = parseInt(cycleLengthStorage || '28', 10) || 28;

  // Get last period date from shared storage (dd/MM/yyyy) or fallback to first cycle
  const getLastPeriodDate = (): Date | null => {
    if (lastPeriodStorage) {
      try {
        const parsed = parse(lastPeriodStorage, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) return parsed;
      } catch {}
    }
    if (cycles.length > 0) {
      try {
        const parsed = parseISO(cycles[0].startDate);
        if (isValid(parsed)) return parsed;
      } catch {}
    }
    return null;
  };

  const lastPeriodDate = getLastPeriodDate();
  const nextPeriod = lastPeriodDate ? addDays(lastPeriodDate, cycleLength) : null;
  const ovulationDate = lastPeriodDate ? addDays(lastPeriodDate, cycleLength - 14) : null;
  const fertileStart = ovulationDate ? addDays(ovulationDate, -5) : null;
  const fertileEnd = ovulationDate ? addDays(ovulationDate, 1) : null;
  const daysUntilNext = nextPeriod ? differenceInDays(nextPeriod, today) : null;

  const adjustCycleLength = (delta: number) => {
    const newLen = Math.min(45, Math.max(21, cycleLength + delta));
    setCycleLengthStorage(String(newLen));
  };

  const addCycle = () => {
    if (!newStartDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner la date de début');
      return;
    }
    const startStr = format(newStartDate, 'yyyy-MM-dd');
    const endStr = newEndDate ? format(newEndDate, 'yyyy-MM-dd') : undefined;
    const newCycle: CycleEntry = {
      id: Date.now().toString(),
      startDate: startStr,
      endDate: endStr,
      note: newNote || undefined,
    };
    const sorted = [...cycles, newCycle].sort((a, b) => b.startDate.localeCompare(a.startDate));
    setCycles(sorted);
    // Update shared last period date
    setLastPeriodStorage(format(newStartDate, 'dd/MM/yyyy'));
    setModalVisible(false);
    setNewStartDate(null);
    setNewEndDate(null);
    setNewNote('');
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const getDayStatus = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);

    for (const cycle of cycles) {
      try {
        const startDate = parseISO(cycle.startDate);
        const endDate = cycle.endDate ? parseISO(cycle.endDate) : addDays(startDate, 5);
        if (date >= startDate && date <= endDate) return 'period';
      } catch {}
    }

    // Show current period from lastPeriodDate even if not added to cycles array
    if (lastPeriodDate && cycles.length === 0) {
      const periodEnd = addDays(lastPeriodDate, 5);
      if (date >= lastPeriodDate && date <= periodEnd) return 'period';
    }

    if (fertileStart && fertileEnd && date >= fertileStart && date <= fertileEnd) return 'fertile';
    if (ovulationDate && format(date, 'yyyy-MM-dd') === format(ovulationDate, 'yyyy-MM-dd')) return 'ovulation';
    if (nextPeriod && format(date, 'yyyy-MM-dd') === format(nextPeriod, 'yyyy-MM-dd')) return 'predicted';
    return null;
  };

  const periodTips = [
    { title: 'Régularité', tip: 'Un cycle sain dure entre 21 et 35 jours.', icon: 'calendar-outline' },
    { title: 'Douleurs menstruelles', tip: 'Les crampes légères sont normales. Des douleurs intenses peuvent indiquer une endométriose.', icon: 'medical-outline' },
    { title: 'Ovulation', tip: "L'ovulation se produit ~14 jours avant les règles suivantes.", icon: 'flower-outline' },
    { title: 'Fenêtre fertile', tip: "La fenêtre fertile dure environ 6 jours autour de l'ovulation.", icon: 'sparkles-outline' },
    { title: 'Température basale', tip: 'La température monte de 0.2-0.5°C après l\'ovulation.', icon: 'thermometer-outline' },
    { title: 'Glaire cervicale', tip: 'Claire et élastique comme du blanc d\'œuf = jour fertile.', icon: 'water-outline' },
    { title: 'SPM', tip: 'Le syndrome prémenstruel dure 1-2 semaines avant les règles.', icon: 'sad-outline' },
    { title: 'Nutrition', tip: 'Le magnésium et les oméga-3 aident à réduire les crampes.', icon: 'nutrition-outline' },
  ];

  const TABS = [
    { id: 'calendrier', label: 'Calendrier', icon: 'calendar-outline' },
    { id: 'historique', label: 'Historique', icon: 'stats-chart-outline' },
    { id: 'conseils', label: 'Conseils', icon: 'bulb-outline' },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      <LinearGradient colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Ionicons name="moon-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
          <Text style={styles.headerTitle}>Calendrier Menstruel</Text>
        </View>

        {/* Cycle length stepper */}
        <View style={styles.cycleLengthRow}>
          <Text style={styles.cycleLengthLabel}>Durée du cycle</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustCycleLength(-1)}>
              <Ionicons name="remove" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{cycleLength}j</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustCycleLength(1)}>
              <Ionicons name="add" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{cycleLength}j</Text>
            <Text style={styles.statLabel}>Cycle moyen</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {daysUntilNext !== null ? (daysUntilNext >= 0 ? `J-${daysUntilNext}` : 'En retard') : '--'}
            </Text>
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
      <View style={[styles.tabs, { backgroundColor: th.card, borderBottomColor: th.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: th.bg }}>
        <View style={styles.content}>

          {activeTab === 'calendrier' && (
            <>
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={() => {
                  if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
                  else setSelectedMonth(m => m - 1);
                }}>
                  <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.monthTitle, { color: th.text }]}>{MONTHS[selectedMonth]} {selectedYear}</Text>
                <TouchableOpacity onPress={() => {
                  if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
                  else setSelectedMonth(m => m + 1);
                }}>
                  <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Last period date quick setter */}
              <TouchableOpacity style={[styles.lastPeriodBtn, { backgroundColor: th.card, borderColor: th.border }]} onPress={() => setLastPeriodPicker(true)}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.lastPeriodBtnLabel, { color: th.textSub }]}>Dernières règles :</Text>
                <Text style={styles.lastPeriodBtnValue}>
                  {lastPeriodStorage ? lastPeriodStorage : 'Non renseigné'}
                </Text>
                <Ionicons name="pencil-outline" size={14} color={Colors.textLight} style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Legend */}
              <View style={styles.legend}>
                <View style={[styles.legendChip, { backgroundColor: th.card, borderColor: th.border }]}><View style={[styles.legendDot, { backgroundColor: Colors.primary + 'CC' }]} /><Text style={[styles.legendText, { color: th.textSub }]}>Règles</Text></View>
                <View style={[styles.legendChip, { backgroundColor: th.card, borderColor: th.border }]}><View style={[styles.legendDot, { backgroundColor: Colors.success }]} /><Text style={[styles.legendText, { color: th.textSub }]}>Fertile</Text></View>
                <View style={[styles.legendChip, { backgroundColor: th.card, borderColor: th.border }]}><View style={[styles.legendDot, { backgroundColor: Colors.rose, borderRadius: 8 }]} /><Text style={[styles.legendText, { color: th.textSub }]}>Ovulation</Text></View>
                <View style={[styles.legendChip, { backgroundColor: th.card, borderColor: th.border }]}><View style={[styles.legendDot, { backgroundColor: Colors.primaryLight + '80', borderWidth: 1, borderColor: Colors.primary }]} /><Text style={[styles.legendText, { color: th.textSub }]}>Prévision</Text></View>
              </View>

              <View style={[styles.calendarCard, { backgroundColor: th.card }]}>
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
                          { color: th.text },
                          status === 'period' && { color: Colors.white },
                          status === 'fertile' && { color: Colors.white },
                          status === 'ovulation' && { color: Colors.white },
                          status === 'predicted' && { color: Colors.primary },
                          isToday && styles.dayTextToday,
                        ]}>
                          {day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {nextPeriod && (
                <View style={[styles.predictionCard, { backgroundColor: th.card, borderColor: th.border }]}>
                  <View style={styles.predictionTitleRow}>
                    <Ionicons name="analytics-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.predictionTitle, { color: th.text }]}>Prévisions</Text>
                  </View>
                  <View style={styles.predRow}>
                    <View style={[styles.predDot, { backgroundColor: Colors.primary }]} />
                    <Text style={styles.predText}>Prochaines règles : <Text style={{ fontWeight: '700', color: Colors.primary }}>{format(nextPeriod, 'dd MMMM yyyy', { locale: fr })}</Text></Text>
                  </View>
                  {ovulationDate && (
                    <View style={styles.predRow}>
                      <View style={[styles.predDot, { backgroundColor: Colors.rose }]} />
                      <Text style={[styles.predText, { color: th.text }]}>Ovulation prévue : <Text style={{ fontWeight: '700', color: Colors.rose }}>{format(ovulationDate, 'dd MMMM yyyy', { locale: fr })}</Text></Text>
                    </View>
                  )}
                  {fertileStart && fertileEnd && (
                    <View style={styles.predRow}>
                      <View style={[styles.predDot, { backgroundColor: Colors.success }]} />
                      <Text style={[styles.predText, { color: th.text }]}>Période fertile : <Text style={{ fontWeight: '700', color: Colors.success }}>{format(fertileStart, 'dd/MM', { locale: fr })} - {format(fertileEnd, 'dd/MM yyyy', { locale: fr })}</Text></Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]} style={styles.addBtnGrad}>
                  <Ionicons name="add" size={20} color={Colors.white} />
                  <Text style={styles.addBtnText}>Ajouter un cycle</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'historique' && (
            <>
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]} style={styles.addBtnGrad}>
                  <Ionicons name="add" size={20} color={Colors.white} />
                  <Text style={styles.addBtnText}>Ajouter un cycle</Text>
                </LinearGradient>
              </TouchableOpacity>

              {cycles.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconBox}>
                    <Ionicons name="moon-outline" size={40} color={Colors.primary} />
                  </View>
                  <Text style={[styles.emptyText, { color: th.textSub }]}>Aucun cycle enregistré</Text>
                  <Text style={[styles.emptySubtext, { color: th.textMuted }]}>Commencez à suivre votre cycle pour obtenir des prévisions précises.</Text>
                </View>
              ) : (
                cycles.map((cycle) => (
                  <View key={cycle.id} style={[styles.cycleCard, { backgroundColor: th.card, borderColor: th.border }]}>
                    <View style={styles.cycleDot} />
                    <View style={styles.cycleInfo}>
                      <Text style={[styles.cycleDate, { color: th.text }]}>
                        Début : {cycle.startDate}
                      </Text>
                      {cycle.endDate && <Text style={[styles.cycleEnd, { color: th.textSub }]}>Fin : {cycle.endDate}</Text>}
                      {cycle.note && <Text style={[styles.cycleNote, { color: th.textMuted }]}>{cycle.note}</Text>}
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
              <View style={styles.conseillsTitleRow}>
                <Ionicons name="bulb-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: th.text }]}>Comprendre son Cycle</Text>
              </View>
              {periodTips.map((tip, idx) => (
                <View key={idx} style={[styles.tipCard, { backgroundColor: th.card, borderColor: th.border }]}>
                  <View style={styles.tipIconBox}>
                    <Ionicons name={tip.icon as any} size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: th.text }]}>{tip.title}</Text>
                    <Text style={[styles.tipText, { color: th.textSub }]}>{tip.tip}</Text>
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
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: th.bg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: th.border }]}>
            <Text style={[styles.modalTitle, { color: th.text }]}>Nouveau Cycle</Text>
            <TouchableOpacity onPress={() => {
              setModalVisible(false);
              setNewStartDate(null);
              setNewEndDate(null);
              setNewNote('');
            }}>
              <Ionicons name="close" size={26} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={[styles.inputLabel, { color: th.textSub }]}>Date de début *</Text>
            <TouchableOpacity style={[styles.datePickerBtn, { backgroundColor: th.inputBg, borderColor: th.border }]} onPress={() => setStartDatePicker(true)}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.datePickerText, { color: th.text }, !newStartDate && styles.datePickerPlaceholder, !newStartDate && { color: th.textMuted }]}>
                {newStartDate ? format(newStartDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner la date de début'}
              </Text>
              <Ionicons name="chevron-down-outline" size={14} color={Colors.textLight} />
            </TouchableOpacity>

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Date de fin (optionnel)</Text>
            <TouchableOpacity style={[styles.datePickerBtn, { backgroundColor: th.inputBg, borderColor: th.border }]} onPress={() => setEndDatePicker(true)}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.datePickerText, !newEndDate && styles.datePickerPlaceholder]}>
                {newEndDate ? format(newEndDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner la date de fin'}
              </Text>
              <Ionicons name="chevron-down-outline" size={14} color={Colors.textLight} />
            </TouchableOpacity>

            <Text style={[styles.inputLabel, { color: th.textSub }]}>Note</Text>
            <TextInput
              style={[styles.noteInput, { backgroundColor: th.inputBg, color: th.text, borderColor: th.border }]}
              multiline
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Symptômes, notes..."
              placeholderTextColor={th.textMuted}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={addCycle}>
              <LinearGradient colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]} style={styles.saveBtnGrad}>
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <DatePickerModal
        visible={lastPeriodPicker}
        onClose={() => setLastPeriodPicker(false)}
        onSelect={(d) => {
          setLastPeriodStorage(format(d, 'dd/MM/yyyy'));
          setLastPeriodPicker(false);
        }}
        selectedDate={lastPeriodStorage ? (() => { try { return parse(lastPeriodStorage, 'dd/MM/yyyy', new Date()); } catch { return null; } })() || undefined : undefined}
        title="Date des dernières règles"
        maxDate={new Date()}
      />
      <DatePickerModal
        visible={startDatePicker}
        onClose={() => setStartDatePicker(false)}
        onSelect={(d) => setNewStartDate(d)}
        selectedDate={newStartDate}
        title="Date de début des règles"
        maxDate={new Date()}
      />
      <DatePickerModal
        visible={endDatePicker}
        onClose={() => setEndDatePicker(false)}
        onSelect={(d) => setNewEndDate(d)}
        selectedDate={newEndDate}
        title="Date de fin des règles"
        minDate={newStartDate || undefined}
        maxDate={new Date()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  backBtn: { marginBottom: 8 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  cycleLengthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 10 },
  cycleLengthLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 10, overflow: 'hidden' },
  stepperBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  stepperValue: { fontSize: 15, fontWeight: '700', color: Colors.primaryDeep, minWidth: 36, textAlign: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 6 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.background, gap: 3 },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  content: { padding: 16 },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textTransform: 'capitalize' },
  lastPeriodBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  lastPeriodBtnLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  lastPeriodBtnValue: { flex: 1, fontSize: 13, color: Colors.primary, fontWeight: '700', marginLeft: 6 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  legendChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  calendarCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 12, marginBottom: 16, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  weekDays: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.textLight },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 2 },
  dayPeriod: { backgroundColor: Colors.primary + 'CC', borderRadius: 8 },
  dayFertile: { backgroundColor: Colors.success, borderRadius: 8 },
  dayOvulation: { backgroundColor: Colors.rose, borderRadius: 20 },
  dayPredicted: { backgroundColor: Colors.primaryLight + '80', borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  dayToday: { borderWidth: 2, borderColor: Colors.rose },
  dayText: { fontSize: 13, color: Colors.text },
  dayTextToday: { fontWeight: '800', color: Colors.primary },
  predictionCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  predictionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  predictionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  predRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  predDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  predText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  addBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  cycleCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  cycleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, marginTop: 4 },
  cycleInfo: { flex: 1 },
  cycleDate: { fontSize: 14, fontWeight: '700', color: Colors.text },
  cycleEnd: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  cycleNote: { fontSize: 12, color: Colors.textLight, marginTop: 4, fontStyle: 'italic' },
  conseillsTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  tipCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12, alignItems: 'flex-start' },
  tipIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tipText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 16 },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 14 },
  datePickerText: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '500' },
  datePickerPlaceholder: { color: Colors.textMuted, fontWeight: '400' },
  noteInput: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border, height: 80 },
  saveBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 24, marginBottom: 40 },
  saveBtnGrad: { padding: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

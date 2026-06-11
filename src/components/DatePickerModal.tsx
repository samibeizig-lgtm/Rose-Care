import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS_FR = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
  title?: string;
  maxDate?: Date;
  minDate?: Date;
}

export default function DatePickerModal({
  visible,
  onClose,
  onSelect,
  selectedDate,
  title = 'Sélectionner une date',
  maxDate,
  minDate,
}: Props) {
  const { isDark, th } = useTheme();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  useEffect(() => {
    if (visible) {
      const ref = selectedDate || today;
      setViewMonth(ref.getMonth());
      setViewYear(ref.getFullYear());
    }
  }, [visible]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (maxDate && date > maxDate) return;
    if (minDate && date < minDate) return;
    onSelect(date);
    onClose();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const isDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (maxDate && date > maxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: th.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: th.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: th.border }]}>
              <Ionicons name="close" size={22} color={th.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={[styles.navBtn, { backgroundColor: th.infoBox }]}>
              <Ionicons name="chevron-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.monthLabel, { color: isDark ? Colors.primaryLight : Colors.primaryDeep }]}>
              {MONTHS_FR[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={[styles.navBtn, { backgroundColor: th.infoBox }]}>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {DAYS_FR.map((d, i) => (
              <Text key={i} style={[styles.weekDay, { color: th.textSub }]}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array(firstDay).fill(null).map((_, i) => (
              <View key={`e${i}`} style={styles.dayCell} />
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const sel = isSelected(day);
              const tod = isToday(day);
              const dis = isDisabled(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    sel && styles.dayCellSelected,
                    tod && !sel && styles.dayCellToday,
                    dis && styles.dayCellDisabled,
                  ]}
                  onPress={() => handleDay(day)}
                  disabled={dis}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayText,
                    { color: th.text },
                    sel && styles.dayTextSelected,
                    tod && !sel && styles.dayTextToday,
                    dis && styles.dayTextDisabled,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.todayBtn, { borderTopColor: th.border }]}
            onPress={() => {
              setViewMonth(today.getMonth());
              setViewYear(today.getFullYear());
            }}
          >
            <Ionicons name="today-outline" size={14} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.todayBtnText}>Aujourd'hui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lilac,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDeep,
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: Colors.rose,
    borderRadius: 20,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  dayTextToday: {
    color: Colors.rose,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: Colors.textLight,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  todayBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});

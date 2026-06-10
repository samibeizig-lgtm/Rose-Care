import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setData(JSON.parse(stored));
        }
      } catch {
        // Use default
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [key]);

  const save = async (value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setData(value);
    } catch {
      // Ignore storage errors
    }
  };

  return [data, save, loading];
}

export const storage = {
  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const stored = await AsyncStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore
    }
  },
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};

export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  PREGNANCY_START: 'pregnancy_start',
  DUE_DATE: 'due_date',
  HEALTH_RECORDS: 'health_records',
  MENSTRUAL_CYCLES: 'menstrual_cycles',
  ULTRASOUNDS: 'ultrasounds',
  BABY_KIT_CHECKS: 'baby_kit_checks',
  MOM_BAG_CHECKS: 'mom_bag_checks',
  APPOINTMENTS: 'appointments',
  NOTES: 'notes',
  WEIGHT_RECORDS: 'weight_records',
  BP_RECORDS: 'bp_records',
  GLUCOSE_RECORDS: 'glucose_records',
  MOOD_RECORDS: 'mood_records',
  SYMPTOM_RECORDS: 'symptom_records',
  ONBOARDING_DONE: 'onboarding_done',
  CURRENT_WEEK: 'current_week',
  BABY_NAME: 'baby_name',
  MOM_NAME: 'mom_name',
  CYCLE_LENGTH: 'cycle_length',
  LAST_PERIOD_DATE: 'last_period_date',
};

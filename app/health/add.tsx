import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HealthAddModal() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/(tabs)/health');
  }, []);
  return null;
}

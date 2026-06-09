import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../src/theme/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pregnancy/week/[week]"
            options={{
              headerShown: true,
              headerTitle: 'Développement bébé',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.primary,
              headerBackTitle: 'Retour',
            }}
          />
          <Stack.Screen
            name="health/add"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Ajouter une mesure',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.primary,
            }}
          />
          <Stack.Screen
            name="ultrasound/view"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Mon échographie',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.primary,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

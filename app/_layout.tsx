import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../src/theme/colors';
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
        <StatusBar style="light" backgroundColor={Colors.primaryDark} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pregnancy/week/[week]"
            options={{
              headerShown: true,
              headerTitle: 'Développement bébé',
              headerStyle: { backgroundColor: Colors.primaryDeep },
              headerTintColor: Colors.white,
              headerBackTitle: 'Retour',
            }}
          />
          <Stack.Screen
            name="health/add"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Ajouter une mesure',
              headerStyle: { backgroundColor: Colors.primaryDeep },
              headerTintColor: Colors.white,
            }}
          />
          <Stack.Screen
            name="ultrasound/view"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Mon échographie',
              headerStyle: { backgroundColor: Colors.primaryDeep },
              headerTintColor: Colors.white,
            }}
          />
        </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

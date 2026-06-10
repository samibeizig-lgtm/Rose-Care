import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={focused ? styles.activeTab : styles.inactiveTab}>
      <Ionicons
        name={name}
        color={focused ? Colors.white : 'rgba(192,132,252,0.65)'}
        size={21}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: 'rgba(192,132,252,0.65)',
        tabBarStyle: {
          backgroundColor: Colors.primaryDeep,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 22 : 6,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.2,
          marginTop: 1,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="fertilite"
        options={{
          title: 'Fertilité',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'flower' : 'flower-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pregnancy"
        options={{
          title: 'Grossesse',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Santé',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'pulse' : 'pulse-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="zen"
        options={{
          title: 'Zen',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'moon' : 'moon-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Plus',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: 5,
  },
  inactiveTab: {
    padding: 5,
  },
});

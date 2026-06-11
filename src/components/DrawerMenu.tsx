import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Dimensions, Modal, Pressable, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { BUILD_HASH, BUILD_VERSION } from '../constants/buildInfo';

const { width, height } = Dimensions.get('window');
const DRAWER_W = width * 0.72;

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenProfile?: () => void;
}

const MENU_ITEMS = [
  {
    icon: 'bag-outline' as const,
    label: 'Trousse & Valise',
    subtitle: 'Essentiels maternité',
    route: '/essentials',
    colors: ['#7C3AED', '#A78BFA'] as [string, string],
  },
  {
    icon: 'calendar-outline' as const,
    label: 'Calendrier Menstruel',
    subtitle: 'Suivi du cycle',
    route: '/menstrual',
    colors: ['#5B21B6', '#7F00FF'] as [string, string],
  },
  {
    icon: 'book-outline' as const,
    label: 'Journal de Grossesse',
    subtitle: 'Notes & souvenirs',
    route: '/journal',
    colors: ['#4B0082', '#7F00FF'] as [string, string],
  },
  {
    icon: 'business-outline' as const,
    label: 'Clinique La Rose',
    subtitle: 'Info & médecins',
    route: '/clinic',
    colors: ['#5B00B5', '#9933FF'] as [string, string],
  },
];

export default function DrawerMenu({ visible, onClose, onOpenProfile }: DrawerMenuProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const slideX = useRef(new Animated.Value(-DRAWER_W)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const dark = {
    bg: '#1C1C2E',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.45)',
    section: 'rgba(255,255,255,0.35)',
    border: 'rgba(255,255,255,0.08)',
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideX, {
        toValue: visible ? 0 : -DRAWER_W,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const navigate = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 300);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Dark overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideX }], backgroundColor: isDark ? dark.bg : '#FFFFFF' }]}>
          <LinearGradient colors={['#4B0082', '#7F00FF']} style={styles.drawerHeader}>
            <View style={styles.drawerLogo}>
              <Text style={styles.drawerLogoText}>
                <Text style={{ fontWeight: '900' }}>Rose</Text>
                <Text style={{ fontWeight: '200' }}> Care</Text>
              </Text>
              <Text style={styles.drawerLogoSub}>Menu</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.drawerBody}>
            <Text style={[styles.drawerSectionLabel, isDark && { color: dark.section }]}>NAVIGATION</Text>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, isDark && { borderBottomColor: dark.border }]}
                onPress={() => navigate(item.route)}
                activeOpacity={0.7}
              >
                <LinearGradient colors={item.colors} style={styles.menuIconGrad}>
                  <Ionicons name={item.icon} size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.menuItemText}>
                  <Text style={[styles.menuItemLabel, isDark && { color: dark.text }]}>{item.label}</Text>
                  <Text style={[styles.menuItemSub, isDark && { color: dark.sub }]}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={isDark ? dark.sub : Colors.textMuted} />
              </TouchableOpacity>
            ))}

            <Text style={[styles.drawerSectionLabel, { marginTop: 20 }, isDark && { color: dark.section }]}>MON COMPTE</Text>
            <TouchableOpacity
              style={[styles.menuItem, isDark && { borderBottomColor: dark.border }]}
              onPress={() => { onClose(); setTimeout(() => onOpenProfile?.(), 300); }}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['#6B21A8', '#9333EA']} style={styles.menuIconGrad}>
                <Ionicons name="person-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemLabel, isDark && { color: dark.text }]}>Configurer mon profil</Text>
                <Text style={[styles.menuItemSub, isDark && { color: dark.sub }]}>Nom, prénom, date de naissance</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={isDark ? dark.sub : Colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuItem, { borderBottomWidth: 0 }, isDark && { borderBottomColor: dark.border }]}>
              <LinearGradient colors={isDark ? ['#374151', '#6B7280'] : ['#4B5563', '#9CA3AF']} style={styles.menuIconGrad}>
                <Ionicons name="moon-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemLabel, isDark && { color: dark.text }]}>Mode Sombre</Text>
                <Text style={[styles.menuItemSub, isDark && { color: dark.sub }]}>Apparence de l'app</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={isDark ? Colors.primary : '#F3F4F6'}
                ios_backgroundColor={Colors.border}
              />
            </View>
          </View>

          <View style={[styles.drawerFooter, isDark && { borderTopColor: dark.border }]}>
            <Ionicons name="heart" size={14} color={Colors.rose} />
            <Text style={[styles.footerText, isDark && { color: dark.sub }]}> Rose Care v{BUILD_VERSION} ({BUILD_HASH})</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_W,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  drawerHeader: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  drawerLogo: {},
  drawerLogoText: {
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  drawerLogoSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  drawerSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  menuIconGrad: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  menuItemSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  drawerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});

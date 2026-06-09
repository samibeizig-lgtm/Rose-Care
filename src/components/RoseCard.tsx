import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../theme/colors';

interface RoseCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  gradient?: string[];
  style?: ViewStyle;
  icon?: string;
  badge?: string;
}

export default function RoseCard({
  title,
  subtitle,
  children,
  onPress,
  gradient,
  style,
  icon,
  badge,
}: RoseCardProps) {
  const content = (
    <View style={[styles.card, style]}>
      {gradient ? (
        <LinearGradient colors={gradient as [string, string]} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {icon && <Text style={styles.iconText}>{icon}</Text>}
          {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
          {title && <Text style={[styles.title, { color: Colors.white }]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.85)' }]}>{subtitle}</Text>}
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.plainCard}>
          {icon && <Text style={styles.iconText}>{icon}</Text>}
          {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 6,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientCard: {
    padding: 20,
  },
  plainCard: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  iconText: {
    fontSize: 32,
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});

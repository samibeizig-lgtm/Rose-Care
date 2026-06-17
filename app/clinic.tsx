import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';
import { useTheme } from '../src/theme/ThemeContext';

export default function ClinicScreen() {
  const { isDark, th } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'doctors' | 'events' | 'deco'>('info');

  const doctors = [
    {
      name: 'Dr. Amira Ben Salem',
      specialty: 'Gynécologue-Obstétricienne',
      experience: '15 ans d\'expérience',
      gender: 'female',
      specialties: ['Grossesse à risque', 'Accouchement', 'Suivi prénatal'],
      schedule: 'Lun - Mer - Ven : 9h-13h / 15h-18h',
    },
    {
      name: 'Dr. Karim Mansouri',
      specialty: 'Échographiste',
      experience: '12 ans d\'expérience',
      gender: 'male',
      specialties: ['Échographie obstétricale', '3D/4D', 'Doppler'],
      schedule: 'Mar - Jeu : 8h-16h / Sam : 8h-13h',
    },
    {
      name: 'Dr. Salma Trabelsi',
      specialty: 'Sage-femme coordinatrice',
      experience: '10 ans d\'expérience',
      gender: 'female',
      specialties: ['Préparation accouchement', 'Allaitement', 'Post-partum'],
      schedule: 'Tous les jours : 8h-20h',
    },
    {
      name: 'Dr. Nabil Hammami',
      specialty: 'Néonatalogiste',
      experience: '18 ans d\'expérience',
      gender: 'male',
      specialties: ['Nouveau-né', 'Prématuré', 'Réanimation néonatale'],
      schedule: 'Lun - Ven : 10h-15h',
    },
  ];

  const events = [
    {
      date: 'Chaque 1er samedi du mois',
      title: 'Atelier Préparation à l\'Accouchement',
      icon: 'people-outline' as const,
      desc: 'Séance collective de 3h avec sage-femme et psychologue. Respiration, sophrologie, allaitement.',
      color: Colors.primary,
    },
    {
      date: 'Mensuel',
      title: 'Journée de la Fertilité',
      icon: 'leaf-outline' as const,
      desc: 'Consultations gratuites avec nos spécialistes en fertilité. Sur inscription.',
      color: Colors.primarySoft,
    },
    {
      date: 'Trimestriel',
      title: 'Baby Shower Solidaire',
      icon: 'ribbon-outline' as const,
      desc: 'Collecte de matériel bébé pour les familles dans le besoin. Rejoignez notre communauté.',
      color: Colors.mauve,
    },
    {
      date: 'Hebdomadaire (Mercredi 10h)',
      title: 'Yoga Prénatal',
      icon: 'body-outline' as const,
      desc: 'Séance de yoga prénatal adaptée à chaque trimestre. Professeure certifiée.',
      color: Colors.success,
    },
    {
      date: 'Mensuel (2ème vendredi)',
      title: 'Cercle de Mamans',
      icon: 'heart-outline' as const,
      desc: 'Groupe de parole pour futures et nouvelles mamans. Partage d\'expériences.',
      color: Colors.primaryLight,
    },
  ];

  const decoRooms = [
    {
      name: 'Suite Deluxe Rose',
      icon: 'flower-outline' as const,
      features: ['Chambre privée', 'Salle de bain privée', 'Canapé pour accompagnant', 'TV', 'Minibar', 'Vue jardin'],
      color: Colors.primary,
    },
    {
      name: 'Suite Parentale Zen',
      icon: 'leaf-outline' as const,
      features: ['Ambiance zen', 'Bain de naissance disponible', 'Dimmer lights', 'Musique douce', 'Baignoire', 'Vue piscine'],
      color: Colors.primaryDeep,
    },
    {
      name: 'Chambre Confort',
      icon: 'bed-outline' as const,
      features: ['Chambre double', 'Salle de bain partagée', 'Vue jardin ou intérieur', 'TV', 'Téléphone'],
      color: Colors.primarySoft,
    },
  ];

  const services = [
    { icon: 'flask-outline' as const, name: 'Laboratoire d\'analyses', desc: '24h/24 pour urgences' },
    { icon: 'radio-outline' as const, name: 'Imagerie médicale', desc: 'Écho 2D/3D/4D, Doppler' },
    { icon: 'body-outline' as const, name: 'Préparation prénatale', desc: 'Sophrologie et yoga prénatal' },
    { icon: 'nutrition-outline' as const, name: 'Consultations allaitement', desc: 'Soutien et conseils IBCLC' },
    { icon: 'restaurant-outline' as const, name: 'Nutrition prénatale', desc: 'Diététicienne spécialisée' },
    { icon: 'bulb-outline' as const, name: 'Soutien psychologique', desc: 'Psychologue périnatal' },
  ];

  const infoRows = [
    { icon: 'location-outline' as const, text: 'Avenue de la Bourse, Les Jardins du Lac, 1053 Tunis', url: 'https://maps.app.goo.gl/G2K1uNmA5vHqGx8r8' },
    { icon: 'call-outline' as const, text: '71 100 900', url: 'tel:+21671100900' },
    { icon: 'mail-outline' as const, text: 'contact@clinique-larose.com', url: 'mailto:contact@clinique-larose.com' },
    { icon: 'globe-outline' as const, text: 'www.clinique-larose.com', url: 'https://www.clinique-larose.com' },
    { icon: 'time-outline' as const, text: 'Urgences 24h/24 - 7j/7', url: null },
  ];

  const stats = [
    { value: '+1200', label: 'Naissances / an', icon: 'happy-outline' as const },
    { value: '40 ans', label: 'D\'expérience', icon: 'time-outline' as const },
    { value: '24h/7j', label: 'Disponibilité', icon: 'medical-outline' as const },
    { value: '100%', label: 'Dédié à la maternité', icon: 'heart-outline' as const },
  ];

  const TABS = [
    { id: 'info', label: 'Info', icon: 'information-circle-outline' as const },
    { id: 'doctors', label: 'Médecins', icon: 'people-outline' as const },
    { id: 'events', label: 'Événements', icon: 'calendar-outline' as const },
    { id: 'deco', label: 'Décor', icon: 'bed-outline' as const },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name="flower-outline" size={40} color={Colors.rose} />
        </View>
        <Text style={styles.headerTitle}>Clinique La Rose</Text>
        <Text style={styles.headerSubtitle}>Votre maternité de référence en Tunisie</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+21671100900')}>
            <Ionicons name="call" size={18} color={Colors.white} />
            <Text style={styles.contactBtnText}>Appeler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://maps.app.goo.gl/G2K1uNmA5vHqGx8r8')}>
            <Ionicons name="location" size={18} color={Colors.white} />
            <Text style={styles.contactBtnText}>Localiser</Text>
          </TouchableOpacity>
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
              size={15}
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

          {activeTab === 'info' && (
            <>
              {/* Banner */}
              <View style={styles.imageBanner}>
                <Image
                  source={require('../assets/images/health-banner.jpg')}
                  style={styles.bannerImage}
                  resizeMode="contain"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
                />
                <View style={styles.imageBannerInner}>
                  <Text style={styles.imageBannerTitle}>Clinique La Rose 🏥</Text>
                  <Text style={styles.imageBannerSub}>Votre maternité de référence à Tunis</Text>
                </View>
              </View>
              {/* Stats */}
              <View style={styles.statsRow}>
                {stats.map((s, i) => (
                  <View key={i} style={[styles.statBox, { backgroundColor: th.card, borderColor: th.border }]}>
                    <Ionicons name={s.icon} size={20} color={Colors.rose} style={{ marginBottom: 6 }} />
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: th.textMuted }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Contact Info */}
              <View style={[styles.infoCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.infoCardTitleRow}>
                  <Ionicons name="location-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.infoCardTitle, { color: th.text }]}>Coordonnées</Text>
                </View>
                {infoRows.map((row, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.infoRow, idx === infoRows.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: th.border }]}
                    onPress={() => row.url && Linking.openURL(row.url)}
                    disabled={!row.url}
                  >
                    <View style={styles.infoIconBox}>
                      <Ionicons name={row.icon} size={16} color={Colors.primary} />
                    </View>
                    <Text style={[styles.infoText, { color: row.url ? Colors.primary : th.text }, row.url ? { textDecorationLine: 'underline' } : {}]}>{row.text}</Text>
                    {row.url && <Ionicons name="open-outline" size={14} color={Colors.textMuted} />}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Services */}
              <View style={styles.sectionTitleRow}>
                <Ionicons name="sparkles-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: th.text }]}>Nos Services</Text>
              </View>
              <View style={styles.servicesGrid}>
                {services.map((s, idx) => (
                  <View key={idx} style={[styles.serviceCard, { backgroundColor: th.card, borderColor: th.border }]}>
                    <View style={styles.serviceIconBox}>
                      <Ionicons name={s.icon} size={22} color={Colors.primary} />
                    </View>
                    <Text style={[styles.serviceName, { color: th.text }]}>{s.name}</Text>
                    <Text style={[styles.serviceDesc, { color: th.textSub }]}>{s.desc}</Text>
                  </View>
                ))}
              </View>

              {/* About */}
              <View style={styles.aboutCard}>
                <LinearGradient colors={['#F3E8FF', '#EDE9FE']} style={styles.aboutGrad}>
                  <View style={styles.aboutTitleRow}>
                    <Ionicons name="flower-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.aboutTitle}>Notre Mission</Text>
                  </View>
                  <Text style={styles.aboutText}>
                    La Clinique La Rose est spécialisée en maternité, gynécologie et néonatologie depuis plus de 40 ans. Nous accompagnons les femmes dans tous les moments de leur vie reproductive, de la conception jusqu'après l'accouchement. Notre équipe multidisciplinaire est dédiée à votre bien-être et celui de votre bébé.
                  </Text>
                </LinearGradient>
              </View>
            </>
          )}

          {activeTab === 'doctors' && (
            <>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="people-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: th.text }]}>Notre Équipe Médicale</Text>
              </View>
              {doctors.map((doc, idx) => (
                <View key={idx} style={[styles.doctorCard, { backgroundColor: th.card, borderColor: th.border }]}>
                  <View style={styles.doctorHeader}>
                    <View style={styles.doctorAvatar}>
                      <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
                    </View>
                    <View style={styles.doctorInfo}>
                      <Text style={[styles.doctorName, { color: th.text }]}>{doc.name}</Text>
                      <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
                      <View style={styles.doctorExpRow}>
                        <Ionicons name="star-outline" size={12} color={Colors.mauve} style={{ marginRight: 4 }} />
                        <Text style={styles.doctorExp}>{doc.experience}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.doctorTags}>
                    {doc.specialties.map((sp, i) => (
                      <View key={i} style={styles.doctorTag}>
                        <Text style={styles.doctorTagText}>{sp}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.doctorSchedule}>
                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                    <Text style={[styles.doctorScheduleText, { color: th.textSub }]}>{doc.schedule}</Text>
                  </View>
                  <TouchableOpacity style={styles.rdvBtn} onPress={() => Linking.openURL('tel:+21671100900')}>
                    <LinearGradient colors={['#2D1B69', '#6D28D9']} style={styles.rdvBtnGrad}>
                      <Ionicons name="calendar-outline" size={15} color={Colors.white} style={{ marginRight: 6 }} />
                      <Text style={styles.rdvBtnText}>Prendre rendez-vous</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {activeTab === 'events' && (
            <>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: th.text }]}>Événements & Activités</Text>
              </View>
              {events.map((ev, idx) => (
                <View key={idx} style={[styles.eventCard, { backgroundColor: th.card, borderColor: th.border }]}>
                  <View style={[styles.eventAccent, { backgroundColor: ev.color }]} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={[styles.eventIconBox, { backgroundColor: ev.color + '20' }]}>
                        <Ionicons name={ev.icon} size={20} color={ev.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.eventTitle, { color: th.text }]}>{ev.title}</Text>
                        <Text style={[styles.eventDate, { color: ev.color }]}>{ev.date}</Text>
                      </View>
                    </View>
                    <Text style={[styles.eventDesc, { color: th.textSub }]}>{ev.desc}</Text>
                    <TouchableOpacity style={[styles.inscribeBtn, { backgroundColor: ev.color + '15', borderColor: ev.color }]}>
                      <Text style={[styles.inscribeBtnText, { color: ev.color }]}>S'inscrire</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {activeTab === 'deco' && (
            <>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="bed-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: th.text }]}>Nos Chambres & Suites</Text>
              </View>
              <Text style={[styles.decoSubtitle, { color: th.textSub }]}>
                Un environnement chaleureux et élégant pour vivre ce moment unique dans tout le confort.
              </Text>
              {decoRooms.map((room, idx) => (
                <View key={idx} style={styles.roomCard}>
                  <LinearGradient colors={[room.color, room.color + 'AA']} style={styles.roomHeader}>
                    <View style={styles.roomIconBox}>
                      <Ionicons name={room.icon} size={24} color={Colors.white} />
                    </View>
                    <Text style={styles.roomName}>{room.name}</Text>
                  </LinearGradient>
                  <View style={[styles.roomFeatures, { backgroundColor: th.card }]}>
                    {room.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                        <Text style={[styles.featureText, { color: th.text }]}>{f}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
              <View style={styles.decoNote}>
                <Ionicons name="ribbon-outline" size={18} color={Colors.primary} style={{ marginBottom: 6 }} />
                <Text style={styles.decoNoteText}>
                  Toutes nos chambres sont décorées avec des touches de rose et d'élégance pour vous offrir un séjour mémorable.
                  Fleurs à la naissance, panier bébé offert, photos professionnelles disponibles.
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, padding: 8 },
  headerIconWrap: { marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16, textAlign: 'center' },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 6 },
  contactBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 6 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.background, gap: 3 },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  content: { padding: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  decoSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 20 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, minWidth: (width - 60) / 2, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.primary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', fontWeight: '500' },
  infoCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  infoCardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 10 },
  infoIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  infoText: { fontSize: 14, color: Colors.text, flex: 1 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  serviceCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  serviceIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  serviceName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  serviceDesc: { fontSize: 11, color: Colors.textSecondary },
  aboutCard: { borderRadius: 20, overflow: 'hidden' },
  aboutGrad: { padding: 20 },
  aboutTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aboutTitle: { fontSize: 18, fontWeight: '700', color: Colors.primaryDark },
  aboutText: { fontSize: 14, color: Colors.text, lineHeight: 22, marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  doctorCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  doctorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  doctorAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  doctorSpecialty: { fontSize: 13, color: Colors.primary, fontWeight: '500', marginTop: 2 },
  doctorExpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  doctorExp: { fontSize: 12, color: Colors.textLight },
  doctorTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  doctorTag: { backgroundColor: Colors.lilac, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  doctorTagText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },
  doctorSchedule: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  doctorScheduleText: { fontSize: 12, color: Colors.textSecondary },
  rdvBtn: { borderRadius: 12, overflow: 'hidden' },
  rdvBtnGrad: { padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  rdvBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  eventCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  eventAccent: { width: 5 },
  eventContent: { flex: 1, padding: 14 },
  eventHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  eventIconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  eventTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  eventDate: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  eventDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  inscribeBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, alignSelf: 'flex-start' },
  inscribeBtnText: { fontSize: 13, fontWeight: '700' },
  roomCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  roomHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  roomIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  roomName: { fontSize: 17, fontWeight: '700', color: Colors.white },
  roomFeatures: { backgroundColor: Colors.surface, padding: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 8 },
  featureText: { fontSize: 14, color: Colors.text },
  decoNote: { backgroundColor: Colors.lilac, borderRadius: 16, padding: 16, alignItems: 'center' },
  decoNoteText: { fontSize: 14, color: Colors.primaryDark, lineHeight: 22, textAlign: 'center' },
  imageBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 4,
  },
  bannerImage: {
    width: '100%',
    aspectRatio: 1200 / 630,
  },
  bannerCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.09)',
    top: -50,
    right: -30,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -35,
    left: 15,
  },
  bannerIcon: {
    position: 'absolute',
    top: 16,
    right: 18,
  },
  imageBannerInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  imageBannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  imageBannerSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
  },
});

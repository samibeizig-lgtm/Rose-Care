import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';

export default function ClinicScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'doctors' | 'events' | 'deco'>('info');

  const doctors = [
    {
      name: 'Dr. Amira Ben Salem',
      specialty: 'Gynécologue-Obstétricienne',
      experience: '15 ans d\'expérience',
      icon: '👩‍⚕️',
      specialties: ['Grossesse à risque', 'Accouchement', 'Suivi prénatal'],
      schedule: 'Lun - Mer - Ven : 9h-13h / 15h-18h',
    },
    {
      name: 'Dr. Karim Mansouri',
      specialty: 'Échographiste',
      experience: '12 ans d\'expérience',
      icon: '👨‍⚕️',
      specialties: ['Échographie obstétricale', '3D/4D', 'Doppler'],
      schedule: 'Mar - Jeu : 8h-16h / Sam : 8h-13h',
    },
    {
      name: 'Dr. Salma Trabelsi',
      specialty: 'Sage-femme coordinatrice',
      experience: '10 ans d\'expérience',
      icon: '👩‍⚕️',
      specialties: ['Préparation accouchement', 'Allaitement', 'Post-partum'],
      schedule: 'Tous les jours : 8h-20h',
    },
    {
      name: 'Dr. Nabil Hammami',
      specialty: 'Néonatalogiste',
      experience: '18 ans d\'expérience',
      icon: '👨‍⚕️',
      specialties: ['Nouveau-né', 'Prématuré', 'Réanimation néonatale'],
      schedule: 'Lun - Ven : 10h-15h',
    },
  ];

  const events = [
    {
      date: 'Chaque 1er samedi du mois',
      title: 'Atelier Préparation à l\'Accouchement',
      icon: '🤱',
      desc: 'Séance collective de 3h avec sage-femme et psychologue. Respiration, sophrologie, allaitement.',
      color: Colors.primary,
    },
    {
      date: 'Mensuel',
      title: 'Journée de la Fertilité',
      icon: '🌱',
      desc: 'Consultations gratuites avec nos spécialistes en fertilité. Sur inscription.',
      color: Colors.secondary,
    },
    {
      date: 'Trimestriel',
      title: 'Baby Shower Solidaire',
      icon: '🎀',
      desc: 'Collecte de matériel bébé pour les familles dans le besoin. Rejoignez notre communauté.',
      color: Colors.zen,
    },
    {
      date: 'Hebdomadaire (Mercredi 10h)',
      title: 'Yoga Prénatal',
      icon: '🧘‍♀️',
      desc: 'Séance de yoga prénatal adaptée à chaque trimestre. Professeure certifiée.',
      color: Colors.success,
    },
    {
      date: 'Mensuel (2ème vendredi)',
      title: 'Cercle de Mamans',
      icon: '👭',
      desc: 'Groupe de parole pour futures et nouvelles mamans. Partage d\'expériences.',
      color: Colors.gold,
    },
  ];

  const decoRooms = [
    {
      name: 'Suite Deluxe Rose',
      icon: '🌹',
      features: ['Chambre privée', 'Salle de bain privée', 'Canapé pour accompagnant', 'TV', 'Minibar', 'Vue jardin'],
      color: Colors.primary,
    },
    {
      name: 'Suite Parentale Zen',
      icon: '🌿',
      features: ['Ambiance zen', 'Bain de naissance disponible', 'Dimmer lights', 'Musique douce', 'Baignoire', 'Vue piscine'],
      color: Colors.zen,
    },
    {
      name: 'Chambre Confort',
      icon: '🛏️',
      features: ['Chambre double', 'Salle de bain partagée', 'Vue jardin ou intérieur', 'TV', 'Téléphone'],
      color: Colors.secondary,
    },
  ];

  const services = [
    { icon: '🔬', name: 'Laboratoire d\'analyses', desc: '24h/24 pour urgences' },
    { icon: '📡', name: 'Imagerie médicale', desc: 'Écho 2D/3D/4D, Doppler' },
    { icon: '🧘', name: 'Préparation prénatale', desc: 'Sophrologie, yoga, aquabike' },
    { icon: '🍼', name: 'Consultations allaitement', desc: 'Soutien et conseils IBCLC' },
    { icon: '💆‍♀️', name: 'Spa maternel', desc: 'Massage prénatal certifié' },
    { icon: '🏊‍♀️', name: 'Aquagym prénatale', desc: 'Piscine thérapeutique' },
    { icon: '🍽️', name: 'Nutrition prénatale', desc: 'Diététicienne spécialisée' },
    { icon: '🧠', name: 'Soutien psychologique', desc: 'Psychologue périnatal' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>🌹</Text>
        <Text style={styles.headerTitle}>Clinique La Rose</Text>
        <Text style={styles.headerSubtitle}>Votre maternité de référence en Tunisie</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+21671000000')}>
            <Ionicons name="call" size={18} color={Colors.white} />
            <Text style={styles.contactBtnText}>Appeler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://maps.google.com')}>
            <Ionicons name="location" size={18} color={Colors.white} />
            <Text style={styles.contactBtnText}>Localiser</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['info', 'doctors', 'events', 'deco'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'info' ? 'ℹ️ Info' : tab === 'doctors' ? '👩‍⚕️ Médecins' : tab === 'events' ? '📅 Événements' : '🛏️ Décor'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {activeTab === 'info' && (
            <>
              {/* Contact Info */}
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>📍 Coordonnées</Text>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>📍</Text><Text style={styles.infoText}>Avenue Habib Bourguiba, Tunis 1000</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>📞</Text><Text style={styles.infoText}>+216 71 000 000</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>📱</Text><Text style={styles.infoText}>+216 55 000 000 (Urgences)</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>✉️</Text><Text style={styles.infoText}>contact@clinique-larose.tn</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>🌐</Text><Text style={styles.infoText}>www.clinique-larose.tn</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoIcon}>⏰</Text><Text style={styles.infoText}>Urgences 24h/24 - 7j/7</Text></View>
              </View>

              {/* Services */}
              <Text style={styles.sectionTitle}>✨ Nos Services</Text>
              <View style={styles.servicesGrid}>
                {services.map((s, idx) => (
                  <View key={idx} style={styles.serviceCard}>
                    <Text style={styles.serviceIcon}>{s.icon}</Text>
                    <Text style={styles.serviceName}>{s.name}</Text>
                    <Text style={styles.serviceDesc}>{s.desc}</Text>
                  </View>
                ))}
              </View>

              {/* About */}
              <View style={styles.aboutCard}>
                <LinearGradient colors={[Colors.accent, Colors.primaryLight]} style={styles.aboutGrad}>
                  <Text style={styles.aboutTitle}>🌹 Notre Mission</Text>
                  <Text style={styles.aboutText}>
                    La Clinique La Rose est spécialisée en maternité, gynécologie et néonatologie depuis 2005. Nous accompagnons les femmes dans tous les moments de leur vie reproductive, de la conception jusqu'après l'accouchement. Notre équipe multidisciplinaire est dédiée à votre bien-être et celui de votre bébé.
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}><Text style={styles.statNum}>5000+</Text><Text style={styles.statLabel}>Naissances/an</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNum}>18</Text><Text style={styles.statLabel}>Ans d'expérience</Text></View>
                    <View style={styles.statItem}><Text style={styles.statNum}>50+</Text><Text style={styles.statLabel}>Médecins spécialistes</Text></View>
                  </View>
                </LinearGradient>
              </View>
            </>
          )}

          {activeTab === 'doctors' && (
            <>
              <Text style={styles.sectionTitle}>👩‍⚕️ Notre Équipe Médicale</Text>
              {doctors.map((doc, idx) => (
                <View key={idx} style={styles.doctorCard}>
                  <View style={styles.doctorHeader}>
                    <View style={styles.doctorAvatar}>
                      <Text style={styles.doctorAvatarText}>{doc.icon}</Text>
                    </View>
                    <View style={styles.doctorInfo}>
                      <Text style={styles.doctorName}>{doc.name}</Text>
                      <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
                      <Text style={styles.doctorExp}>⭐ {doc.experience}</Text>
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
                    <Text style={styles.doctorScheduleText}>{doc.schedule}</Text>
                  </View>
                  <TouchableOpacity style={styles.rdvBtn} onPress={() => Linking.openURL('tel:+21671000000')}>
                    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.rdvBtnGrad}>
                      <Text style={styles.rdvBtnText}>📅 Prendre rendez-vous</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {activeTab === 'events' && (
            <>
              <Text style={styles.sectionTitle}>📅 Événements & Activités</Text>
              {events.map((ev, idx) => (
                <View key={idx} style={styles.eventCard}>
                  <View style={[styles.eventAccent, { backgroundColor: ev.color }]} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventIcon}>{ev.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.eventTitle}>{ev.title}</Text>
                        <Text style={[styles.eventDate, { color: ev.color }]}>{ev.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.eventDesc}>{ev.desc}</Text>
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
              <Text style={styles.sectionTitle}>🛏️ Nos Chambres & Suites</Text>
              <Text style={styles.decoSubtitle}>
                Un environnement chaleureux et élégant pour vivre ce moment unique dans tout le confort.
              </Text>
              {decoRooms.map((room, idx) => (
                <View key={idx} style={styles.roomCard}>
                  <LinearGradient
                    colors={[room.color, room.color + 'AA']}
                    style={styles.roomHeader}
                  >
                    <Text style={styles.roomIcon}>{room.icon}</Text>
                    <Text style={styles.roomName}>{room.name}</Text>
                  </LinearGradient>
                  <View style={styles.roomFeatures}>
                    {room.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Text style={styles.featureBullet}>✓</Text>
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
              <View style={styles.decoNote}>
                <Text style={styles.decoNoteText}>
                  🎀 Toutes nos chambres sont décorées avec des touches de rose et d'élégance pour vous offrir un séjour mémorable.
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
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16, textAlign: 'center' },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 6 },
  contactBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 6 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.background },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 4 },
  decoSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 20 },
  infoCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 10 },
  infoIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  infoText: { fontSize: 14, color: Colors.text, flex: 1 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  serviceCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  serviceIcon: { fontSize: 24, marginBottom: 6 },
  serviceName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  serviceDesc: { fontSize: 11, color: Colors.textSecondary },
  aboutCard: { borderRadius: 20, overflow: 'hidden' },
  aboutGrad: { padding: 20 },
  aboutTitle: { fontSize: 18, fontWeight: '700', color: Colors.primaryDark, marginBottom: 10 },
  aboutText: { fontSize: 14, color: Colors.text, lineHeight: 22, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  doctorCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  doctorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  doctorAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  doctorAvatarText: { fontSize: 28 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  doctorSpecialty: { fontSize: 13, color: Colors.primary, fontWeight: '500', marginTop: 2 },
  doctorExp: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  doctorTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  doctorTag: { backgroundColor: Colors.accent, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  doctorTagText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },
  doctorSchedule: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  doctorScheduleText: { fontSize: 12, color: Colors.textSecondary },
  rdvBtn: { borderRadius: 12, overflow: 'hidden' },
  rdvBtnGrad: { padding: 12, alignItems: 'center' },
  rdvBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  eventCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  eventAccent: { width: 5 },
  eventContent: { flex: 1, padding: 14 },
  eventHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  eventIcon: { fontSize: 24 },
  eventTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  eventDate: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  eventDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  inscribeBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, alignSelf: 'flex-start' },
  inscribeBtnText: { fontSize: 13, fontWeight: '700' },
  roomCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  roomHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  roomIcon: { fontSize: 28 },
  roomName: { fontSize: 17, fontWeight: '700', color: Colors.white },
  roomFeatures: { backgroundColor: Colors.surface, padding: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 8 },
  featureBullet: { fontSize: 14, color: Colors.success, fontWeight: '700' },
  featureText: { fontSize: 14, color: Colors.text },
  decoNote: { backgroundColor: Colors.accent, borderRadius: 16, padding: 16 },
  decoNoteText: { fontSize: 14, color: Colors.primaryDark, lineHeight: 22 },
});

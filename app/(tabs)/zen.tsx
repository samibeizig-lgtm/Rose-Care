import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Colors from '../../src/theme/colors';
import {
  breathingExercises,
  affirmations,
  relaxationSounds,
  yogaPoses,
} from '../../src/data/zenData';

const { width, height } = Dimensions.get('window');

export default function ZenScreen() {
  const [activeTab, setActiveTab] = useState<'respiration' | 'sons' | 'affirmations' | 'yoga'>('respiration');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire' | 'idle'>('idle');
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [breathCount, setBreathCount] = useState(0);

  const breathScale = useRef(new Animated.Value(1)).current;
  const breathOpacity = useRef(new Animated.Value(0.6)).current;
  const affirmFade = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  const breathAnimation = (phase: 'inspire' | 'hold' | 'expire', duration: number, nextPhase: () => void) => {
    const toScale = phase === 'inspire' ? 1.5 : phase === 'hold' ? 1.5 : 1;
    const toOpacity = phase === 'inspire' ? 1 : phase === 'hold' ? 1 : 0.6;

    Animated.parallel([
      Animated.timing(breathScale, { toValue: toScale, duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(breathOpacity, { toValue: toOpacity, duration, useNativeDriver: true }),
    ]).start(nextPhase);
  };

  const startBreathing478 = () => {
    setIsBreathing(true);
    setBreathCount(0);
    let count = 0;

    const runCycle = () => {
      if (count >= 4) {
        setIsBreathing(false);
        setBreathPhase('idle');
        breathScale.setValue(1);
        breathOpacity.setValue(0.6);
        return;
      }

      setBreathPhase('inspire');
      breathAnimation('inspire', 4000, () => {
        setBreathPhase('hold');
        breathAnimation('hold', 7000, () => {
          setBreathPhase('expire');
          breathAnimation('expire', 8000, () => {
            count++;
            setBreathCount(count);
            runCycle();
          });
        });
      });
    };

    runCycle();
  };

  const startCoherence = () => {
    setIsBreathing(true);
    setBreathCount(0);
    let count = 0;

    const runCycle = () => {
      if (count >= 6) {
        setIsBreathing(false);
        setBreathPhase('idle');
        breathScale.setValue(1);
        breathOpacity.setValue(0.6);
        return;
      }

      setBreathPhase('inspire');
      breathAnimation('inspire', 5000, () => {
        setBreathPhase('expire');
        breathAnimation('expire', 5000, () => {
          count++;
          setBreathCount(count);
          runCycle();
        });
      });
    };

    runCycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathPhase('idle');
    breathScale.stopAnimation(() => breathScale.setValue(1));
    breathOpacity.stopAnimation(() => breathOpacity.setValue(0.6));
  };

  const changeAffirmation = () => {
    Animated.sequence([
      Animated.timing(affirmFade, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
      Animated.timing(affirmFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  };

  const getBreathPhaseText = () => {
    switch (breathPhase) {
      case 'inspire': return 'INSPIREZ...';
      case 'hold': return 'RETENEZ...';
      case 'expire': return 'EXPIREZ...';
      default: return isBreathing ? '...' : 'Prêt';
    }
  };

  const getBreathColor = () => {
    switch (breathPhase) {
      case 'inspire': return Colors.info;
      case 'hold': return Colors.secondary;
      case 'expire': return Colors.success;
      default: return Colors.zen;
    }
  };

  const currentAffirmation = affirmations[affirmationIndex];

  const affirmationColors = {
    courage: [Colors.primary, Colors.primaryLight] as [string, string],
    amour: ['#E91E63', '#F48FB1'] as [string, string],
    confiance: [Colors.secondary, Colors.secondaryLight] as [string, string],
    force: [Colors.zen, Colors.zenLight] as [string, string],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.zen, Colors.secondary, '#CE93D8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Espace Zen 🧘‍♀️</Text>
        <Text style={styles.headerSubtitle}>Détente, respiration et bien-être</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['respiration', 'sons', 'affirmations', 'yoga'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabIcon}>
              {tab === 'respiration' ? '🌬️' : tab === 'sons' ? '🎵' : tab === 'affirmations' ? '💬' : '🧘'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'respiration' ? 'Respiration' : tab === 'sons' ? 'Sons' : tab === 'affirmations' ? 'Affirmations' : 'Yoga'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* BREATHING TAB */}
        {activeTab === 'respiration' && (
          <View style={styles.content}>
            {/* Live Breathing Circle */}
            {isBreathing || selectedExercise ? (
              <View style={styles.breathingCenter}>
                <View style={styles.breathingCircleOuter}>
                  <Animated.View
                    style={[
                      styles.breathingCircleInner,
                      {
                        transform: [{ scale: breathScale }],
                        opacity: breathOpacity,
                        backgroundColor: getBreathColor() + '30',
                        borderColor: getBreathColor(),
                      },
                    ]}
                  >
                    <Text style={[styles.breathPhaseText, { color: getBreathColor() }]}>
                      {getBreathPhaseText()}
                    </Text>
                    {breathCount > 0 && (
                      <Text style={styles.breathCountText}>{breathCount} cycles</Text>
                    )}
                  </Animated.View>
                </View>
                {isBreathing && (
                  <TouchableOpacity style={styles.stopBreathBtn} onPress={stopBreathing}>
                    <Text style={styles.stopBreathBtnText}>⏹ Arrêter</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            {/* Quick Start */}
            {!isBreathing && (
              <View style={styles.quickBreathRow}>
                <TouchableOpacity style={styles.quickBreathCard} onPress={startCoherence}>
                  <LinearGradient colors={[Colors.info, '#42A5F5']} style={styles.quickBreathGrad}>
                    <Text style={styles.quickBreathIcon}>💙</Text>
                    <Text style={styles.quickBreathTitle}>Cohérence Cardiaque</Text>
                    <Text style={styles.quickBreathDesc}>5-5 • 5 minutes</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBreathCard} onPress={startBreathing478}>
                  <LinearGradient colors={[Colors.zen, '#CE93D8']} style={styles.quickBreathGrad}>
                    <Text style={styles.quickBreathIcon}>💜</Text>
                    <Text style={styles.quickBreathTitle}>Technique 4-7-8</Text>
                    <Text style={styles.quickBreathDesc}>4-7-8 • 4 cycles</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Exercises List */}
            {!isBreathing && breathingExercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={[styles.exerciseCard, selectedExercise === ex.id && styles.exerciseCardSelected]}
                onPress={() => setSelectedExercise(selectedExercise === ex.id ? null : ex.id)}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseIcon}>{ex.icon}</Text>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseTitle}>{ex.title}</Text>
                    <Text style={styles.exerciseDuration}>⏱ {ex.duration}</Text>
                  </View>
                  <Text style={styles.exerciseChevron}>{selectedExercise === ex.id ? '▲' : '▼'}</Text>
                </View>
                {selectedExercise === ex.id && (
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseDesc}>{ex.description}</Text>
                    <View style={styles.benefitBadge}>
                      <Text style={styles.benefitText}>✨ {ex.benefit}</Text>
                    </View>
                    {ex.steps.map((step, idx) => (
                      <View key={idx} style={styles.stepRow}>
                        <View style={styles.stepNum}><Text style={styles.stepNumText}>{idx + 1}</Text></View>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                    {(ex.id === 'cohérence' || ex.id === '4-7-8') && (
                      <TouchableOpacity
                        style={styles.startExBtn}
                        onPress={ex.id === 'cohérence' ? startCoherence : startBreathing478}
                      >
                        <LinearGradient colors={[Colors.zen, Colors.secondary]} style={styles.startExBtnGrad}>
                          <Text style={styles.startExBtnText}>🌬️ Commencer l'exercice guidé</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SOUNDS TAB */}
        {activeTab === 'sons' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>🎵 Sons de Relaxation</Text>
            <Text style={styles.sectionSubtitle}>
              Choisissez un son apaisant pour vous détendre et créer un environnement serein pour votre bébé.
            </Text>
            <View style={styles.soundsGrid}>
              {relaxationSounds.map((sound) => (
                <TouchableOpacity
                  key={sound.id}
                  style={[styles.soundCard, soundPlaying === sound.id && styles.soundCardActive]}
                  onPress={() => setSoundPlaying(soundPlaying === sound.id ? null : sound.id)}
                >
                  {soundPlaying === sound.id ? (
                    <LinearGradient colors={[Colors.zen, Colors.secondary]} style={styles.soundCardGrad}>
                      <Text style={styles.soundIcon}>{sound.icon}</Text>
                      <Text style={[styles.soundTitle, { color: Colors.white }]}>{sound.title}</Text>
                      <Text style={styles.soundPlaying}>▶ En cours</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.soundCardInner}>
                      <Text style={styles.soundIcon}>{sound.icon}</Text>
                      <Text style={styles.soundTitle}>{sound.title}</Text>
                      <Text style={styles.soundDesc}>{sound.description}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.musicNote}>
              <Text style={styles.musicNoteTitle}>🎼 Musique et bébé</Text>
              <Text style={styles.musicNoteText}>
                Votre bébé entend la musique à partir de la semaine 16. La musique douce stimule son développement cérébral et crée des souvenirs émotionnels. Chantez-lui des berceuses !
              </Text>
            </View>
          </View>
        )}

        {/* AFFIRMATIONS TAB */}
        {activeTab === 'affirmations' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>💬 Affirmations Positives</Text>

            <TouchableOpacity onPress={changeAffirmation} style={styles.affirmationBig}>
              <LinearGradient
                colors={affirmationColors[currentAffirmation.category]}
                style={styles.affirmationBigGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.affirmationCategory}>
                  {currentAffirmation.category === 'courage' ? '⚡ Courage' :
                   currentAffirmation.category === 'amour' ? '❤️ Amour' :
                   currentAffirmation.category === 'confiance' ? '🌟 Confiance' : '💪 Force'}
                </Text>
                <Animated.Text style={[styles.affirmationText, { opacity: affirmFade }]}>
                  "{currentAffirmation.text}"
                </Animated.Text>
                <Text style={styles.affirmationSwipe}>Appuyez pour la suivante →</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* All Affirmations */}
            <Text style={styles.allAffirmTitle}>Toutes les affirmations</Text>
            {affirmations.map((aff) => (
              <TouchableOpacity
                key={aff.id}
                style={styles.affirmCard}
                onPress={() => {
                  const idx = affirmations.indexOf(aff);
                  Animated.timing(affirmFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                    setAffirmationIndex(idx);
                    setActiveTab('affirmations');
                    Animated.timing(affirmFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                  });
                }}
              >
                <View style={[styles.affirmCardAccent, { backgroundColor: affirmationColors[aff.category][0] }]} />
                <Text style={styles.affirmCardText}>{aff.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* YOGA TAB */}
        {activeTab === 'yoga' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>🧘‍♀️ Yoga Prénatal</Text>
            <Text style={styles.sectionSubtitle}>
              Le yoga prénatal améliore la flexibilité, soulage les douleurs et prépare le corps à l'accouchement.
            </Text>

            <View style={styles.warningCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                Consultez toujours votre médecin avant de commencer une nouvelle activité physique pendant la grossesse.
              </Text>
            </View>

            {yogaPoses.map((pose) => (
              <View key={pose.id} style={styles.poseCard}>
                <View style={styles.poseHeader}>
                  <Text style={styles.poseIcon}>{pose.icon}</Text>
                  <View style={styles.poseInfo}>
                    <Text style={styles.poseName}>{pose.name}</Text>
                    <Text style={styles.poseDuration}>⏱ {pose.duration}</Text>
                  </View>
                  <View style={styles.trimesterBadges}>
                    {pose.trimester.map(t => (
                      <View key={t} style={styles.trimesterBadge}>
                        <Text style={styles.trimesterBadgeText}>T{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.poseBenefit}>
                  <Text style={styles.poseBenefitText}>✨ {pose.benefit}</Text>
                </View>
                <Text style={styles.poseDesc}>{pose.description}</Text>
              </View>
            ))}

            <View style={styles.yogaNote}>
              <Text style={styles.yogaNoteTitle}>💡 Conseils généraux</Text>
              {[
                'Pratiquez sur un tapis antidérapant',
                'Restez hydratée pendant les exercices',
                'Évitez de vous allonger sur le dos après 20 SA',
                'Ne poussez jamais jusqu\'à la douleur',
                'Respirez régulièrement, ne retenez jamais le souffle',
              ].map((tip, idx) => (
                <View key={idx} style={styles.yogaTipRow}>
                  <Text style={styles.yogaTipBullet}>🌸</Text>
                  <Text style={styles.yogaTipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: Colors.zenLight,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.zen,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  // Breathing
  breathingCenter: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  breathingCircleOuter: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathPhaseText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  breathCountText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  stopBreathBtn: {
    marginTop: 16,
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  stopBreathBtnText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 15,
  },
  quickBreathRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickBreathCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.zen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  quickBreathGrad: {
    padding: 16,
    alignItems: 'center',
  },
  quickBreathIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickBreathTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickBreathDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.zen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseCardSelected: {
    borderColor: Colors.zen,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exerciseIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  exerciseDuration: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  exerciseChevron: {
    fontSize: 12,
    color: Colors.textLight,
  },
  exerciseDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  exerciseDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
    marginTop: 8,
  },
  benefitBadge: {
    backgroundColor: Colors.zenLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 13,
    color: Colors.zen,
    fontWeight: '600',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.zen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 21,
  },
  startExBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 12,
  },
  startExBtnGrad: {
    padding: 12,
    alignItems: 'center',
  },
  startExBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  // Sounds
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  soundCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.zen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  soundCardActive: {
    borderColor: Colors.zen,
  },
  soundCardGrad: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  soundCardInner: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    minHeight: 100,
    justifyContent: 'center',
  },
  soundIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  soundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  soundDesc: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  soundPlaying: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginTop: 4,
  },
  musicNote: {
    backgroundColor: Colors.zenLight,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.zen,
  },
  musicNoteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.zen,
    marginBottom: 8,
  },
  musicNoteText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  // Affirmations
  affirmationBig: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  affirmationBigGrad: {
    padding: 28,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  affirmationCategory: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  affirmationText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },
  affirmationSwipe: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  allAffirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  affirmCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  affirmCardAccent: {
    width: 4,
    borderRadius: 2,
    minHeight: 40,
    marginRight: 12,
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  affirmCardText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  // Yoga
  warningCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    gap: 10,
  },
  warningIcon: {
    fontSize: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  poseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.zen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  poseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  poseIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  poseInfo: {
    flex: 1,
  },
  poseName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  poseDuration: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  trimesterBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  trimesterBadge: {
    backgroundColor: Colors.zenLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trimesterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.zen,
  },
  poseBenefit: {
    backgroundColor: Colors.zenLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  poseBenefitText: {
    fontSize: 13,
    color: Colors.zen,
    fontWeight: '600',
  },
  poseDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  yogaNote: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  yogaNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.zen,
    marginBottom: 12,
  },
  yogaTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  yogaTipBullet: {
    fontSize: 14,
  },
  yogaTipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
});

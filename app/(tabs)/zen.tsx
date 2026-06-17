import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../src/theme/colors';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFocusEffect } from 'expo-router';
import { Audio } from 'expo-av';
import {
  breathingExercises,
  affirmations,
  relaxationSounds,
  yogaPoses,
} from '../../src/data/zenData';

const { width } = Dimensions.get('window');
const WAVE_H = 50;

export default function ZenScreen() {
  const { isDark, th } = useTheme();
  const [activeTab, setActiveTab] = useState<'respiration' | 'hypnose' | 'affirmations' | 'yoga'>('respiration');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire' | 'idle'>('idle');
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [breathCount, setBreathCount] = useState(0);
  const [isLoadingSound, setIsLoadingSound] = useState(false);

  const breathScale = useRef(new Animated.Value(1)).current;
  const breathOpacity = useRef(new Animated.Value(0.6)).current;
  const isBreathingRef = useRef(false);
  const affirmFade = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }).start();
    }, [])
  );

  const speakScript = async (sessionId: string, text: string) => {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
        if (isSpeaking === sessionId) { setIsSpeaking(null); return; }
      }
      setIsSpeaking(sessionId);
      Speech.speak(text, {
        language: 'fr-FR',
        pitch: 0.55,
        rate: 0.35,
        onDone: () => setIsSpeaking(null),
        onStopped: () => setIsSpeaking(null),
        onError: () => setIsSpeaking(null),
      });
    } catch { setIsSpeaking(null); }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    }).catch(() => {});
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playSound = async (soundId: string, audioUrl: any) => {
    try {
      setIsLoadingSound(true);
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setSoundPlaying(soundId);
      const { sound } = await Audio.Sound.createAsync(
        audioUrl,
        { isLooping: true, shouldPlay: true }
      );
      soundRef.current = sound;
    } catch {
      setSoundPlaying(null);
    } finally {
      setIsLoadingSound(false);
    }
  };

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch {
      // ignore
    }
    setSoundPlaying(null);
  };

  const handleSoundPress = async (soundId: string, audioUrl: string) => {
    if (soundPlaying === soundId) {
      await stopSound();
    } else {
      await playSound(soundId, audioUrl);
    }
  };

  const breathAnimation = (phase: 'inspire' | 'hold' | 'expire', duration: number, nextPhase: () => void) => {
    const toScale = phase === 'inspire' ? 1.5 : phase === 'hold' ? 1.5 : 1;
    const toOpacity = phase === 'inspire' ? 1 : phase === 'hold' ? 1 : 0.6;
    Animated.parallel([
      Animated.timing(breathScale, { toValue: toScale, duration, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(breathOpacity, { toValue: toOpacity, duration, useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) nextPhase(); });
  };

  const startBreathing478 = () => {
    breathScale.setValue(1);
    breathOpacity.setValue(0.6);
    isBreathingRef.current = true;
    setIsBreathing(true);
    setBreathCount(0);
    let count = 0;
    const runCycle = () => {
      if (!isBreathingRef.current) return;
      if (count >= 4) {
        isBreathingRef.current = false;
        setIsBreathing(false);
        setBreathPhase('idle');
        breathScale.setValue(1);
        breathOpacity.setValue(0.6);
        return;
      }
      setBreathPhase('inspire');
      breathAnimation('inspire', 4000, () => {
        if (!isBreathingRef.current) return;
        setBreathPhase('hold');
        breathAnimation('hold', 7000, () => {
          if (!isBreathingRef.current) return;
          setBreathPhase('expire');
          breathAnimation('expire', 8000, () => {
            if (!isBreathingRef.current) return;
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
    breathScale.setValue(1);
    breathOpacity.setValue(0.6);
    isBreathingRef.current = true;
    setIsBreathing(true);
    setBreathCount(0);
    let count = 0;
    const runCycle = () => {
      if (!isBreathingRef.current) return;
      if (count >= 6) {
        isBreathingRef.current = false;
        setIsBreathing(false);
        setBreathPhase('idle');
        breathScale.setValue(1);
        breathOpacity.setValue(0.6);
        return;
      }
      setBreathPhase('inspire');
      breathAnimation('inspire', 5000, () => {
        if (!isBreathingRef.current) return;
        setBreathPhase('expire');
        breathAnimation('expire', 5000, () => {
          if (!isBreathingRef.current) return;
          count++;
          setBreathCount(count);
          runCycle();
        });
      });
    };
    runCycle();
  };

  const stopBreathing = () => {
    isBreathingRef.current = false;
    setIsBreathing(false);
    setBreathPhase('idle');
    breathScale.stopAnimation();
    breathOpacity.stopAnimation();
    breathScale.setValue(1);
    breathOpacity.setValue(0.6);
  };

  const changeAffirmation = () => {
    Animated.timing(affirmFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
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
      case 'inspire': return Colors.primaryLight;
      case 'hold': return Colors.mauve;
      case 'expire': return Colors.primarySoft;
      default: return Colors.primary;
    }
  };

  const currentAffirmation = affirmations[affirmationIndex];
  const affirmationColors = {
    courage: Colors.gradient.primary as [string, string],
    amour: [Colors.primary, Colors.mauve] as [string, string],
    confiance: [Colors.primaryDeep, Colors.primaryLight] as [string, string],
    force: Colors.gradient.zen as [string, string],
  };
  const affirmationLabels = {
    courage: 'Courage',
    amour: 'Amour',
    confiance: 'Confiance',
    force: 'Force',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={Colors.gradient.zen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="leaf-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.headerTitle}>Espace Zen</Text>
            <Text style={styles.headerSubtitle}>Détente, respiration et bien-être</Text>
          </View>
        </View>
        <Svg width={width} height={WAVE_H} style={{ position: 'absolute', bottom: 0 }} viewBox={`0 0 ${width} ${WAVE_H}`}>
          <Path d={`M0,${WAVE_H} Q${width * 0.5},0 ${width},${WAVE_H} Z`} fill={th.bg} />
        </Svg>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: th.card, borderBottomColor: th.border }]}>
        {(['respiration', 'hypnose', 'affirmations', 'yoga'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'respiration' ? 'pulse-outline' : tab === 'hypnose' ? 'mic-outline' : tab === 'affirmations' ? 'chatbubble-outline' : 'body-outline' as any}
              size={18}
              color={activeTab === tab ? Colors.primary : Colors.textLight}
            />
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'respiration' ? 'Respiration' : tab === 'hypnose' ? 'Hypnose' : tab === 'affirmations' ? 'Affirmations' : 'Yoga'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.ScrollView showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim, backgroundColor: th.bg }}>

        {/* BREATHING TAB */}
        {activeTab === 'respiration' && (
          <View style={styles.content}>
            {/* Banner */}
            <View style={styles.imageBanner}>
              <Image
                source={require('../../assets/images/zen-banner.jpg')}
                style={styles.bannerImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
              />
              <View style={styles.imageBannerInner}>
                <Text style={styles.imageBannerTitle}>Espace Respiration 🌬️</Text>
                <Text style={styles.imageBannerSub}>Cohérence cardiaque · 4-7-8 · Détente profonde</Text>
              </View>
            </View>
            {(isBreathing || selectedExercise) && (
              <View style={styles.breathingCenter}>
                <View style={styles.breathingCircleOuter}>
                  <Animated.View
                    style={[
                      styles.breathingCircleInner,
                      {
                        transform: [{ scale: breathScale }],
                        opacity: breathOpacity,
                        backgroundColor: getBreathColor() + '28',
                        borderColor: getBreathColor(),
                      },
                    ]}
                  >
                    <Text style={[styles.breathPhaseText, { color: getBreathColor() }]}>{getBreathPhaseText()}</Text>
                    {breathCount > 0 && <Text style={styles.breathCountText}>{breathCount} cycles</Text>}
                  </Animated.View>
                </View>
                {isBreathing && (
                  <TouchableOpacity style={styles.stopBreathBtn} onPress={stopBreathing}>
                    <Ionicons name="stop-circle-outline" size={18} color={Colors.error} style={{ marginRight: 6 }} />
                    <Text style={styles.stopBreathBtnText}>Arrêter</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {!isBreathing && (
              <View style={styles.quickBreathRow}>
                <TouchableOpacity style={styles.quickBreathCard} onPress={startCoherence}>
                  <LinearGradient colors={[Colors.primaryDeep, Colors.primary]} style={styles.quickBreathGrad}>
                    <Ionicons name="radio-button-on-outline" size={28} color="rgba(255,255,255,0.9)" style={{ marginBottom: 6 }} />
                    <Text style={styles.quickBreathTitle}>Cohérence Cardiaque</Text>
                    <Text style={styles.quickBreathDesc}>5-5 • 5 minutes</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBreathCard} onPress={startBreathing478}>
                  <LinearGradient colors={Colors.gradient.soft} style={styles.quickBreathGrad}>
                    <Ionicons name="water-outline" size={28} color="rgba(255,255,255,0.9)" style={{ marginBottom: 6 }} />
                    <Text style={styles.quickBreathTitle}>Technique 4-7-8</Text>
                    <Text style={styles.quickBreathDesc}>4-7-8 • 4 cycles</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {!isBreathing && breathingExercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={[styles.exerciseCard, { backgroundColor: th.card, borderColor: th.border }, selectedExercise === ex.id && styles.exerciseCardSelected]}
                onPress={() => setSelectedExercise(selectedExercise === ex.id ? null : ex.id)}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIconBox}>
                    <Ionicons name={ex.ionicon as any} size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseTitle, { color: th.text }]}>{ex.title}</Text>
                    <Text style={styles.exerciseDuration}>
                      <Ionicons name="time-outline" size={11} color={Colors.textLight} /> {ex.duration}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedExercise === ex.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={18}
                    color={Colors.textLight}
                  />
                </View>
                {selectedExercise === ex.id && (
                  <View style={styles.exerciseDetails}>
                    <Text style={[styles.exerciseDesc, { color: th.textSub }]}>{ex.description}</Text>
                    <View style={styles.benefitBadge}>
                      <Ionicons name="sparkles-outline" size={13} color={Colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.benefitText}>{ex.benefit}</Text>
                    </View>
                    {ex.steps.map((step, idx) => (
                      <View key={idx} style={styles.stepRow}>
                        <View style={styles.stepNum}><Text style={styles.stepNumText}>{idx + 1}</Text></View>
                        <Text style={[styles.stepText, { color: th.text }]}>{step}</Text>
                      </View>
                    ))}
                    {(ex.id === 'cohérence' || ex.id === '4-7-8') && (
                      <TouchableOpacity style={styles.startExBtn} onPress={ex.id === 'cohérence' ? startCoherence : startBreathing478}>
                        <LinearGradient colors={Colors.gradient.zen} style={styles.startExBtnGrad}>
                          <Ionicons name="play-circle-outline" size={18} color={Colors.white} style={{ marginRight: 6 }} />
                          <Text style={styles.startExBtnText}>Commencer l'exercice guidé</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* HYPNOSE TAB */}
        {activeTab === 'hypnose' && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Hypnose & Relaxation Guidée</Text>
            <Text style={[styles.sectionSubtitle, { color: th.textSub }]}>
              Des séances de relaxation et d'hypnose douce en français, spécialement conçues pour la grossesse.
            </Text>

            {[
              { id: 'voyage', title: 'Voyage Intérieur', duration: '15 min', icon: 'compass-outline', colors: ['#4B0082', '#7F00FF'] as [string,string],
                desc: 'Un voyage guidé au cœur de vous-même pour retrouver calme et sérénité.',
                script: 'Installez-vous confortablement... Fermez doucement les yeux... Prenez une grande inspiration et laissez votre corps se détendre complètement...\n\nRessentez le poids de votre corps qui s\'enfonce dans la surface sous vous... Chaque expiration emporte un peu plus de tension...\n\nImaginez-vous dans un jardin fleuri... l\'air est doux et parfumé... Vous entendez le chant des oiseaux au loin... Vous êtes en sécurité ici...\n\nRespiration après respiration, vous vous enfoncez plus profondément dans la détente...' },
              { id: 'nuit', title: 'Nuit Sereine', duration: '20 min', icon: 'moon-outline', colors: ['#5B21B6', '#4B0082'] as [string,string],
                desc: 'Préparez votre corps et votre esprit pour un sommeil profond et réparateur.',
                script: 'Ce soir, vous méritez un repos complet... Allongez-vous confortablement... Sentez votre corps qui s\'alourdit progressivement...\n\nVos paupières sont lourdes... très lourdes... Vos muscles se relâchent l\'un après l\'autre...\n\nVotre bébé dort paisiblement en vous, bercé par votre calme... Vous pouvez lâcher prise... Il est temps de vous reposer...' },
              { id: 'bebe', title: 'Lien Maman-Bébé', duration: '12 min', icon: 'heart-outline', colors: ['#7F00FF', '#B366FF'] as [string,string],
                desc: 'Renforcez la connexion profonde avec votre bébé à travers cette méditation.',
                script: 'Placez doucement vos mains sur votre ventre... Sentez la chaleur qui irradie de vos paumes...\n\nVisualisez votre bébé, niché en sécurité en vous... entouré d\'une lumière dorée et chaude...\n\nDites-lui intérieurement : "Je t\'aime, je te protège, je suis là pour toi..." Votre bébé entend votre voix, il ressent votre amour...' },
              { id: 'confiance', title: 'Confiance en l\'Accouchement', duration: '18 min', icon: 'shield-checkmark-outline', colors: ['#4B0082', '#7C3AED'] as [string,string],
                desc: 'Préparez-vous mentalement à l\'accouchement avec sérénité et confiance.',
                script: 'Votre corps a été conçu pour cela... Il sait exactement ce qu\'il doit faire... Faites confiance à cette sagesse innée...\n\nChaque contraction est une vague qui vous rapproche de votre bébé... Accueillez-la, respirez avec elle, laissez-la passer...\n\nVous êtes forte... Vous avez toutes les ressources nécessaires en vous... Votre corps et votre bébé travaillent ensemble...' },
              { id: 'anxiete', title: 'Libérer l\'Anxiété', duration: '10 min', icon: 'leaf-outline', colors: ['#6B21A8', '#9333EA'] as [string,string],
                desc: 'Relâchez les inquiétudes et retrouvez un état de calme profond.',
                script: 'L\'anxiété n\'est qu\'une pensée... et les pensées passent comme des nuages dans le ciel...\n\nImaginez que chaque souffle expiré emporte une préoccupation... Le ciel se dégage peu à peu...\n\nVous n\'avez rien à résoudre maintenant... Vous pouvez simplement être... ici... présente... en paix...' },
              { id: 'energie', title: 'Énergie Positive', duration: '8 min', icon: 'sunny-outline', colors: ['#7F00FF', '#A855F7'] as [string,string],
                desc: 'Rechargez vos batteries et amplifiez votre énergie vitale.',
                script: 'Imaginez une lumière dorée au-dessus de vous... Elle descend doucement vers votre sommet de la tête...\n\nCette lumière tiède traverse votre nuque, vos épaules, votre cœur... jusqu\'à vos pieds...\n\nVous êtes remplie d\'énergie positive... Cette lumière nourrit aussi votre bébé... Vous rayonnez d\'amour et de vitalité...' },
            ].map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.hypnoseCard, { backgroundColor: th.card }]}
                onPress={() => setSelectedExercise(selectedExercise === session.id ? null : session.id)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={session.colors} style={styles.hypnoseHeader}>
                  <View style={styles.hypnoseHeaderLeft}>
                    <Ionicons name={session.icon as any} size={28} color="#FFFFFF" />
                    <View style={{ marginLeft: 14 }}>
                      <Text style={styles.hypnoseTitle}>{session.title}</Text>
                      <Text style={styles.hypnoseDuration}>{session.duration}</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={selectedExercise === session.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="rgba(255,255,255,0.8)"
                  />
                </LinearGradient>
                {selectedExercise !== session.id && (
                  <View style={[styles.hypnoseDesc, { backgroundColor: th.card }]}>
                    <Text style={[styles.hypnoseDescText, { color: th.textSub }]}>{session.desc}</Text>
                  </View>
                )}
                {selectedExercise === session.id && (
                  <View style={[styles.hypnoseScript, { backgroundColor: th.surface }]}>
                    <Text style={styles.hypnoseScriptLabel}>Séance guidée :</Text>
                    <TouchableOpacity onPress={() => speakScript(session.id, session.script)} activeOpacity={0.8}>
                      <Text style={[styles.hypnoseScriptText, { color: th.text }, isSpeaking === session.id && { opacity: 0.7 }]}>{session.script}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.voiceBtn, isSpeaking === session.id && styles.voiceBtnActive]}
                      onPress={() => speakScript(session.id, session.script)}
                    >
                      <Ionicons
                        name={isSpeaking === session.id ? 'stop-circle-outline' : 'volume-high-outline'}
                        size={18}
                        color={isSpeaking === session.id ? '#FFFFFF' : Colors.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.voiceBtnText, isSpeaking === session.id && { color: '#FFFFFF' }]}>
                        {isSpeaking === session.id ? 'Arrêter la lecture' : 'Écouter ce texte'}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.hypnoseTip}>
                      <Ionicons name="headset-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                      <Text style={styles.hypnoseTipText}>Appuyez sur "Écouter" pour une voix douce en français.</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.musicNote}>
              <View style={styles.musicNoteTitleRow}>
                <Ionicons name="mic-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.musicNoteTitle}>Les bienfaits de l'hypnose prénatale</Text>
              </View>
              <Text style={styles.musicNoteText}>
                L'hypnose douce réduit l'anxiété de 60%, améliore la qualité du sommeil et renforce le lien maman-bébé. Pratiquez 10 à 20 min par jour pour des résultats optimaux.
              </Text>
            </View>
          </View>
        )}

        {/* AFFIRMATIONS TAB */}
        {activeTab === 'affirmations' && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Affirmations Positives</Text>

            <TouchableOpacity onPress={changeAffirmation} style={styles.affirmationBig}>
              <LinearGradient
                colors={affirmationColors[currentAffirmation.category]}
                style={styles.affirmationBigGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.affirmationCategoryRow}>
                  <Ionicons
                    name={
                      currentAffirmation.category === 'courage' ? 'flash-outline' :
                      currentAffirmation.category === 'amour' ? 'heart-outline' :
                      currentAffirmation.category === 'confiance' ? 'star-outline' : 'shield-outline'
                    }
                    size={14}
                    color="rgba(255,255,255,0.8)"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.affirmationCategory}>
                    {affirmationLabels[currentAffirmation.category]}
                  </Text>
                </View>
                <Animated.Text style={[styles.affirmationText, { opacity: affirmFade }]}>
                  "{currentAffirmation.text}"
                </Animated.Text>
                <View style={styles.affirmationSwipeRow}>
                  <Text style={styles.affirmationSwipe}>Appuyez pour la suivante</Text>
                  <Ionicons name="arrow-forward-outline" size={14} color="rgba(255,255,255,0.6)" style={{ marginLeft: 4 }} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.allAffirmTitle, { color: th.text }]}>Toutes les affirmations</Text>
            {affirmations.map((aff) => (
              <TouchableOpacity
                key={aff.id}
                style={[styles.affirmCard, { backgroundColor: th.card, borderColor: th.border }]}
                onPress={() => {
                  const idx = affirmations.indexOf(aff);
                  Animated.timing(affirmFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                    setAffirmationIndex(idx);
                    Animated.timing(affirmFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                  });
                }}
              >
                <View style={[styles.affirmCardAccent, { backgroundColor: affirmationColors[aff.category][0] }]} />
                <Text style={[styles.affirmCardText, { color: th.text }]}>{aff.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* YOGA TAB */}
        {activeTab === 'yoga' && (
          <View style={styles.content}>
            {/* Banner */}
            <View style={styles.imageBanner}>
              <Image
                source={require('../../assets/images/zen-banner.jpg')}
                style={styles.bannerImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
              />
              <View style={styles.imageBannerInner}>
                <Text style={styles.imageBannerTitle}>Yoga Prénatal 🧘‍♀️</Text>
                <Text style={styles.imageBannerSub}>Postures douces adaptées à chaque trimestre</Text>
              </View>
            </View>
            <Text style={[styles.sectionTitle, { color: th.text }]}>Yoga Prénatal</Text>
            <Text style={[styles.sectionSubtitle, { color: th.textSub }]}>
              Le yoga prénatal améliore la flexibilité, soulage les douleurs et prépare le corps à l'accouchement.
            </Text>

            <View style={[styles.warningCard, { backgroundColor: th.warningLight }]}>
              <Ionicons name="warning-outline" size={20} color={Colors.warning} style={{ flexShrink: 0 }} />
              <Text style={[styles.warningText, { color: th.text }]}>
                Consultez toujours votre médecin avant de commencer une nouvelle activité physique pendant la grossesse.
              </Text>
            </View>

            {yogaPoses.map((pose) => (
              <View key={pose.id} style={[styles.poseCard, { backgroundColor: th.card, borderColor: th.border }]}>
                <View style={styles.poseHeader}>
                  <View style={styles.poseIconBox}>
                    <Ionicons name={pose.ionicon as any} size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.poseInfo}>
                    <Text style={[styles.poseName, { color: th.text }]}>{pose.name}</Text>
                    <Text style={styles.poseDuration}>
                      <Ionicons name="time-outline" size={11} color={Colors.textLight} /> {pose.duration}
                    </Text>
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
                  <Ionicons name="sparkles-outline" size={13} color={Colors.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.poseBenefitText}>{pose.benefit}</Text>
                </View>
                <Text style={[styles.poseDesc, { color: th.textSub }]}>{pose.description}</Text>
              </View>
            ))}

            <View style={[styles.yogaNote, { backgroundColor: th.card, borderColor: th.border }]}>
              <View style={styles.yogaNoteTitleRow}>
                <Ionicons name="bulb-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.yogaNoteTitle}>Conseils généraux</Text>
              </View>
              {[
                'Pratiquez sur un tapis antidérapant',
                'Restez hydratée pendant les exercices',
                'Évitez de vous allonger sur le dos après 20 SA',
                'Ne poussez jamais jusqu\'à la douleur',
                'Respirez régulièrement, ne retenez jamais le souffle',
              ].map((tip, idx) => (
                <View key={idx} style={styles.yogaTipRow}>
                  <View style={styles.yogaTipBullet} />
                  <Text style={[styles.yogaTipText, { color: th.text }]}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20 + WAVE_H,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
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
    gap: 3,
  },
  tabActive: {
    backgroundColor: Colors.lilac,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 1,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
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
    backgroundColor: Colors.error + '18',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.error + '60',
    flexDirection: 'row',
    alignItems: 'center',
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  quickBreathGrad: {
    padding: 16,
    alignItems: 'center',
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseCardSelected: {
    borderColor: Colors.primary,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exerciseIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.lilac,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 13,
    color: Colors.primary,
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
    backgroundColor: Colors.primary,
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
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startExBtnGrad: {
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startExBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  nowPlayingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lilac,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nowPlayingText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  stopSoundBtn: {
    padding: 4,
  },
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  soundCardActive: {
    borderColor: Colors.primary,
  },
  soundCardGrad: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  soundCardInner: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    minHeight: 120,
    justifyContent: 'center',
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
  soundPlayingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  soundPlaying: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  hypnoseCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  hypnoseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  hypnoseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hypnoseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hypnoseDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  hypnoseDesc: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  hypnoseDescText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  hypnoseScript: {
    padding: 18,
    backgroundColor: '#FAFAFA',
  },
  hypnoseScriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  hypnoseScriptText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  hypnoseTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.lilac,
    borderRadius: 10,
    padding: 10,
  },
  hypnoseTipText: {
    fontSize: 12,
    color: Colors.primaryDeep,
    flex: 1,
    lineHeight: 18,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lilac,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignSelf: 'flex-start',
  },
  voiceBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  voiceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  musicNote: {
    backgroundColor: Colors.lilac,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  musicNoteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  musicNoteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  musicNoteText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  affirmationBig: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  affirmationBigGrad: {
    padding: 28,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  affirmationCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  affirmationCategory: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
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
  affirmationSwipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    shadowColor: Colors.primary,
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
  poseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.lilac,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trimesterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  poseBenefit: {
    backgroundColor: Colors.lilac,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poseBenefitText: {
    fontSize: 13,
    color: Colors.primary,
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
  yogaNoteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  yogaNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  yogaTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  yogaTipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.mauve,
    marginTop: 7,
    flexShrink: 0,
  },
  yogaTipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
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

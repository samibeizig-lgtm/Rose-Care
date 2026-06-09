export interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: string[];
  benefit: string;
  icon: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'courage' | 'amour' | 'confiance' | 'force';
}

export interface RelaxationSound {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'cohérence',
    title: 'Cohérence Cardiaque',
    description: 'La technique la plus efficace pour réduire le stress et calmer le système nerveux.',
    duration: '5 minutes',
    icon: '💙',
    benefit: 'Réduit le cortisol, calme l\'anxiété, prépare au sommeil',
    steps: [
      'Asseyez-vous confortablement, dos droit',
      'Inspirez lentement par le nez pendant 5 secondes',
      'Expirez doucement par la bouche pendant 5 secondes',
      'Répétez 6 fois par minute',
      'Pratiquez 5 minutes, 3 fois par jour',
    ],
  },
  {
    id: '4-7-8',
    title: 'Technique 4-7-8',
    description: 'Technique de respiration pour l\'endormissement et la réduction du stress.',
    duration: '4 minutes',
    icon: '💜',
    benefit: 'Aide à l\'endormissement, réduit l\'anxiété, calme les contractions',
    steps: [
      'Inspirez silencieusement par le nez pendant 4 secondes',
      'Retenez votre souffle pendant 7 secondes',
      'Expirez complètement par la bouche pendant 8 secondes',
      'C\'est un cycle complet',
      'Répétez 4 fois',
    ],
  },
  {
    id: 'accouchement',
    title: 'Respiration de l\'Accouchement',
    description: 'La technique de respiration pendant les contractions pour gérer la douleur.',
    duration: 'Variable',
    icon: '🌸',
    benefit: 'Gère la douleur des contractions, apporte de l\'oxygène à bébé',
    steps: [
      'Pendant la contraction, inspirez profondément',
      'Expirez lentement et complètement',
      'Concentrez-vous sur votre expiration',
      'Visualisez votre col qui s\'ouvre',
      'Entre les contractions : respirez normalement et reposez-vous',
    ],
  },
  {
    id: 'abdominale',
    title: 'Respiration Abdominale',
    description: 'Respiration profonde du diaphragme pour détendre tout le corps.',
    duration: '10 minutes',
    icon: '🍃',
    benefit: 'Oxygène bébé, détend le plancher pelvien, prépare aux poussées',
    steps: [
      'Allongez-vous sur le côté gauche',
      'Placez une main sur votre ventre',
      'Inspirez profondément et sentez le ventre se gonfler',
      'Expirez lentement, ventre qui redescend',
      'Visualisez votre bébé bien oxygéné',
    ],
  },
  {
    id: 'sophro',
    title: 'Sophrologie Prénatale',
    description: 'Relaxation guidée avec visualisation positive de la naissance.',
    duration: '20 minutes',
    icon: '🌺',
    benefit: 'Prépare mentalement à la naissance, réduit la peur, renforce la confiance',
    steps: [
      'Installez-vous confortablement',
      'Fermez les yeux et respirez profondément',
      'Détendez chaque partie de votre corps progressivement',
      'Visualisez une naissance sereine et belle',
      'Imaginez votre bébé dans vos bras',
      'Ressentez la gratitude et l\'amour',
    ],
  },
  {
    id: 'yoga_nidra',
    title: 'Yoga Nidra Prénatal',
    description: 'Méditation de sommeil yoga pour une relaxation profonde.',
    duration: '30 minutes',
    icon: '🌙',
    benefit: 'Sommeil profond, régénération, connexion avec bébé',
    steps: [
      'Allongez-vous sur le côté gauche',
      'Fermez les yeux',
      'Prenez conscience de votre corps dans sa totalité',
      'Parcourez mentalement chaque partie du corps',
      'Laissez-vous glisser dans un état de demi-sommeil',
      'Restez consciente mais détendue',
    ],
  },
];

export const affirmations: Affirmation[] = [
  { id: '1', text: 'Mon corps est fait pour donner la vie. Je lui fais confiance.', category: 'confiance' },
  { id: '2', text: 'Chaque contraction m\'approche de mon bébé. Je les accueille avec sérénité.', category: 'force' },
  { id: '3', text: 'Mon bébé et moi formons une équipe parfaite.', category: 'amour' },
  { id: '4', text: 'Je suis forte, capable et prête. Je suis maman.', category: 'courage' },
  { id: '5', text: 'Mon amour pour mon bébé est plus grand que toute peur.', category: 'amour' },
  { id: '6', text: 'Des millions de femmes ont accouché avant moi. Je fais partie de cette lignée sacrée.', category: 'confiance' },
  { id: '7', text: 'Mon corps sait exactement ce qu\'il fait. Je lui fais confiance.', category: 'confiance' },
  { id: '8', text: 'Chaque jour qui passe, mon bébé grandit et se prépare à me rejoindre.', category: 'amour' },
  { id: '9', text: 'Je respire et je lâche prise. La naissance se déroule parfaitement.', category: 'force' },
  { id: '10', text: 'Je suis entourée d\'amour et de soutien. Je ne suis pas seule.', category: 'courage' },
  { id: '11', text: 'Mon bébé se sentira aimé et en sécurité dès sa naissance.', category: 'amour' },
  { id: '12', text: 'Je suis la maman parfaite pour mon bébé. Je suis choisie pour lui.', category: 'confiance' },
  { id: '13', text: 'La douleur est temporaire. La joie de tenir mon bébé est éternelle.', category: 'force' },
  { id: '14', text: 'Je me connecte à mon bébé à chaque respiration.', category: 'amour' },
  { id: '15', text: 'Je nais maman en même temps que mon bébé naît à la vie.', category: 'courage' },
  { id: '16', text: 'Mon corps crée un miracle. Je suis extraordinaire.', category: 'confiance' },
  { id: '17', text: 'Je choisis la paix et la sérénité pour moi et mon bébé.', category: 'force' },
  { id: '18', text: 'Je libère toute peur et j\'accueille l\'amour.', category: 'amour' },
];

export const relaxationSounds: RelaxationSound[] = [
  {
    id: 'pluie',
    title: 'Pluie douce',
    description: 'Bruit apaisant de la pluie légère',
    icon: '🌧️',
    duration: 'Continue',
  },
  {
    id: 'mer',
    title: 'Vagues de la mer',
    description: 'Douceur des vagues sur le sable',
    icon: '🌊',
    duration: 'Continue',
  },
  {
    id: 'foret',
    title: 'Forêt enchantée',
    description: 'Oiseaux et ruisseau en forêt',
    icon: '🌿',
    duration: 'Continue',
  },
  {
    id: 'berceuse',
    title: 'Berceuse classique',
    description: 'Berceuse douce pour bébé et maman',
    icon: '🎵',
    duration: '5 min',
  },
  {
    id: 'mozart',
    title: 'Mozart pour bébé',
    description: 'Stimulation cognitive par la musique classique',
    icon: '🎼',
    duration: '30 min',
  },
  {
    id: 'battements',
    title: 'Battements cardiaques',
    description: 'Doux battements de cœur rassurants',
    icon: '💓',
    duration: 'Continue',
  },
  {
    id: 'blanc',
    title: 'Bruit blanc',
    description: 'Son blanc pour un sommeil profond',
    icon: '🤍',
    duration: 'Continue',
  },
  {
    id: 'vent',
    title: 'Brise douce',
    description: 'Vent léger et apaisant',
    icon: '💨',
    duration: 'Continue',
  },
];

export const yogaPoses = [
  {
    id: 'chat_vache',
    name: 'Chat-Vache',
    trimester: [1, 2, 3],
    benefit: 'Soulage les douleurs dorsales',
    description: 'Sur les genoux, alternez arrondi et creux du dos en coordination avec la respiration.',
    icon: '🐱',
    duration: '5 min',
  },
  {
    id: 'papillon',
    name: 'Papillon',
    trimester: [1, 2, 3],
    benefit: 'Ouvre les hanches, prépare à l\'accouchement',
    description: 'Assise, joignez les plantes des pieds et laissez les genoux tomber vers le sol.',
    icon: '🦋',
    duration: '5 min',
  },
  {
    id: 'guerrier',
    name: 'Guerrière',
    trimester: [1, 2],
    benefit: 'Renforce les jambes, améliore l\'équilibre',
    description: 'Position de guerrière modifiée, jambes écartées, bras levés.',
    icon: '⚔️',
    duration: '3 min',
  },
  {
    id: 'enfant',
    name: 'Posture de l\'Enfant',
    trimester: [1, 2, 3],
    benefit: 'Relaxation profonde, soulage le dos',
    description: 'Agenouillez-vous et posez le front au sol, bras étirés devant vous.',
    icon: '🙇',
    duration: '5-10 min',
  },
  {
    id: 'pigeon',
    name: 'Pigeon',
    trimester: [1, 2],
    benefit: 'Ouvre les hanches, soulage la sciatique',
    description: 'Étirement des fléchisseurs de hanche, une jambe pliée, l\'autre étendue derrière.',
    icon: '🕊️',
    duration: '5 min',
  },
];

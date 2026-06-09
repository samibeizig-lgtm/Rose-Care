# 🌹 Rose Care — Companion de Grossesse

Application mobile React Native / Expo pour accompagner les femmes de la conception à l'accouchement.

## Fonctionnalités

### 🤰 Grossesse
- Suivi semaine par semaine (40 semaines complètes)
- Poids, taille et développement du bébé
- Comparaison avec des fruits
- Listes À faire / À éviter par semaine
- Conseils nutrition et notes médicales
- Messages émotionnels encourageants

### 💚 Santé
- Suivi du poids
- Tension artérielle avec alertes
- Glycémie (diabète gestationnel)
- Humeur et symptômes quotidiens
- Gestion des rendez-vous médicaux
- Conseils prénataux et signes d'alarme

### 🧘 Zen
- Exercices de respiration guidés (Cohérence cardiaque, 4-7-8)
- Sons de relaxation
- Affirmations positives animées
- Poses de yoga prénatal

### 📚 Ressources
- **Trousse Bébé** : checklist complète avec priorités
- **Valise Maman** : tout ce qu'il faut emporter à la clinique
- **Chambre bébé** : décoration et sécurité
- **Clinique La Rose** : contact, médecins, événements, chambres
- **Dossier CNAM** : prise en charge, congé maternité Tunisie
- **Calendrier Menstruel** : suivi du cycle, ovulation, prévisions
- **Mes Échographies** : galerie photos avec notes
- **Journal de Grossesse** : souvenirs et émotions

### 🌙 Calendrier Menstruel
- Suivi du cycle menstruel
- Prédiction de la prochaine période
- Identification de la fenêtre fertile et de l'ovulation
- Historique des cycles

## Installation

```bash
npm install
npx expo start
```

## Tech Stack

- **React Native** + **Expo** (SDK 51)
- **Expo Router** (file-based routing)
- **AsyncStorage** (stockage local)
- **expo-image-picker** (photos échographies)
- **expo-av** (sons zen)
- **expo-linear-gradient** (design)
- **date-fns** (calculs de dates)
- TypeScript

## Structure

```
app/
  (tabs)/          → Navigation principale (5 onglets)
  pregnancy/       → Détail semaine par semaine
  clinic.tsx       → Clinique La Rose
  cnam.tsx         → Dossier CNAM Tunisie
  essentials.tsx   → Trousse bébé & valise
  ultrasound.tsx   → Mes échographies
  menstrual.tsx    → Calendrier menstruel
  journal.tsx      → Journal de grossesse

src/
  data/            → Données (40 semaines, listes, zen)
  hooks/           → useStorage (AsyncStorage)
  theme/           → Couleurs rose
  components/      → Composants réutilisables
```

---

*Fait avec 💕 pour les mamans tunisiennes*

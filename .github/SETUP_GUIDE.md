# 🔑 Guide de Configuration GitHub Actions + EAS Build

## Étape 1 — Créer un compte Expo (gratuit)

1. Allez sur **https://expo.dev** → "Sign Up"
2. Créez votre compte (gratuit)

---

## Étape 2 — Créer un token Expo

1. Allez sur https://expo.dev/accounts/[votre-username]/settings/access-tokens
2. Cliquez **"Create Token"**
3. Nommez-le `GITHUB_ACTIONS`
4. Copiez le token (il ne s'affiche qu'une fois !)

---

## Étape 3 — Ajouter le secret GitHub

1. Allez sur votre repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Cliquez **"New repository secret"**
3. Nom : `EXPO_TOKEN`
4. Valeur : collez votre token Expo
5. Cliquez **"Add secret"**

---

## Étape 4 — Créer le projet EAS

Dans le terminal (ou Git Bash sur Windows) :

```bash
npm install -g eas-cli
eas login
eas init --id   # crée le projet et récupère le projectId
```

Puis mettez à jour `app.json` avec votre vrai `projectId` :

```json
"extra": {
  "eas": {
    "projectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

---

## Étape 5 — Lancer le build

### Option A : Automatique (à chaque push)
Le workflow `eas-build-android.yml` se déclenche automatiquement sur `main`.

### Option B : Manuel
1. GitHub → onglet **Actions**
2. Sélectionnez **"🤖 Build Android APK"**
3. Cliquez **"Run workflow"**
4. Choisissez le profil : `preview`
5. Cliquez **"Run workflow"** → le build démarre !

---

## Étape 6 — Télécharger l'APK

Après ~5-10 minutes :
1. GitHub → **Actions** → cliquez sur le run terminé
2. Section **Artifacts** → téléchargez `rose-care-android-apk`
3. Installez l'APK sur votre téléphone Android

> **Note iOS** : le build iOS nécessite un compte Apple Developer ($99/an).
> Pour tester sur iPhone sans payer, utilisez le workflow `expo-preview.yml` (Expo Go).

---

## 📡 Alternative gratuite : Expo Go (QR code)

Pour tester l'app immédiatement **sans build** :

1. Workflow **"📡 Expo Preview"** → Run workflow
2. Installez **Expo Go** sur votre téléphone
3. Scannez le QR code affiché dans les logs

---

## 📋 Résumé des workflows

| Workflow | Déclencheur | Résultat |
|----------|-------------|----------|
| `eas-build-android.yml` | Push sur main / Manuel | APK Android téléchargeable |
| `eas-build-ios.yml` | Manuel | IPA iOS (compte Apple requis) |
| `expo-preview.yml` | Push / Manuel | QR code Expo Go |
| `type-check.yml` | Chaque push | Vérification TypeScript |

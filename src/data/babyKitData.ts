export interface KitItem {
  id: string;
  name: string;
  quantity?: string;
  priority: 'essential' | 'important' | 'optional';
  note?: string;
  checked: boolean;
}

export interface KitCategory {
  id: string;
  title: string;
  icon: string;
  items: KitItem[];
}

export const momBagCategories: KitCategory[] = [
  {
    id: 'admin',
    title: 'Documents administratifs',
    icon: '📋',
    items: [
      { id: 'cin', name: 'Carte d\'identité nationale (CIN)', priority: 'essential', checked: false },
      { id: 'carnet_sante', name: 'Carnet de santé de grossesse', priority: 'essential', checked: false },
      { id: 'cnam_card', name: 'Carte CNAM', priority: 'essential', checked: false },
      { id: 'echographies', name: 'Toutes les échographies', priority: 'essential', checked: false },
      { id: 'analyses', name: 'Résultats d\'analyses', priority: 'essential', checked: false },
      { id: 'plan_naissance', name: 'Plan de naissance', priority: 'important', checked: false },
      { id: 'groupe_sanguin', name: 'Carte de groupe sanguin', priority: 'essential', checked: false },
    ],
  },
  {
    id: 'vetements_maman',
    title: 'Vêtements et confort',
    icon: '👕',
    items: [
      { id: 'chemises_nuit', name: 'Chemises de nuit (ouvertes pour allaitement)', quantity: '2-3', priority: 'essential', checked: false },
      { id: 'robe_de_chambre', name: 'Robe de chambre', priority: 'important', checked: false },
      { id: 'chaussons', name: 'Chaussons antidérapants', priority: 'essential', checked: false },
      { id: 'sous_vetements', name: 'Sous-vêtements post-accouchement (larges)', quantity: '5', priority: 'essential', checked: false },
      { id: 'soutien_gorge', name: 'Soutien-gorge d\'allaitement', quantity: '2', priority: 'essential', checked: false },
      { id: 'tenue_retour', name: 'Tenue pour le retour à la maison', priority: 'important', note: 'Taille grossesse, pas avant', checked: false },
      { id: 'chaussettes', name: 'Chaussettes', quantity: '3 paires', priority: 'important', checked: false },
    ],
  },
  {
    id: 'hygiene_maman',
    title: 'Hygiène et soins',
    icon: '🧴',
    items: [
      { id: 'serviettes', name: 'Serviettes hygiéniques spéciales post-partum', quantity: 'Grand paquet', priority: 'essential', checked: false },
      { id: 'brosse_dents', name: 'Brosse à dents et dentifrice', priority: 'essential', checked: false },
      { id: 'shampoing', name: 'Shampoing et gel douche', priority: 'essential', checked: false },
      { id: 'creme_corps', name: 'Crème pour le corps', priority: 'important', checked: false },
      { id: 'coussinets', name: 'Coussinets d\'allaitement', priority: 'essential', checked: false },
      { id: 'lanoline', name: 'Crème à la lanoline pour les mamelons', priority: 'important', checked: false },
      { id: 'maquillage_leger', name: 'Maquillage léger (optionnel)', priority: 'optional', checked: false },
      { id: 'deodorant', name: 'Déodorant', priority: 'essential', checked: false },
    ],
  },
  {
    id: 'confort',
    title: 'Confort et divertissement',
    icon: '📱',
    items: [
      { id: 'telephone', name: 'Téléphone et chargeur', priority: 'essential', checked: false },
      { id: 'oreiller', name: 'Oreiller personnel', priority: 'optional', checked: false },
      { id: 'musique', name: 'Écouteurs / musique relaxante', priority: 'optional', checked: false },
      { id: 'snacks', name: 'Snacks énergétiques (barres, fruits secs)', priority: 'important', note: 'Pour le travail', checked: false },
      { id: 'eau', name: 'Grande bouteille d\'eau', priority: 'essential', checked: false },
      { id: 'livre', name: 'Livre ou magazine', priority: 'optional', checked: false },
      { id: 'appareil_photo', name: 'Appareil photo / chargeur', priority: 'important', checked: false },
    ],
  },
  {
    id: 'medicaments',
    title: 'Médicaments prescrits',
    icon: '💊',
    items: [
      { id: 'medicaments_prescrits', name: 'Médicaments prescrits par le médecin', priority: 'essential', checked: false },
      { id: 'vitamines', name: 'Vitamines prénatales', priority: 'important', checked: false },
      { id: 'glycemie', name: 'Lecteur de glycémie si diabète gestationnel', priority: 'essential', checked: false },
    ],
  },
];

export const babyKitCategories: KitCategory[] = [
  {
    id: 'vetements_bebe',
    title: 'Vêtements bébé',
    icon: '👶',
    items: [
      { id: 'pyjamas_naissance', name: 'Pyjamas dors-bien (grenouillères)', quantity: '4-5', priority: 'essential', note: 'Taille naissance ET 1 mois', checked: false },
      { id: 'bodies', name: 'Bodies manches longues', quantity: '5-6', priority: 'essential', checked: false },
      { id: 'bonnets', name: 'Bonnets', quantity: '3', priority: 'essential', checked: false },
      { id: 'chaussettes', name: 'Chaussettes / chaussons', quantity: '5 paires', priority: 'essential', checked: false },
      { id: 'gilets', name: 'Gilets en laine', quantity: '2', priority: 'essential', checked: false },
      { id: 'bavoirs', name: 'Bavoirs', quantity: '5-6', priority: 'essential', checked: false },
      { id: 'combinaison_sortie', name: 'Combinaison de sortie (nid d\'ange)', priority: 'important', checked: false },
    ],
  },
  {
    id: 'hygiene_bebe',
    title: 'Hygiène bébé',
    icon: '🧼',
    items: [
      { id: 'couches_naissance', name: 'Couches taille naissance', quantity: '1 paquet', priority: 'essential', checked: false },
      { id: 'couches_1', name: 'Couches taille 1', quantity: '1 paquet', priority: 'essential', checked: false },
      { id: 'lingettes', name: 'Lingettes sans alcool', quantity: '2 paquets', priority: 'essential', checked: false },
      { id: 'creme_fesse', name: 'Crème pour les fesses (Bepanthen)', priority: 'essential', checked: false },
      { id: 'creme_visage', name: 'Lait hydratant bébé', priority: 'important', checked: false },
      { id: 'coton', name: 'Coton hydrophile', priority: 'essential', checked: false },
      { id: 'serum_phy', name: 'Sérum physiologique', priority: 'essential', checked: false },
      { id: 'savon_bebe', name: 'Savon liquide bébé sans larmes', priority: 'important', checked: false },
    ],
  },
  {
    id: 'alimentation',
    title: 'Alimentation',
    icon: '🍼',
    items: [
      { id: 'biberons', name: 'Biberons (si biberon)', quantity: '3-4', priority: 'essential', checked: false },
      { id: 'lait', name: 'Lait infantile 1er âge (si non allaitement)', priority: 'important', checked: false },
      { id: 'tire_lait', name: 'Tire-lait (si allaitement)', priority: 'important', checked: false },
      { id: 'coupelles_allaitement', name: 'Coupelles d\'allaitement', priority: 'optional', checked: false },
    ],
  },
  {
    id: 'couchage',
    title: 'Couchage et mobilité',
    icon: '🛏️',
    items: [
      { id: 'couffin', name: 'Couffin / berceau / lit bébé', priority: 'essential', checked: false },
      { id: 'matelas', name: 'Matelas ferme', priority: 'essential', checked: false },
      { id: 'draps', name: 'Draps-housses ajustés', quantity: '2-3', priority: 'essential', checked: false },
      { id: 'turbulette', name: 'Turbulettes (gigoteuses)', quantity: '2', priority: 'essential', checked: false },
      { id: 'siège_auto', name: 'Siège auto groupe 0+', priority: 'essential', note: 'Obligatoire pour quitter la maternité', checked: false },
      { id: 'poussette', name: 'Poussette/landau', priority: 'essential', checked: false },
    ],
  },
  {
    id: 'sante',
    title: 'Santé et pharmacie',
    icon: '🌡️',
    items: [
      { id: 'thermometre', name: 'Thermomètre', priority: 'essential', checked: false },
      { id: 'mouche_bebe', name: 'Mouche-bébé nasal', priority: 'essential', checked: false },
      { id: 'ciseau_ongle', name: 'Coupe-ongles bébé', priority: 'important', checked: false },
      { id: 'brosse_cheveux', name: 'Brosse à cheveux douce', priority: 'optional', checked: false },
      { id: 'alcool_90', name: 'Alcool 90° pour cordon ombilical', priority: 'essential', checked: false },
      { id: 'compresses', name: 'Compresses stériles', priority: 'essential', checked: false },
    ],
  },
];

export const chamberDecorItems = [
  {
    category: 'Mobilier',
    icon: '🪑',
    items: ['Lit barreaux', 'Table à langer', 'Commode', 'Fauteuil allaitement', 'Armoire bébé'],
  },
  {
    category: 'Décoration',
    icon: '🎨',
    items: ['Veilleuse', 'Mobile musical', 'Tapis d\'éveil', 'Cadres décoratifs', 'Stickers muraux', 'Rideau occultant'],
  },
  {
    category: 'Sécurité',
    icon: '🔒',
    items: ['Babyphone', 'Protège-coins', 'Caches prises', 'Barrière de sécurité'],
  },
];

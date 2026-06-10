import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/theme/colors';
import { babyKitCategories, momBagCategories, chamberDecorItems, KitItem } from '../src/data/babyKitData';
import { useStorage, STORAGE_KEYS } from '../src/hooks/useStorage';

export default function EssentialsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bebe' | 'maman' | 'chambre'>('bebe');
  const [babyChecks, setBabyChecks] = useStorage<Record<string, boolean>>(STORAGE_KEYS.BABY_KIT_CHECKS, {});
  const [momChecks, setMomChecks] = useStorage<Record<string, boolean>>(STORAGE_KEYS.MOM_BAG_CHECKS, {});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const toggleBaby = (id: string) => setBabyChecks({ ...babyChecks, [id]: !babyChecks[id] });
  const toggleMom = (id: string) => setMomChecks({ ...momChecks, [id]: !momChecks[id] });

  const countChecked = (categories: typeof babyKitCategories, checks: Record<string, boolean>) => {
    let total = 0, checked = 0;
    categories.forEach(cat => {
      cat.items.forEach(item => {
        total++;
        if (checks[item.id]) checked++;
      });
    });
    return { total, checked, progress: total ? checked / total : 0 };
  };

  const babyStats = countChecked(babyKitCategories, babyChecks);
  const momStats = countChecked(momBagCategories, momChecks);

  const getPriorityColor = (priority: KitItem['priority']) => {
    switch (priority) {
      case 'essential': return Colors.error;
      case 'important': return Colors.warning;
      case 'optional': return Colors.success;
    }
  };

  const getPriorityLabel = (priority: KitItem['priority']) => {
    switch (priority) {
      case 'essential': return 'Essentiel';
      case 'important': return 'Important';
      case 'optional': return 'Optionnel';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#2D1B69', '#6D28D9']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Ionicons name="bag-outline" size={22} color={Colors.lavender} style={{ marginRight: 10 }} />
          <Text style={styles.headerTitle}>Trousse & Valise</Text>
        </View>
        <Text style={styles.headerSubtitle}>Checklist complète pour la naissance</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <View style={styles.progressLabelRow}>
              <Ionicons name="gift-outline" size={14} color="rgba(255,255,255,0.85)" style={{ marginRight: 4 }} />
              <Text style={styles.progressLabel}>Trousse bébé</Text>
            </View>
            <Text style={styles.progressValue}>{babyStats.checked}/{babyStats.total}</Text>
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressLabelRow}>
              <Ionicons name="briefcase-outline" size={14} color="rgba(255,255,255,0.85)" style={{ marginRight: 4 }} />
              <Text style={styles.progressLabel}>Valise maman</Text>
            </View>
            <Text style={styles.progressValue}>{momStats.checked}/{momStats.total}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['bebe', 'maman', 'chambre'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
            name={tab === 'bebe' ? 'gift-outline' : tab === 'maman' ? 'briefcase-outline' : 'bed-outline'}
            size={18}
            color={activeTab === tab ? Colors.white : Colors.textSecondary}
          />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'bebe' ? 'Bébé' : tab === 'maman' ? 'Maman' : 'Chambre'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Baby Kit */}
          {activeTab === 'bebe' && (
            <>
              {/* Progress Bar */}
              <View style={styles.progressCard}>
                <View style={styles.progressBarLabels}>
                  <Text style={styles.progressBarLabel}>Progression</Text>
                  <Text style={styles.progressBarPct}>{Math.round(babyStats.progress * 100)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${babyStats.progress * 100}%`, backgroundColor: Colors.primary }]} />
                </View>
              </View>

              {/* Priority Legend */}
              <View style={styles.legend}>
                {(['essential', 'important', 'optional'] as const).map(p => (
                  <View key={p} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getPriorityColor(p) }]} />
                    <Text style={styles.legendText}>{getPriorityLabel(p)}</Text>
                  </View>
                ))}
              </View>

              {babyKitCategories.map((cat) => {
                const catChecked = cat.items.filter(i => babyChecks[i.id]).length;
                const isExpanded = expandedCat === cat.id;
                return (
                  <View key={cat.id} style={styles.categoryCard}>
                    <TouchableOpacity
                      style={styles.categoryHeader}
                      onPress={() => setExpandedCat(isExpanded ? null : cat.id)}
                    >
                      <View style={styles.categoryIconWrap}>
                        <Ionicons name={cat.icon as any} size={18} color={Colors.primary} />
                      </View>
                      <Text style={styles.categoryTitle}>{cat.title}</Text>
                      <Text style={styles.categoryStat}>{catChecked}/{cat.items.length}</Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textLight} />
                    </TouchableOpacity>

                    {isExpanded && cat.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemRow, babyChecks[item.id] && styles.itemRowDone]}
                        onPress={() => toggleBaby(item.id)}
                      >
                        <View style={[styles.checkbox, babyChecks[item.id] && styles.checkboxDone]}>
                          {babyChecks[item.id] && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                        </View>
                        <View style={styles.itemInfo}>
                          <View style={styles.itemNameRow}>
                            <Text style={[styles.itemName, babyChecks[item.id] && styles.itemNameDone]}>{item.name}</Text>
                            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                                {getPriorityLabel(item.priority)}
                              </Text>
                            </View>
                          </View>
                          {item.quantity && <Text style={styles.itemQty}>Quantité : {item.quantity}</Text>}
                          {item.note && (
                            <View style={styles.itemNoteRow}>
                              <Ionicons name="bulb-outline" size={12} color={Colors.warning} style={{ marginRight: 4 }} />
                              <Text style={styles.itemNote}>{item.note}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </>
          )}

          {/* Mom Bag */}
          {activeTab === 'maman' && (
            <>
              <View style={styles.progressCard}>
                <View style={styles.progressBarLabels}>
                  <Text style={styles.progressBarLabel}>Valise prête à</Text>
                  <Text style={styles.progressBarPct}>{Math.round(momStats.progress * 100)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${momStats.progress * 100}%`, backgroundColor: Colors.primary }]} />
                </View>
              </View>

              <View style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={16} color={Colors.warning} style={{ marginRight: 8, flexShrink: 0 }} />
                <Text style={styles.tipText}>
                  Préparez votre valise à partir de la semaine 35. Gardez-la dans le coffre de la voiture à partir de 37 SA.
                </Text>
              </View>

              <View style={styles.legend}>
                {(['essential', 'important', 'optional'] as const).map(p => (
                  <View key={p} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getPriorityColor(p) }]} />
                    <Text style={styles.legendText}>{getPriorityLabel(p)}</Text>
                  </View>
                ))}
              </View>

              {momBagCategories.map((cat) => {
                const catChecked = cat.items.filter(i => momChecks[i.id]).length;
                const isExpanded = expandedCat === cat.id;
                return (
                  <View key={cat.id} style={styles.categoryCard}>
                    <TouchableOpacity
                      style={styles.categoryHeader}
                      onPress={() => setExpandedCat(isExpanded ? null : cat.id)}
                    >
                      <View style={styles.categoryIconWrap}>
                        <Ionicons name={cat.icon as any} size={18} color={Colors.primary} />
                      </View>
                      <Text style={styles.categoryTitle}>{cat.title}</Text>
                      <Text style={styles.categoryStat}>{catChecked}/{cat.items.length}</Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textLight} />
                    </TouchableOpacity>

                    {isExpanded && cat.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemRow, momChecks[item.id] && styles.itemRowDone]}
                        onPress={() => toggleMom(item.id)}
                      >
                        <View style={[styles.checkbox, momChecks[item.id] && styles.checkboxDone]}>
                          {momChecks[item.id] && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                        </View>
                        <View style={styles.itemInfo}>
                          <View style={styles.itemNameRow}>
                            <Text style={[styles.itemName, momChecks[item.id] && styles.itemNameDone]}>{item.name}</Text>
                            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                                {getPriorityLabel(item.priority)}
                              </Text>
                            </View>
                          </View>
                          {item.quantity && <Text style={styles.itemQty}>Quantité : {item.quantity}</Text>}
                          {item.note && (
                            <View style={styles.itemNoteRow}>
                              <Ionicons name="bulb-outline" size={12} color={Colors.warning} style={{ marginRight: 4 }} />
                              <Text style={styles.itemNote}>{item.note}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </>
          )}

          {/* Baby Room */}
          {activeTab === 'chambre' && (
            <>
              <View style={styles.chambreTitleRow}>
                <Ionicons name="home-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.chambreTitle}>Décorer la Chambre de Bébé</Text>
              </View>
              {chamberDecorItems.map((cat, idx) => (
                <View key={idx} style={styles.chambreCard}>
                  <LinearGradient
                    colors={['#4C1D95', '#6D28D9']}
                    style={styles.chambreHeader}
                  >
                    <Ionicons name={cat.icon as any} size={20} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.chambreCategory}>{cat.category}</Text>
                  </LinearGradient>
                  <View style={styles.chambreItems}>
                    {cat.items.map((item, i) => (
                      <View key={i} style={styles.chambreItem}>
                        <View style={styles.chambreItemBullet} />
                        <Text style={styles.chambreItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.safetyCard}>
                <View style={styles.safetyTitleRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Colors.warning} style={{ marginRight: 8 }} />
                  <Text style={styles.safetyTitle}>Sécurité dans la chambre</Text>
                </View>
                {[
                  'Matelas ferme adapté, jamais de polochon ni oreiller < 2 ans',
                  'Température de la pièce : 19-20°C',
                  'Évitez les jouets dans le lit < 1 an',
                  'Barrière de sécurité aux escaliers quand bébé marche',
                  'Caches prises dans toute la maison',
                  'Pas d\'écrans dans la chambre < 3 ans',
                ].map((tip, i) => (
                  <View key={i} style={styles.safetyRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} style={{ flexShrink: 0 }} />
                    <Text style={styles.safetyText}>{tip}</Text>
                  </View>
                ))}
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
  header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  backBtn: { padding: 4, marginBottom: 8 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  progressRow: { flexDirection: 'row', gap: 16 },
  progressItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12 },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  progressValue: { fontSize: 18, fontWeight: '800', color: Colors.white },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 6 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12 },
  tabActive: { backgroundColor: Colors.primary },
  tabIcon: { fontSize: 20 },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginTop: 2 },
  tabTextActive: { color: Colors.white },
  content: { padding: 16 },
  progressCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  progressBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBarLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  progressBarPct: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  progressTrack: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.warningLight, borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.warning },
  tipText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  categoryCard: { backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  categoryIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.lilac, justifyContent: 'center', alignItems: 'center' },
  categoryTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.text },
  categoryStat: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginRight: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, gap: 10 },
  itemRowDone: { backgroundColor: Colors.successLight },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: 2, flexShrink: 0 },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  itemInfo: { flex: 1 },
  itemNameRow: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 },
  itemName: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  itemNameDone: { textDecorationLine: 'line-through', color: Colors.textLight },
  priorityBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  itemQty: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  itemNoteRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3 },
  itemNote: { flex: 1, fontSize: 12, color: Colors.textLight, fontStyle: 'italic' },
  chambreTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  chambreTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  chambreCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  chambreHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  chambreCategory: { fontSize: 16, fontWeight: '700', color: Colors.white },
  chambreItems: { backgroundColor: Colors.surface, padding: 12 },
  chambreItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  chambreItemBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.mauve, flexShrink: 0 },
  chambreItemText: { fontSize: 14, color: Colors.text },
  safetyCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 4, borderLeftColor: Colors.warning },
  safetyTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  safetyTitle: { fontSize: 16, fontWeight: '700', color: Colors.warning },
  safetyRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, gap: 8 },
  safetyText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
});

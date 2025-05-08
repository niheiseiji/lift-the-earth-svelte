// トレーニングメニューの初期数
export const setCount = 5;
export const menuCount = 6;

// 空のセットを作る
export const createSets = (count) =>
  Array.from({ length: count }, () => ({ reps: '', weight: '' }));

/**
 * トレーニングメニュー配列を所定の件数・セット数に補完する
 *
 * - メニュー数が `menuCount` に満たない場合は空メニューを追加
 * - 各メニュー内のセット数が `setCount` に満たない場合は空セットを追加
 * - 既存データは可能な限り保持
 *
 * @param {Array<{ name: string, sets: Array<{ reps: string|number, weight: string|number }> }>} menus
 * @returns {Array<{ name: string, sets: Array<{ reps: string, weight: string }> }>}
 */
export const padMenus = (menus) => {
  return Array.from({ length: menuCount }, (_, i) => {
    const base = menus[i] ?? { name: '', sets: [] };
    const paddedSets = createSets(setCount).map((emptySet, j) => {
      const original = base.sets?.[j];
      return {
        reps: original?.reps ?? emptySet.reps,
        weight: original?.weight ?? emptySet.weight
      };
    });
    return { id: `${i + 1}`, name: base.name ?? '', sets: paddedSets };
  });
};

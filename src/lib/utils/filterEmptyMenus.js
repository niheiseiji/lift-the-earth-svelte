/**
 * 不要なトレーニングメニューを除外する
 * - メニュー名が空
 * - 全セットが未入力（reps または weight のいずれかが入力されていて、かつ両方が 0 でないものが1つもない場合）
 * @param {Array} menus
 * @returns {Array} filteredMenus
 */
export const filterEmptyMenus = (menus) => {
  return menus
    .map((menu) => {
      const filteredSets = menu.sets.filter((set) => !(Number(set.reps) === 0 && Number(set.weight) === 0));
      return { ...menu, sets: filteredSets };
    })
    .filter((menu) => {
      const hasName = menu.name.trim() !== '';
      const hasAnySetInput = menu.sets.length > 0;
      return hasName || hasAnySetInput;
    });
};

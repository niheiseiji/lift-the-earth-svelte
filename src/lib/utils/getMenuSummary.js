/**
 * メニュー配列からメニュー名を句点区切りで取得します
 * @param {Array} menus
 * @returns {String} menus
 */
export const getMenuSummary = (menus) => menus.map((m) => m.name).join('、');


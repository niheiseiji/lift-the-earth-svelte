/**
 * ISO形式の日付文字列を「MM/DD (曜) HH:mm」形式に変換する
 * 例: "2025-05-05T07:54:33.336" → "05/05 (月) 07:54"
 *
 * @param {string} iso - ISO8601形式の日付文字列
 * @returns {string} 整形済みの日付文字列
 */
export const formatDate = (iso) => {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${month}/${day} (${weekday}) ${hours}:${minutes}`;
};

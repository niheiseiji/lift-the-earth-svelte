/**
 * ISO形式の日付文字列を「MM/DD (曜) HH:mm」形式に変換する（タイムゾーン補正なし）
 * @param {string} iso - ISO8601形式の日付文字列
 * @returns {string}
 */
export const formatDate = (iso) => {
  const [datePart, timePart] = iso.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');

  const weekday = ['日', '月', '火', '水', '木', '金', '土'][
    new Date(`${year}-${month}-${day}`).getDay()
  ];

  return `${month}/${day} (${weekday}) ${hour}:${minute}`;
};

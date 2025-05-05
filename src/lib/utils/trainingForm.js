// ファイル: $lib/utils/trainingForm.js
export const setCount = 5;
export const menuCount = 6;
export const createSets = (count) =>
  Array.from({ length: count }, () => ({ reps: '', weight: '' }));

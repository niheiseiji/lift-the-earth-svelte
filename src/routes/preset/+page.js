import { fetchPresetTrainings } from '$lib/api';

export const load = async () => {
  const presets = await fetchPresetTrainings();
  return { presets };
};
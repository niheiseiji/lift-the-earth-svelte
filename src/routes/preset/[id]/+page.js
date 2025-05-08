import { fetchPresetTrainingById } from '$lib/api';

export const load = async ({ params }) => {
  const training = await fetchPresetTrainingById(params.id);
  return {
    training,
    id: params.id
  };
};

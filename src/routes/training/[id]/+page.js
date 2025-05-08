import { fetchTrainingById } from '$lib/api';

export const load = async ({ params }) => {
  const training = await fetchTrainingById(params.id);
  return {
    training,
    id: params.id
  };
};

import { fetchTrainings, fetchTrainingSummary } from '$lib/api';

export const load = async () => {
  const trainings = await fetchTrainings();
  const trainingSummary = await fetchTrainingSummary();

  const today = new Date().toISOString().slice(0, 10);

  return {
    trainings,
    trainingSummary,
  };
};

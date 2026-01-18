import { WorkoutHistoryEntry } from './types';

export const dbService = {
  init: async () => {},

  saveWorkoutHistory: async (entry: WorkoutHistoryEntry): Promise<boolean> => {
    try {
      console.log('SASSS');
      return true;
    } catch (error) {
      console.error('SQLite Save Error:', error);
      return false;
    }
  },

  getWorkoutHistory: async (): Promise<WorkoutHistoryEntry[]> => {
    try {
      console.log('SAAA');
      return [];
    } catch (error) {
      console.error('SQLite Fetch Error:', error);
      return [];
    }
  },
};

dbService.init().catch(console.error);

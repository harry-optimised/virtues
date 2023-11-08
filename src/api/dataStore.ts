import { Frame } from './types';

function getDatePlusDays(days: number): string {
  const today = new Date();
  today.setDate(today.getDate() + days);
  today.setHours(9);
  return today.toISOString();
}

interface Datastore {
  frames: Frame[];
}

export const dataStore: Datastore = {
  frames: [
    {
      id: Math.random().toString(6),
      date: getDatePlusDays(0),
      data: {
        constitution: [1, 0, 0, 0, 2, 0, 0],
        order: [0, 0, 0, 0, 0, 0, 0],
        industry: [0, 0, 0, 0, 0, 0, 0],
        amity: [0, 0, 0, 0, 0, 0, 0],
        direction: [0, 0, 0, 0, 0, 0, 0],
        curiosity: [0, 0, 0, 0, 0, 0, 0]
      }
    }
  ]
};

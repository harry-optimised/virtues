import { dataStore } from './dataStore';
import { Profile } from './types';

export const retrieveProfile = (): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dataStore.profile);
    }, Math.random() * 1000);
  });
};

export const putProfile = (profile: Profile): Promise<Profile> => {
  return new Promise((resolve) => {
    dataStore.profile = { ...dataStore.profile, ...profile };
    resolve(profile);
  });
};

export const addCarer = (carerID: string): Promise<string> => {
  return new Promise((resolve) => {
    dataStore.profile.carers.push(carerID);
    resolve(carerID);
  });
};

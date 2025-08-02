import { atom } from 'recoil';

export const publicEpisodesState = atom({
  key: 'publicEpisodesState',
  default: [],
});

export const creatorEpisodesState = atom({
  key: 'creatorEpisodesState',
  default: [],
});
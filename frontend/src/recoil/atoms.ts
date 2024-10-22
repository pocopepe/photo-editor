import { atom } from 'recoil';

export const uploadedCountAtom = atom<number>({
    key: 'uploadedCountAtom', 
    default: 1,
});

export const uploadedFilesAtom = atom<string[]>({
    key: 'uploadedFilesAtom', 
    default: [],
});
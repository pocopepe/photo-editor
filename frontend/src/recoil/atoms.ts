import { atom } from 'recoil';
import * as fabric from 'fabric';

export const uploadedCountAtom = atom<number>({
    key: 'uploadedCountAtom', 
    default: 1,
});

export const uploadedFilesAtom = atom<string[]>({
    key: 'uploadedFilesAtom', 
    default: [],
});

export const editorAtom = atom<fabric.Canvas | null>({
    key: 'editorAtom',
    default: null,
});

export const onReadyAtom = atom<((canvas: fabric.Canvas) => void) | null>({
    key: 'onReadyAtom',
    default: null,
});

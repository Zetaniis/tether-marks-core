import {  BasicMarksSettings as BasicMarksSettings, Mode } from "./types";

// This is not used for now
export const modalPlaceholderMessages : Record<Mode, string> = {
    set: 'Select a mark to set',
    goto: 'Select a mark to go to',
    delete: 'Select a mark to delete',
};

export const defaultBasicMarksSettings: BasicMarksSettings = {
    registerList: 'abcdefghijklmnopqrstuvwxyz',
    registerSortByList: true,
    harpoonRegisterList: 'qwer',
    harpoonRegisterSortByList: true,
    harpoonRegisterGapRemoval: true,
};

export const modeDescription : Record<Mode, string> = {
    'set': 'Set mark',
    'goto': 'Go to mark',
    'delete': 'Delete mark'
}
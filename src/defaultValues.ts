import {  Settings, Mode } from "./types";

// This is not used for now
export const modalPlaceholderMessages : Record<Mode, string> = {
    set: 'Select a mark to set',
    goto: 'Select a mark to go to',
    delete: 'Select a mark to delete',
};

export const defaultSettings: Settings = {
    // hideMarkListDuringInput: false,
    modalListUp: '',
    modalListDown: '',
    modalListSelect: '',
    modalListUndo: '',
    modalListDelete: '',
    modalListCancel: '',
    openMarkInNewTab: false, // If true, open mark in new tab, else in current tab
    registerList: 'abcdefghijklmnopqrstuvwxyz',
    registerSortByList: true,
    harpoonRegisterList: 'qwer',
    harpoonRegisterSortByList: true,
    harpoonRegisterGapRemoval: true,
    experimentalGoto: false,
};

export const modeDescription : Record<Mode, string> = {
    'set': 'Set mark',
    'goto': 'Go to mark',
    'delete': 'Delete mark'
}
export interface Mark {
    symbol: string;
    filePath: string;
}

export interface BasicMarksSettings {
    registerList: string; // All key symbols that should be used as registers
    registerSortByList: boolean; // If true, sort registers by the order of the key symbols in the registerList
    harpoonRegisterList: string; // All key symbols that should be used as registers for the Harpoon feature
    harpoonRegisterSortByList: boolean;
    harpoonRegisterGapRemoval: boolean;
}

export type Mode = 'set' | 'goto' | 'delete';

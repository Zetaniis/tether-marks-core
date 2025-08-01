export interface Mark {
    symbol: string;
    filePath: string;
}
export interface BasicMarksSettings {
    registerList: string;
    registerSortByList: boolean;
    harpoonRegisterList: string;
    harpoonRegisterSortByList: boolean;
    harpoonRegisterGapRemoval: boolean;
}
export type Mode = 'set' | 'goto' | 'delete';

import { BasicMarksSettings } from './types/index';
import { Mark } from './types/index';
export declare function findFirstUnusedRegister<T extends Mark>(marks: T[], registers: string[]): string | null;
export declare function getMarkBySymbol<T extends Mark>(marks: T[], symbol: string): T | undefined;
export declare function sortMarksAlphabetically<T extends Mark>(marks: T[]): void;
export declare function getSortedAndFilteredMarks<T extends Mark>(marks: T[], isHarpoonMode: boolean, settings: BasicMarksSettings): T[];
export declare function sortMarksBySettingsRegisterOrder<T extends Mark>(marks: T[], registers: string | string[]): void;
export declare function removeGapsForHarpoonMarks<T extends Mark>(marksToCopy: T[], harpoonRegisters: string[]): T[];
export declare function restoreLastChangedMark<T extends Mark>(marks: T[], lastChangedMark: T): {
    marks: T[];
    markToDiscard: T | undefined;
};
export declare function setNewOrOverwriteMark<T extends Mark>(marks: T[], setMark: T, filePath: string): {
    marks: T[];
    overwrittenMark?: T;
};
export declare function deleteMark<T extends Mark>(marks: T[], markToDelete: T): {
    marks: T[];
    deletedMark?: T;
};
export declare function isMarkInList<T extends Mark>(marks: T[], mark: T): boolean;
export declare function isMarkInListBySymbol<T extends Mark>(marks: T[], symbol: string): boolean;
export declare function isMarkInListByFilePath<T extends Mark>(marks: T[], filePath: string): boolean;
export declare function gotoMarkNext<T extends Mark>(marks: T[], registers: string[] | string, currentMark: T): T | undefined;
export declare function gotoMarkPrevious<T extends Mark>(marks: T[], registers: string[] | string, currentMark: T): T | undefined;

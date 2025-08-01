import { BasicMarksSettings } from './types/index';
import { Mark } from './types/index';
export declare function findFirstUnusedRegister(marks: Mark[], registers: string[]): string | null;
export declare function getMarkBySymbol(marks: Mark[], symbol: string): Mark | undefined;
export declare function sortMarksAlphabetically(marks: Mark[]): void;
export declare function getSortedAndFilteredMarks(marks: Mark[], isHarpoonMode: boolean, settings: BasicMarksSettings): Mark[];
export declare function sortMarksBySettingsRegisterOrder(marks: Mark[], registers: string | string[]): void;
export declare function removeGapsForHarpoonMarks(marksToCopy: Mark[], harpoonRegisters: string[]): Mark[];
export declare function restoreLastChangedMark(marks: Mark[], lastChangedMark: Mark): {
    marks: Mark[];
    markToDiscard: Mark | undefined;
};
export declare function setNewOrOverwriteMark(marks: Mark[], setMark: Mark, filePath: string): {
    marks: Mark[];
    overwrittenMark?: Mark;
};
export declare function deleteMark(marks: Mark[], markToDelete: Mark): {
    marks: Mark[];
    deletedMark?: Mark;
};
export declare function isMarkInList(marks: Mark[], mark: Mark): boolean;
export declare function isMarkInListBySymbol(marks: Mark[], symbol: string): boolean;
export declare function isMarkInListByFilePath(marks: Mark[], filePath: string): boolean;
export declare function gotoMarkNext(marks: Mark[], registers: string[] | string, currentMark: Mark): Mark | undefined;
export declare function gotoMarkPrevious(marks: Mark[], registers: string[] | string, currentMark: Mark): Mark | undefined;

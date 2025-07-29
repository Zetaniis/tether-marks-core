import {
    findFirstUnusedRegister,
    getMarkBySymbol,
    sortMarksAlphabetically,
    getSortedAndFilteredMarks,
    sortMarksBySettingsRegisterOrder,
    removeGapsForHarpoonMarks,
    setNewOrOverwriteMark,
    deleteMark,
    isMarkInList,
    isMarkInListBySymbol,
    isMarkInListByFilePath,
    gotoMarkNext,
    gotoMarkPrevious
} from '../../src/marks';
import { Mark, Settings } from '../../src/types/index';
import { defaultSettings } from '../../src/defaultValues';

describe('marks utils', () => {
    const marks: Mark[] = [
        { symbol: 'A', filePath: 'fileA.md' },
        { symbol: 'C', filePath: 'fileC.md' },
        { symbol: 'B', filePath: 'fileB.md' },
        { symbol: 'E', filePath: 'fileE.md' }
    ];
    const registers = ['A', 'B', 'C', 'D', 'E'];

    describe('findFirstUnusedRegister', () => {
        it('returns the first unused register', () => {
            const registers = ['A', 'B', 'C', 'D', 'E'];
            expect(findFirstUnusedRegister(marks, registers)).toBe('D');
        });
        it('returns null if all registers are used', () => {
            const registers = ['A', 'B', 'C', 'E'];
            expect(findFirstUnusedRegister(marks, registers)).toBe(null);
        });
        // uncomment if the feature for case sensitivity/insensitivty is implemented
        // it('is case-insensitive', () => {
        //     const registers = ['a', 'b', 'c', 'd', 'e'];
        //     expect(findFirstUnusedRegister(marks, registers)).toBe('d');
        // });
    });

    describe('getMarkBysymbol', () => {
        it('finds a mark by symbol', () => {
            expect(getMarkBySymbol(marks, 'E')?.filePath).toBe('fileE.md');
        });
        // uncomment if the feature for case sensitivity/insensitivty is implemented
        // it('finds a mark by symbol (case-insensitive)', () => {
        //     expect(getMarkBysymbol(marks, 'a')?.filePath).toBe('fileA.md');
        //     expect(getMarkBysymbol(marks, 'E')?.filePath).toBe('fileE.md');
        // });
        it('returns undefined if not found', () => {
            expect(getMarkBySymbol(marks, 'Z')).toBeUndefined();
        });
    });

    describe('sortMarksAlphabetically', () => {
        it('sorts marks alphabetically by symbol', () => {
            const arr = [...marks];
            sortMarksAlphabetically(arr);
            expect(arr.map(m => m.symbol)).toEqual(['A', 'B', 'C', 'E']);
        });
    });

    describe('getSortedAndFilteredMarks', () => {
        const settings: Settings = {
            ...defaultSettings,
            registerList: 'ABCDE',
            harpoonRegisterList: 'ABCDE',
            registerSortByList: true,
            harpoonRegisterSortByList: false,
            experimentalGoto: false
        };

        it('filters marks by available registers', () => {
            const ms = [
                { symbol: 'A', filePath: 'fileA.md' },
                { symbol: 'F', filePath: 'fileF.md' }
            ];
            const filtered = getSortedAndFilteredMarks(ms, false, settings);
            expect(filtered.length).toBe(1);
            expect(filtered[0].symbol).toBe('A');
        });

        it('sorts by register order if registerSortByList is true', () => {
            const ms = [
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'A', filePath: 'fileA.md' },
                { symbol: 'B', filePath: 'fileB.md' }
            ];
            const sorted = getSortedAndFilteredMarks(ms, false, settings);
            expect(sorted.map(m => m.symbol)).toEqual(['A', 'B', 'C']);
        });

        it('sorts alphabetically if registerSortByList is false', () => {
            const ms = [
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'A', filePath: 'fileA.md' },
                { symbol: 'B', filePath: 'fileB.md' }
            ];
            const customSettings = { ...settings, registerSortByList: false };
            const sorted = getSortedAndFilteredMarks(ms, false, customSettings);
            expect(sorted.map(m => m.symbol)).toEqual(['A', 'B', 'C']);
        });
    });

    describe('sortMarksBySettingsRegisterOrder', () => {
        it('sorts marks by custom register order', () => {
            const arr = [
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'A', filePath: 'fileA.md' },
                { symbol: 'B', filePath: 'fileB.md' }
            ];
            sortMarksBySettingsRegisterOrder(arr, 'BAC');
            expect(arr.map(m => m.symbol)).toEqual(['B', 'A', 'C']);
        });
    });

    describe('removeGapsForHarpoonMarks', () => {
        it('removes gaps and reorders marks according to harpoonRegisters', () => {
            const ms = [
                { symbol: 'A', filePath: 'fileA.md' },
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'E', filePath: 'fileE.md' }
            ];
            const harpoonRegisters = ['A', 'B', 'C', 'D', 'E'];
            const result = removeGapsForHarpoonMarks(ms, harpoonRegisters);
            // Should fill A, B, C with the first three marks, and remove D, E if not present
            expect(result.map(m => m.symbol)).toEqual(['A', 'B', 'C']);
            expect(result[0].filePath).toBe('fileA.md');
            expect(result[1].filePath).toBe('fileC.md');
            expect(result[2].filePath).toBe('fileE.md');
        });
    });

    describe('setNewOrOverwriteMark', () => {
        it('overwrites a mark and check overwritten contents', () => {
            const markToOverwrite = { symbol: 'A', filePath: '' };
            const filePath = 'fileAover.md';
            const { marks: result, overwrittenMark } = setNewOrOverwriteMark(marks, markToOverwrite, filePath);
            expect(result.find(el => el.filePath == filePath)).toEqual({ symbol: markToOverwrite.symbol, filePath: filePath });
            expect(overwrittenMark).toEqual({ symbol: markToOverwrite.symbol, filePath: 'fileA.md' })
        });

        it('sets new mark with no overwritten contents', () => {
            const ms = [
                { symbol: 'B', filePath: 'fileB.md' },
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'E', filePath: 'fileE.md' }
            ];
            const markToOverwrite = { symbol: 'A', filePath: '' };
            const filePath = 'fileAset.md';
            const { marks: result, overwrittenMark } = setNewOrOverwriteMark(ms, markToOverwrite, filePath);
            expect(result.find(el => el.filePath == filePath)).toEqual({ symbol: markToOverwrite.symbol, filePath: filePath });
            expect(overwrittenMark).toBeUndefined();
        });
    });

    describe('deleteMark', () => {
        it('deletes mark in a list', () => {
            const markToDelete = { symbol: 'A', filePath: '' };
            const { marks: result, deletedMark } = deleteMark(marks, markToDelete);
            expect(result.find(el => el.symbol == markToDelete.symbol)).toBeUndefined();
            expect(deletedMark).toEqual({ symbol: 'A', filePath: 'fileA.md' });
        });

        it('deletes mark not in a list', () => {
            const ms = [
                { symbol: 'B', filePath: 'fileB.md' },
                { symbol: 'C', filePath: 'fileC.md' },
                { symbol: 'E', filePath: 'fileE.md' }
            ];
            const markToDelete = { symbol: 'O', filePath: '' };
            const { marks: result, deletedMark } = deleteMark(ms, markToDelete);
            expect(result.find(el => el.symbol == markToDelete.symbol)).toBeUndefined();
            expect(deletedMark).toBeUndefined();
        });
    });

    describe('isMarkInList', () => {
        it('returns true if mark is in the list', () => {
            expect(isMarkInList(marks, { symbol: 'A', filePath: 'fileA.md' })).toBe(true);
        });
        it('returns false if mark is not in the list', () => {
            expect(isMarkInList(marks, { symbol: 'D', filePath: 'fileD.md' })).toBe(false);
        });
    });

    describe('isMarkInListBySymbol', () => {
        it('returns true if symbol is in the list', () => {
            expect(isMarkInListBySymbol(marks, 'B')).toBe(true);
        });
        it('returns false if symbol is not in the list', () => {
            expect(isMarkInListBySymbol(marks, 'Z')).toBe(false);
        });
    });

    describe('isMarkInListByFilePath', () => {
        it('returns true if filePath is in the list', () => {
            expect(isMarkInListByFilePath(marks, 'fileB.md')).toBe(true);
        });
        it('returns false if filePath is not in the list', () => {
            expect(isMarkInListByFilePath(marks, 'fileZ.md')).toBe(false);
        });
    });

    describe('gotoMarkNext', () => {
        it('returns the next mark in register order', () => {
            const currentMark = { symbol: 'A', filePath: 'fileA.md' };
            const next = gotoMarkNext(marks, registers, currentMark);
            expect(next?.symbol).toBe('B');
        });
        it('returns undefined if current mark is last', () => {
            const currentMark = { symbol: 'E', filePath: 'fileE.md' };
            const next = gotoMarkNext(marks, registers, currentMark);
            expect(next).toBeUndefined();
        });
        it('returns undefined if current mark is not found', () => {
            const currentMark = { symbol: 'Z', filePath: 'fileZ.md' };
            const next = gotoMarkNext(marks, registers, currentMark);
            expect(next).toBeUndefined();
        });
    });

    describe('gotoMarkPrevious', () => {
        it('returns the previous mark in register order', () => {
            const currentMark = { symbol: 'B', filePath: 'fileB.md' };
            const prev = gotoMarkPrevious(marks, registers, currentMark);
            expect(prev?.symbol).toBe('A');
        });
        it('returns undefined if current mark is first', () => {
            const currentMark = { symbol: 'A', filePath: 'fileA.md' };
            const prev = gotoMarkPrevious(marks, registers, currentMark);
            expect(prev).toBeUndefined();
        });
        it('returns undefined if current mark is not found', () => {
            const currentMark = { symbol: 'Z', filePath: 'fileZ.md' };
            const prev = gotoMarkPrevious(marks, registers, currentMark);
            expect(prev).toBeUndefined();
        });
    });
});
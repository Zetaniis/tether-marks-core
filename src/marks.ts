import { BasicMarksSettings } from './types/index';
import { Mark } from './types/index';


export function findFirstUnusedRegister<T extends Mark>(marks: T[], registers: string[]): string | null {
    for (const reg of registers) {
        // if register not used already, then use it
        // console.log('Checking register:', reg);
        if (!(marks.map(m => m.symbol).includes(reg))) {
            return reg;
        }
    }
    return null;
}

export function getMarkBySymbol<T extends Mark>(marks: T[], symbol: string): T | undefined {
    return marks.find(m => m.symbol === symbol);
}

export function sortMarksAlphabetically<T extends Mark>(marks: T[]) {
    marks.sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export function getSortedAndFilteredMarks<T extends Mark>(marks: T[], isHarpoonMode: boolean, settings: BasicMarksSettings): T[] {
    const availableRegisters = new Set((!isHarpoonMode ? settings.registerList : settings.harpoonRegisterList).split(''));
    const filteredMarks: T[] = marks.filter(el => availableRegisters.has(el.symbol));
    if (!isHarpoonMode && settings.registerSortByList) {
        // Sort marks by the order of the key symbols in the register list
        const registerList = settings.registerList;
        sortMarksBySettingsRegisterOrder(filteredMarks, registerList);
    }
    else if (isHarpoonMode && settings.harpoonRegisterSortByList) {
        // Sort marks by the order of the key symbols in the harpoon register list
        const registerList = settings.harpoonRegisterList;
        sortMarksBySettingsRegisterOrder(filteredMarks, registerList);
    }
    else {
        sortMarksAlphabetically(filteredMarks);
    }
    return filteredMarks;
}

export function sortMarksBySettingsRegisterOrder<T extends Mark>(marks: T[], registers: string | string[]) {
    const registerOrder = new Map([...registers].map((symbol, index) => [symbol, index]));
    marks.sort((a, b) => (registerOrder.get(a.symbol) ?? Infinity) - (registerOrder.get(b.symbol) ?? Infinity));
}

export function removeGapsForHarpoonMarks<T extends Mark>(marksToCopy: T[], harpoonRegisters: string[]): T[] {
    let marks = [...marksToCopy];

    let leftCur = 0;
    let rightCur = 0;

    while (rightCur < harpoonRegisters.length) {
        const markEl = marks.find(el => el.symbol === harpoonRegisters[rightCur]);

        if (markEl !== undefined) {
            const symbolToSetTo = harpoonRegisters[leftCur];
            let filteredMarks = marks.filter(el => el.symbol !== harpoonRegisters[leftCur]);
            filteredMarks.push(Object.assign({}, markEl, { symbol: symbolToSetTo, filePath: markEl.filePath }));
            marks = filteredMarks;
            leftCur += 1;
        }
        rightCur += 1;
    }

    while (leftCur < harpoonRegisters.length) {
        marks = marks.filter(el => el.symbol !== harpoonRegisters[leftCur]);
        leftCur += 1;
    }

    return marks;
}

export function restoreLastChangedMark<T extends Mark>(marks: T[], lastChangedMark : T) : {marks: T[], markToDiscard: T | undefined} {
    const markToRestore = { ...lastChangedMark };
    const markToDiscard = marks.find(m => m.symbol === markToRestore.symbol);
    const marksWithoutDiscarded = marks.filter(m => m.symbol !== markToRestore.symbol);

    marksWithoutDiscarded.push(Object.assign({}, markToRestore, { symbol: markToRestore.symbol, filePath: markToRestore.filePath }));
    return {marks: marksWithoutDiscarded, markToDiscard: markToDiscard}
}


export function setNewOrOverwriteMark<T extends Mark>(marks: T[], setMark : T, filePath : string) : {marks: T[], overwrittenMark?: T} {
    const {marks: filteredMarks, deletedMark: overwrittenMark} =  deleteMark(marks, setMark);
    filteredMarks.push(Object.assign({}, setMark, { symbol: setMark.symbol, filePath: filePath }));
    return {marks: filteredMarks, overwrittenMark};
}

export function deleteMark<T extends Mark>(marks: T[], markToDelete: T) : {marks: T[], deletedMark?: T} {
    const cMark = { ...markToDelete };
    const deletedMark = marks.find(m => m.symbol === cMark.symbol);
    const filteredMarks = marks.filter(m => m.symbol !== cMark.symbol);
    return {marks: filteredMarks, deletedMark};
}

export function isMarkInList<T extends Mark>(marks: T[], mark: T): boolean {
    return marks.some(m => m.symbol === mark.symbol && m.filePath === mark.filePath);
}

export function isMarkInListBySymbol<T extends Mark>(marks: T[], symbol: string): boolean {
    return marks.some(m => m.symbol === symbol);
}

export function isMarkInListByFilePath<T extends Mark>(marks: T[], filePath: string): boolean {
    return marks.some(m => m.filePath === filePath);
}   

export function gotoMarkNext<T extends Mark>(marks: T[], registers: string[]|string, currentMark : T): T | undefined {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex === -1 || currentIndex === marks.length - 1) {
        return undefined; // No next mark
    }
    return sortedMarks[currentIndex + 1];
}

export function gotoMarkPrevious<T extends Mark>(marks: T[], registers: string[]|string, currentMark: T): T | undefined {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex <= 0) {
        return undefined; // No previous mark
    }
    return marks[currentIndex - 1];
}
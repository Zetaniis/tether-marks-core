import { BasicMarksSettings } from './types/index';
import { Mark } from './types/index';


export function findFirstUnusedRegister(marks: Mark[], registers: string[]): string | null {
    for (const reg of registers) {
        // if register not used already, then use it
        // console.log('Checking register:', reg);
        if (!(marks.map(m => m.symbol).includes(reg))) {
            return reg;
        }
    }
    return null;
}

export function getMarkBySymbol(marks: Mark[], symbol: string): Mark | undefined {
    return marks.find(m => m.symbol === symbol);
}

export function sortMarksAlphabetically(marks: Mark[]) {
    marks.sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export function getSortedAndFilteredMarks(marks: Mark[], isHarpoonMode: boolean, settings: BasicMarksSettings): Mark[] {
    const availableRegisters = new Set((!isHarpoonMode ? settings.registerList : settings.harpoonRegisterList).split(''));
    const filteredMarks: Mark[] = marks.filter(el => availableRegisters.has(el.symbol));
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

export function sortMarksBySettingsRegisterOrder(marks: Mark[], registers: string | string[]) {
    const registerOrder = new Map([...registers].map((symbol, index) => [symbol, index]));
    marks.sort((a, b) => (registerOrder.get(a.symbol) ?? Infinity) - (registerOrder.get(b.symbol) ?? Infinity));
}

export function removeGapsForHarpoonMarks(marksToCopy: Mark[], harpoonRegisters: string[]): Mark[] {
    let marks = [...marksToCopy];

    let leftCur = 0;
    let rightCur = 0;

    while (rightCur < harpoonRegisters.length) {
        const markEl = marks.find(el => el.symbol === harpoonRegisters[rightCur]);

        if (markEl !== undefined) {
            const symbolToSetTo = harpoonRegisters[leftCur];
            let filteredMarks = marks.filter(el => el.symbol !== harpoonRegisters[leftCur]);
            filteredMarks.push({ symbol: symbolToSetTo, filePath: markEl.filePath })
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

export function restoreLastChangedMark(marks: Mark[], lastChangedMark : Mark) : {marks: Mark[], markToDiscard: Mark | undefined} {
    const markToRestore = { ...lastChangedMark };
    const markToDiscard = marks.find(m => m.symbol === markToRestore.symbol);
    const marksWithoutDiscarded = marks.filter(m => m.symbol !== markToRestore.symbol);

    marksWithoutDiscarded.push({ symbol: markToRestore.symbol, filePath: markToRestore.filePath });
    return {marks: marksWithoutDiscarded, markToDiscard: markToDiscard}
}


export function setNewOrOverwriteMark(marks: Mark[], setMark : Mark, filePath : string) : {marks: Mark[], overwrittenMark?: Mark} {
    const {marks: filteredMarks, deletedMark: overwrittenMark} =  deleteMark(marks, setMark);
    filteredMarks.push({ symbol: setMark.symbol, filePath: filePath });
    return {marks: filteredMarks, overwrittenMark};
}

export function deleteMark(marks: Mark[], markToDelete: Mark) : {marks: Mark[], deletedMark?: Mark} {
    const cMark = { ...markToDelete };
    const deletedMark = marks.find(m => m.symbol === cMark.symbol);
    const filteredMarks = marks.filter(m => m.symbol !== cMark.symbol);
    return {marks: filteredMarks, deletedMark};
}

export function isMarkInList(marks: Mark[], mark: Mark): boolean {
    return marks.some(m => m.symbol === mark.symbol && m.filePath === mark.filePath);
}

export function isMarkInListBySymbol(marks: Mark[], symbol: string): boolean {
    return marks.some(m => m.symbol === symbol);
}

export function isMarkInListByFilePath(marks: Mark[], filePath: string): boolean {
    return marks.some(m => m.filePath === filePath);
}   

export function gotoMarkNext(marks: Mark[], registers: string[]|string, currentMark : Mark): Mark | undefined {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex === -1 || currentIndex === marks.length - 1) {
        return undefined; // No next mark
    }
    return sortedMarks[currentIndex + 1];
}

export function gotoMarkPrevious(marks: Mark[], registers: string[]|string, currentMark: Mark): Mark | undefined {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex <= 0) {
        return undefined; // No previous mark
    }
    return marks[currentIndex - 1];
}
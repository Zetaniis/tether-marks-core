export function findFirstUnusedRegister(marks, registers) {
    for (const reg of registers) {
        // if register not used already, then use it
        // console.log('Checking register:', reg);
        if (!(marks.map(m => m.symbol).includes(reg))) {
            return reg;
        }
    }
    return null;
}
export function getMarkBySymbol(marks, symbol) {
    return marks.find(m => m.symbol === symbol);
}
export function sortMarksAlphabetically(marks) {
    marks.sort((a, b) => a.symbol.localeCompare(b.symbol));
}
export function getSortedAndFilteredMarks(marks, isHarpoonMode, settings) {
    const availableRegisters = new Set((!isHarpoonMode ? settings.registerList : settings.harpoonRegisterList).split(''));
    const filteredMarks = marks.filter(el => availableRegisters.has(el.symbol));
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
export function sortMarksBySettingsRegisterOrder(marks, registers) {
    const registerOrder = new Map([...registers].map((symbol, index) => [symbol, index]));
    marks.sort((a, b) => { var _a, _b; return ((_a = registerOrder.get(a.symbol)) !== null && _a !== void 0 ? _a : Infinity) - ((_b = registerOrder.get(b.symbol)) !== null && _b !== void 0 ? _b : Infinity); });
}
export function removeGapsForHarpoonMarks(marksToCopy, harpoonRegisters) {
    let marks = [...marksToCopy];
    let leftCur = 0;
    let rightCur = 0;
    while (rightCur < harpoonRegisters.length) {
        const markEl = marks.find(el => el.symbol === harpoonRegisters[rightCur]);
        if (markEl !== undefined) {
            const symbolToSetTo = harpoonRegisters[leftCur];
            let filteredMarks = marks.filter(el => el.symbol !== harpoonRegisters[leftCur]);
            filteredMarks.push({ symbol: symbolToSetTo, filePath: markEl.filePath });
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
export function restoreLastChangedMark(marks, lastChangedMark) {
    const markToRestore = { ...lastChangedMark };
    const markToDiscard = marks.find(m => m.symbol === markToRestore.symbol);
    const marksWithoutDiscarded = marks.filter(m => m.symbol !== markToRestore.symbol);
    marksWithoutDiscarded.push({ symbol: markToRestore.symbol, filePath: markToRestore.filePath });
    return { marks: marksWithoutDiscarded, markToDiscard: markToDiscard };
}
export function setNewOrOverwriteMark(marks, setMark, filePath) {
    const { marks: filteredMarks, deletedMark: overwrittenMark } = deleteMark(marks, setMark);
    filteredMarks.push({ symbol: setMark.symbol, filePath: filePath });
    return { marks: filteredMarks, overwrittenMark };
}
export function deleteMark(marks, markToDelete) {
    const cMark = { ...markToDelete };
    const deletedMark = marks.find(m => m.symbol === cMark.symbol);
    const filteredMarks = marks.filter(m => m.symbol !== cMark.symbol);
    return { marks: filteredMarks, deletedMark };
}
export function isMarkInList(marks, mark) {
    return marks.some(m => m.symbol === mark.symbol && m.filePath === mark.filePath);
}
export function isMarkInListBySymbol(marks, symbol) {
    return marks.some(m => m.symbol === symbol);
}
export function isMarkInListByFilePath(marks, filePath) {
    return marks.some(m => m.filePath === filePath);
}
export function gotoMarkNext(marks, registers, currentMark) {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex === -1 || currentIndex === marks.length - 1) {
        return undefined; // No next mark
    }
    return sortedMarks[currentIndex + 1];
}
export function gotoMarkPrevious(marks, registers, currentMark) {
    const sortedMarks = [...marks];
    sortMarksBySettingsRegisterOrder(sortedMarks, registers);
    const currentIndex = sortedMarks.findIndex(m => m.symbol === currentMark.symbol && m.filePath === currentMark.filePath);
    if (currentIndex <= 0) {
        return undefined; // No previous mark
    }
    return marks[currentIndex - 1];
}

import { setCard, checkEmptyColumns, tasks, updateTasks, showData } from "./boards.js";
export let searchList = [];
export let collectedList = [];
let old = "";

function checkValue(array, key, value, i, j) {
    if (array[i][key] === value || array[j][key] === value) return true;
    else if (array[i] === value || array[j] === value) return true;
    return false;
}

export function search(array, key, value) {
    let i = 0, j = array.length - 1;
    do {
        if (checkValue(array, key, value, i, j)) return true;
        ++i;
        --j;
    } while (i < j);
    return false;
}


function isNoIndicies(indicies, index) {
    for (let i = 0; i < indicies.length; i++) {
        if (indicies[i] === index) return false;
    }
    return true;
}


function collectResults(list, tasks) {
    collectedList = mergeArraysWithoutDuplicates(tasks, list);
    //tasks.forEach((element, index) => { if (isNoIndicies(indicies, index)) collectedList.push(element) });
    showSearchData();
}


function filterBySubstring(data, key, searchString) {
    if (key !== "Persons") return data.filter(item =>
        item[key].toLowerCase().includes(searchString.toLowerCase())
    );
}

function filterByNestedKeyAndArray(data, searchString) {
    return data.filter(item => {
        // Suche in "details.description"
        const title = item.Title.toLowerCase().includes(searchString.toLowerCase());

        const date = item.Date.toLowerCase().includes(searchString.toLowerCase());

        // Suche im "team"-Array
        const persons = item.Persons.some(member =>
            member.toLowerCase().includes(searchString.toLowerCase())
        );

        // Gib das Element zurück, wenn entweder die Beschreibung oder ein Team-Mitglied übereinstimmt
        return title || persons || date;
    });
}


function mergeArraysWithoutDuplicates(oldArray, newArray) {
    // Kombiniere das neue Array zuerst, dann das alte Array
    const combinedArray = newArray.concat(oldArray);
  
    // Erstelle ein neues Array mit eindeutigen Objekten, basierend auf der 'id'
    const uniqueArray = combinedArray.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
  
    return uniqueArray;
  }


function iterateTasks(input) {
    collectedList = [];
    const searchString = input.value;  // Wir suchen nach "dev" im Team oder in der Beschreibung
    const result = filterByNestedKeyAndArray(tasks, searchString);
    collectResults(result, tasks);
}


function searchEntry() {
    let input = document.getElementById('boards-search');
    if (input.value === "") return;
    iterateTasks(input);
}


function showSearchData() {
    updateTasks(collectedList);
    showData();
}


window.searchEntry = searchEntry;
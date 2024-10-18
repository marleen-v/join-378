import { setCard, checkEmptyColumns, tasks, updateTasks, showData } from "./boards.js";
export let searchList = [];
export let collectedList = [];

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


function collectResults(list, indicies) {
    collectedList = list;
    tasks.forEach((element, index) => { if (isNoIndicies(indicies, index)) collectedList.push(element) });
    showSearchData();
}


function filterBySubstring(data, key, searchString) {
    if(key !== "Persons") return data.filter(item => 
        item[key].toLowerCase().includes(searchString.toLowerCase())
    );
}


function iterateTasks(input) {
    collectedList = [];
    let lookAtTitles = filterBySubstring(tasks, "Title", input.value);
    let lookAtDates = filterBySubstring(tasks, "Date", input.value);
    let lookAtPersons = filterBySubstring(tasks, "Persons", input.value);
    let list = [], indicies = [];
    if(lookAtTitles.length > 0) {
        list.push(lookAtTitles[0]);
        let index = tasks.findIndex(item => item.Title === lookAtTitles[0].Title);
        indicies.push(index);
        
    }

    if(lookAtDates.length > 0) {
        list.push(lookAtDates[0]);
        let index = tasks.findIndex(item => item.Date === lookAtDates[0].Date);
        indicies.push(index);
    }    

    collectResults(list, indicies);    
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
import { setCard, checkEmptyColumns, tasks } from "./boards.js";
export let searchList = [];
export let collectedList = [];

function checkValue(array, key, value, i, j) {
    if(array[i][key] === value || array[j][key] === value) return true;
    else if(array[i] === value || array[j] === value) return true;
    return false;
}

export function search(array, key, value) {
    let i = 0, j = array.length - 1;
    do {                
        if(checkValue(array, key, value, i, j)) return true;
        ++i;
        --j;
    } while(i < j);
    return false;
}


function getPositionOfEntry(array, key, value) {
    let i = 0, j = array.length - 1;
    do {        
        if(checkValue(array, key, value, i, j)) return i;
        else if(checkValue(array, key, value, i, j)) return j;
        ++i;
        --j;
    } while(i < j);
    return -1;
}


function getKey(input) {
    let resultInTitle = search(tasks, "Title", input.value);
    let resultInDate = search(tasks, "Date", input.value);
    let resultInAssignedTo = "No Entry";
    tasks.forEach(element => {  resultInAssignedTo = search(element.Persons, "", input.value); }); 
    for (let index = 0; index < tasks.length; index++) {
        if(search(tasks[index].Persons, "", input.value)) resultInAssignedTo = "Persons";
    }
    if(resultInTitle) return "Title";
    else if(resultInDate) return "Date";
    else if(resultInAssignedTo) return resultInAssignedTo;
    return "No Entry";
}


function isNoIndicies(indicies, index) {
    for (let i = 0; i < indicies.length; i++) {
        if(indicies[i] === index) return false;
    }
    return true;
}


function collectResults(list , indicies) {
    collectedList = list;
    tasks.forEach((element, index) => { if(isNoIndicies(indicies, index)) collectedList.push(element) });
    showSearchData();
}


function iterateTasks(list, indicies, input) {
    tasks.forEach((element, index) => {
        let key = getKey(input);
        if(key !== "No Entry" && key !== "Persons") {
            if(element[key] === input.value) {
                list.push(tasks[index]);
                indicies.push(index);
            }
        }
        else if(search(element.Persons, "", input.value)) {
                list.push(tasks[index]);
                indicies.push(index);
        }
    });
    collectResults(list, indicies);
}


function searchEntry() {
    let list = [], indicies = [];
    let input = document.getElementById('boards-search');
    if(input.value === "") return;
    iterateTasks(list, indicies, input);
}


function showSearchData() {
    document.querySelector(`.board-main-to-do`).innerHTML = "";
    document.querySelector(`.board-main-in-progress`).innerHTML = "";
    document.querySelector(`.board-main-await-feedback`).innerHTML = "";
    document.querySelector(`.board-main-done`).innerHTML = "";
    let index = 0;
    collectedList.forEach((element, id) => { 
        if (element.Column === "To Do") setCard(element, index, id, "to-do");
        if (element.Column === "In Progress") setCard(element, index, id, "in-progress");
        if (element.Column === "Await Feedback") setCard(element, index, id, "await-feedback");
        if (element.Column === "Done") setCard(element, index, id, "done");
        index++;
    });
    checkEmptyColumns();

}


window.searchEntry = searchEntry;
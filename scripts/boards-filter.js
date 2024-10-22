import { setCard, checkEmptyColumns, tasks, updateTasks, showData } from "./boards.js";
export let searchList = [];
export let sortedList = [];


function checkValue(array, key, value, i, j) {
    if (array[i][key] === value || array[j][key] === value) return true;
    else if (array[i] === value || array[j] === value) return true;
    return false;
}

export function search(array, key, value) {
    if(array.length == 0 || array == null) return false;
    let i = 0, j = array.length - 1;
    do {
        if (checkValue(array, key, value, i, j)) return true;
        ++i;
        --j;
    } while (i < j);
    return false;
}


function validateDate(d) {
    // Prüfe, ob das Datum gültig ist
    if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');  // Monate sind 0-basiert
        const day = String(d.getDate()).padStart(2, '0');  // Tag formatieren
        return `${year}-${month}-${day}`;
      }

    // Wenn kein gültiges Datum gefunden wurde
    return "Invalid date";
}

function formatDate(input) {
    // Prüfe, ob der Input im Format dd.mm.yyyy vorliegt (z.B. 15.10.2024)
    const datePattern1 = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    
    if (datePattern1.test(input)) {
      const [ , day, month, year] = input.match(datePattern1);
      return `${year}-${month}-${day}`;  // yyyy-mm-dd Format
    }
  
    // Versuch, den Input als reguläres Datum zu parsen
    const d = new Date(input);
    return validateDate(d);
  }


function filterByNestedKeyAndArray(data, searchString) {
    return data.filter(item => {
        // Suche in "details.description"
        const title = item.Title.toLowerCase().includes(searchString.toLowerCase());
        const date = item.Date.toLowerCase().includes(formatDate(formatDate(searchString)).toLowerCase());
        const priority = item.Priority.toLowerCase().includes(searchString.toLowerCase());
        const description = item.Description.toLowerCase().includes(searchString.toLowerCase());
        const subtasks = (item.Subtasks != null) ? item.Subtasks.some(member => member.Description.toLowerCase().includes(searchString.toLowerCase())) : null;        
        // Suche im "team"-Array
        const persons = item.Persons.some(member => member.toLowerCase().includes(searchString.toLowerCase()));
        // Gib das Element zurück, wenn entweder die Beschreibung oder ein Team-Mitglied übereinstimmt
        return title || persons || date || priority || description || subtasks;
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


function highlightResults(result) {    
    if(result.length > 0 && result.length != tasks.length)  {
        tasks.forEach(element => { document.getElementById('taskId' + element.id).style.backgroundColor = '#E7E7E7'; });
        result.forEach(element => { document.getElementById('taskId' + element.id).style.backgroundColor = 'white'; });
        return;
    }    
    tasks.forEach(element => { document.getElementById('taskId' + element.id).style.backgroundColor = 'white'; });
}


function orderTasks(input) {
    const searchString = input.value;  // Wir suchen nach "dev" im Team oder in der Beschreibung
    const result = filterByNestedKeyAndArray(tasks, searchString);
    sortedList = mergeArraysWithoutDuplicates(tasks, result);
    showData(sortedList);
    highlightResults(result);
}


function searchEntry() {
    let input = document.getElementById('boards-search');
    if (input.value === "") return;
    orderTasks(input);
}


window.searchEntry = searchEntry;
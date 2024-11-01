/*
    Author: Martin Reifschneider
*/


import './boards.js';
import './add-task.js';
import { parseTaskIdToNumberId } from './boards-edit.js';
import { refresh } from './boards.js';
export const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
export const USERS_DIR = '/users';
export const CONTACTS_DIR = '/contacts';
export const TASKS_DIR = '/tasks';
let currentTask = null;
let originalColumn = null;
let currentColumn = null;
const taskContainer = document.getElementById("board-main");
const dropzones = document.querySelectorAll(".column");
const movableDiv = document.getElementById("dragelement");
let currentTaskId = null;
let offsetX, offsetY;


/**
 * Function for load data from firebase
 *
 * @export
 * @async
 * @param {string} [path=""]
 * @returns {unknown}
 */
export async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}

/**
 * load activ user from firebase
 *
 * @export
 * @async
 * @param {string} [path=""]
 * @returns {unknown}
 */
export async function loadActiveUser(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    return await res.json();;
}


/**
* Puts user data to firebase
* @param {string} path directory in firebase
* @param {object} data object the needs to be stored
*/
export async function putData(path = "", data = {}) {
    let res = await fetch(FIREBASE_URL + path + ".json",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
}


/**
 * Iterate through contacts and find reference to searched contact
 *
 * @export
 * @param {*} contacts
 * @param {*} searchString
 * @returns {*}
 */
export function getPerson(contacts, searchString) {
    for (let index = 0; index < contacts.length; index++) {
        if (contacts[index].email === searchString) return contacts[index];
    }
    return "";
}


/**
 * Template for movable object there copied all tasks information to it for simulating
 * task card drag and drop
 *
 * @param {*} id
 * @param {*} index
 * @returns {string}
 */
function getTaskBody(id, index) {
    return /*html*/`
        <section onclick="openOverlay(0)" id="${id}" class="task-card add-task-card${index} clickable prevent-select" ondragstart="startDragging('${id}')"></section>  
    `;
}

/**
 * Compare column id's from board.html and get column name back
 * for task array literal
 *
 * @param {*} key
 * @returns {string}
 */
function getColumn(key) {
    let column = "";
    switch (key) {
        case 'to-do': column = "To Do"; break;
        case 'in-progress': column = "In Progress"; break;
        case 'await-feedback': column = "Await Feedback"; break;
        case 'done': column = "Done"; break;
    }
    return column;
}



// event mouse

/**
 * Preparing movable object with all informations of catched div from mouse or touch event
 *
 * @param {*} taskElement
 */
function prepareMovableObject(taskElement) {
    currentTask = taskElement;
    currentTaskId = taskElement.getAttribute("id");
    originalColumn = taskElement.closest(".column");
    originalColumn.style.backgroundColor = "lightgrey";
    currentTaskId = taskElement.getAttribute("id");
    let index = parseTaskIdToNumberId(currentTaskId);
    movableDiv.innerHTML = getTaskBody(currentTaskId, index);
    movableDiv.querySelector('section').innerHTML = document.getElementById(currentTaskId).innerHTML;
    movableDiv.querySelector('section').style.transition = "0.1s ease";
    movableDiv.querySelector('section').style.transform = "rotate(5deg)";
    movableDiv.style.display = "block";
}

/** Reset movable object */
function resetMovableObject() {
    movableDiv.querySelector('section').style.transition = "0.1s ease";
        movableDiv.querySelector('section').style.transform = "rotate(0deg)";
        movableDiv.style.display = "none";
        currentTaskId = null;
}

/** reset touched columd background color */
function resetColumn() {
    if (originalColumn) {
        originalColumn.style.backgroundColor = "";
    }
    if (currentColumn) {
        currentColumn.style.backgroundColor = "";
    }

    // Reset
    originalColumn = null;
    currentColumn = null;
}


/**
 * Save all changed informations to task array and on firebase and refresh board data
 *
 * @param {*} currentTaskId
 * @param {*} columnId
 */
function saveMovedTask(currentTaskId, columnId) {
    let id = parseTaskIdToNumberId(currentTaskId);
    tasksFromFirebase[id].Column = getColumn(columnId);
    putData(TASKS_DIR, tasksFromFirebase);
    refresh();
}


/**
 * Change touched column color to lightgreen
 *
 * @param {*} newColumn
 */
function colorTouchedColumn(newColumn) {
    if (newColumn !== currentColumn) {
        if (currentColumn && currentColumn !== originalColumn) {
            currentColumn.style.backgroundColor = "";
        }
        if (newColumn && newColumn !== originalColumn) {
            newColumn.style.backgroundColor = "lightgreen";
        }
        currentColumn = newColumn;
    }
}

// mousedown listener wich get all on clicked task informations like positon or children of div
taskContainer.addEventListener("mousedown", function (event) {
    const taskElement = event.target.closest(".task-card");
    if (taskElement) {
        prepareMovableObject(taskElement);

        const rect = currentTask.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Initialposition setzen
        movableDiv.style.left = event.pageX - offsetX + "px";
        movableDiv.style.top = event.pageY - offsetY + "px";
    }
});


/**
 * Check if mouse bounding column rectangle
 *
 * @param {*} event
 * @param {*} column
 * @returns {boolean}
 */
function checkMousemoveBounding(event, column) {
    const rect = column.getBoundingClientRect();
    if (event.clientX > rect.left && 
        event.clientX < rect.right &&
        event.clientY > rect.top && 
        event.clientY < rect.bottom) {
        return true;
    }
    return false;
}


/**
 * Check if endposition on mouseup or touchend bounding column rectangle
 * to example if you move from column called "To Do" to "Done" 
 *
 * @param {*} dropzone
 * @returns {boolean}
 */
function checkDropzoneBounding(dropzone) {
    const movableRect = movableDiv.getBoundingClientRect();
    const dropzoneRect = dropzone.getBoundingClientRect();
    if (
        movableRect.left < dropzoneRect.right &&
        movableRect.right > dropzoneRect.left &&
        movableRect.top < dropzoneRect.bottom &&
        movableRect.bottom > dropzoneRect.top
    ) return true;
    return false;
}

// mousemove event listener for movement of selected div
document.addEventListener("mousemove", function (event) {
    if (currentTaskId) {
        movableDiv.style.left = event.pageX - offsetX + "px";
        movableDiv.style.top = event.pageY - offsetY + "px";
        if (currentTask) {
            movableDiv.style.left = `${event.pageX - offsetX}px`;
            movableDiv.style.top = `${event.pageY - offsetY}px`;
            let newColumn = null;
            dropzones.forEach(column => { if(checkMousemoveBounding(event, column)) newColumn = column; });
            colorTouchedColumn(newColumn);
        }
    }
});

// mouseup listener to check where you dragged element and store new order
document.addEventListener("mouseup", function () {
    if (currentTaskId) {
        let droppedInZone = false;
        dropzones.forEach(dropzone => {
            const columnId = dropzone.getAttribute("id");
            if(checkDropzoneBounding(dropzone)) {
                droppedInZone = true;
                saveMovedTask(currentTaskId, columnId);
            }
        });
        resetMovableObject();
        resetColumn();
    }
});



// touch

// touchstart listener same as mousedown listener
taskContainer.addEventListener("touchstart", function (event) {
    event.preventDefault(); 
    const taskElement = event.target.closest(".task-card");
    if (taskElement) {
        prepareMovableObject(taskElement);
        const rect = currentTask.getBoundingClientRect();
        offsetX = event.touches[0].clientX - rect.left; 
        offsetY = event.touches[0].clientY - rect.top;
        movableDiv.style.left = (event.touches[0].pageX - offsetX) + "px";
        movableDiv.style.top = (event.touches[0].pageY - offsetY) + "px";
    }
}, { passive: false });


/**
 * Check if touch move bounding a column rectangle
 *
 * @param {*} event
 * @param {*} column
 * @returns {boolean}
 */
function checkTouchmoveBounding(event, column) {
    const rect = column.getBoundingClientRect();
    if (event.touches[0].clientX > rect.left &&
        event.touches[0].clientX < rect.right &&
        event.touches[0].clientY > rect.top &&
        event.touches[0].clientY < rect.bottom
    ) {
        return true;
    }
    return false;
}

// touchmove listener same as mousemove listener 
document.addEventListener("touchmove", function (event) {
    if (currentTask) {
        movableDiv.style.left = `${event.touches[0].pageX - offsetX}px`;
        movableDiv.style.top = `${event.touches[0].pageY - offsetY}px`;
        let newColumn = null;
        dropzones.forEach(column => {
            if (checkTouchmoveBounding(event, column)) newColumn = column;
        });
        colorTouchedColumn(newColumn);
        event.preventDefault(); 
    }
}, { passive: false });




// touchend listener same as mouseup listener
document.addEventListener("touchend", function () {
    if (currentTaskId) {
        let droppedInZone = false;
        dropzones.forEach(dropzone => {
            const dropzoneRect = dropzone.getBoundingClientRect();
            const columnId = dropzone.getAttribute("id");
            if(checkDropzoneBounding(dropzone)) {
                droppedInZone = true;
                saveMovedTask(currentTaskId, columnId);
            }
        });
        resetMovableObject();
        resetColumn();
    }
});

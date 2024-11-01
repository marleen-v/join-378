/*
    Author: Martin Reifschneider
*/


import './boards.js';
import './add-task.js';
import { parseTaskIdToNumberId } from './boards-edit.js';
import { getCurrentDraggedElement, refresh } from './boards.js';
export const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
export const USERS_DIR = '/users';
export const CONTACTS_DIR = '/contacts';
export const TASKS_DIR = '/tasks';
let container = document.getElementById("board-main");

let isDragging = false;
let currentTask = null;
let originalColumn = null;
let currentColumn = null;

let id = "", i;


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


function getTaskBody(id, index) {
    return /*html*/`
        <section onclick="openOverlay(0)" id="${id}" class="task-card add-task-card${index} clickable prevent-select" ondragstart="startDragging('${id}')"></section>  
    `;
}

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


const taskContainer = document.getElementById("board-main");
const dropzones = document.querySelectorAll(".column");
const movableDiv = document.getElementById("dragelement");

let currentTaskId = null;
let offsetX, offsetY;


// `mousedown`-Listener auf `taskContainer`, um Task-Element zu kopieren

taskContainer.addEventListener("mousedown", function (event) {
    const taskElement = event.target.closest(".task-card");
    if (taskElement) {
        currentTask = taskElement;
        currentTaskId = taskElement.getAttribute("id");
        originalColumn = taskElement.closest(".column");
        originalColumn.style.backgroundColor = "lightgrey";

        let index = parseTaskIdToNumberId(currentTaskId);
        movableDiv.innerHTML = getTaskBody(currentTaskId, index);

        movableDiv.querySelector('section').innerHTML = document.getElementById(currentTaskId).innerHTML;
        movableDiv.querySelector('section').style.transition = "0.1s ease";
        movableDiv.querySelector('section').style.transform = "rotate(5deg)";
        movableDiv.style.display = "block";

        const rect = currentTask.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Initialposition setzen
        movableDiv.style.left = event.pageX - offsetX + "px";
        movableDiv.style.top = event.pageY - offsetY + "px";
    }
});


// `mousemove`-Event, um das bewegliche Element der Maus folgen zu lassen
document.addEventListener("mousemove", function (event) {
    if (currentTaskId) {
        movableDiv.style.left = event.pageX - offsetX + "px";
        movableDiv.style.top = event.pageY - offsetY + "px";

        if (currentTask) {
            movableDiv.style.left = `${event.pageX - offsetX}px`;
            movableDiv.style.top = `${event.pageY - offsetY}px`;

            // Überprüfen, ob wir uns über einer neuen Spalte befinden
            let newColumn = null;
            dropzones.forEach(column => {
                const rect = column.getBoundingClientRect();
                if (
                    event.clientX > rect.left &&
                    event.clientX < rect.right &&
                    event.clientY > rect.top &&
                    event.clientY < rect.bottom
                ) {
                    newColumn = column;
                }
            });
            if (newColumn !== currentColumn) {
                if (currentColumn && currentColumn !== originalColumn) {
                    currentColumn.style.backgroundColor = ""; // Setze alte Spalte auf Standardfarbe
                }
                if (newColumn && newColumn !== originalColumn) {
                    newColumn.style.backgroundColor = "lightgreen"; // Setze neue Spalte auf grün
                }
                currentColumn = newColumn;
            }
        }

    }
});

// `mouseup`-Event, um die Einsortierung zu überprüfen
document.addEventListener("mouseup", function () {
    if (currentTaskId) {
        let droppedInZone = false;

        // Bounding-Box des bewegbaren Elements
        const movableRect = movableDiv.getBoundingClientRect();

        dropzones.forEach(dropzone => {
            const dropzoneRect = dropzone.getBoundingClientRect();
            const columnId = dropzone.getAttribute("id");

            // Kollisionsprüfung
            if (
                movableRect.left < dropzoneRect.right &&
                movableRect.right > dropzoneRect.left &&
                movableRect.top < dropzoneRect.bottom &&
                movableRect.bottom > dropzoneRect.top
            ) {
                droppedInZone = true;
                let id = parseTaskIdToNumberId(currentTaskId);
                tasksFromFirebase[id].Column = getColumn(columnId);
                putData(TASKS_DIR, tasksFromFirebase);
                refresh();
            }
        });

        // Bewegbares Element zurücksetzen und ausblenden
        movableDiv.querySelector('section').style.transition = "0.1s ease";
        movableDiv.querySelector('section').style.transform = "rotate(0deg)";
        movableDiv.style.display = "none";
        currentTaskId = null;

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
});



// touch

// Touchstart-Listener mit nicht passiv
taskContainer.addEventListener("touchstart", function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten

    const taskElement = event.target.closest(".task-card");
    if (taskElement) {
        currentTask = taskElement;
        currentTaskId = taskElement.getAttribute("id");
        originalColumn = taskElement.closest(".column");
        originalColumn.style.backgroundColor = "lightgrey";

        let index = parseTaskIdToNumberId(currentTaskId);
        movableDiv.innerHTML = getTaskBody(currentTaskId, index);
        movableDiv.querySelector('section').innerHTML = document.getElementById(currentTaskId).innerHTML;
        movableDiv.querySelector('section').style.transition = "0.1s ease";
        movableDiv.querySelector('section').style.transform = "rotate(5deg)";
        movableDiv.style.display = "block";

        const rect = currentTask.getBoundingClientRect();
        offsetX = event.touches[0].clientX - rect.left; // Nutzung der Touch-Position
        offsetY = event.touches[0].clientY - rect.top;

        movableDiv.style.left = (event.touches[0].pageX - offsetX) + "px";
        movableDiv.style.top = (event.touches[0].pageY - offsetY) + "px";
    }
}, { passive: false }); // Hier passive: false setzen

// Touchmove-Listener mit nicht passiv
document.addEventListener("touchmove", function (event) {
    if (currentTask) {
        movableDiv.style.left = `${event.touches[0].pageX - offsetX}px`;
        movableDiv.style.top = `${event.touches[0].pageY - offsetY}px`;

        let newColumn = null;
        dropzones.forEach(column => {
            const rect = column.getBoundingClientRect();
            if (
                event.touches[0].clientX > rect.left &&
                event.touches[0].clientX < rect.right &&
                event.touches[0].clientY > rect.top &&
                event.touches[0].clientY < rect.bottom
            ) {
                newColumn = column;
            }
        });

        if (newColumn !== currentColumn) {
            if (currentColumn && currentColumn !== originalColumn) {
                currentColumn.style.backgroundColor = "";
            }
            if (newColumn && newColumn !== originalColumn) {
                newColumn.style.backgroundColor = "lightgreen";
            }
            currentColumn = newColumn;
        }

        event.preventDefault(); // Verhindert das Standardverhalten
    }
}, { passive: false }); // Hier passive: false setzen

// Touchend-Listener bleibt unverändert
document.addEventListener("touchend", function () {
    if (currentTaskId) {
        let droppedInZone = false;

        const movableRect = movableDiv.getBoundingClientRect();

        dropzones.forEach(dropzone => {
            const dropzoneRect = dropzone.getBoundingClientRect();
            const columnId = dropzone.getAttribute("id");

            if (
                movableRect.left < dropzoneRect.right &&
                movableRect.right > dropzoneRect.left &&
                movableRect.top < dropzoneRect.bottom &&
                movableRect.bottom > dropzoneRect.top
            ) {
                droppedInZone = true;
                let id = parseTaskIdToNumberId(currentTaskId);
                tasksFromFirebase[id].Column = getColumn(columnId);
                putData(TASKS_DIR, tasksFromFirebase);
                refresh(); // Update UI oder Daten
            }
        });

        movableDiv.querySelector('section').style.transition = "0.1s ease";
        movableDiv.querySelector('section').style.transform = "rotate(0deg)";
        movableDiv.style.display = "none";
        currentTaskId = null;

        if (originalColumn) {
            originalColumn.style.backgroundColor = "";
        }
        if (currentColumn) {
            currentColumn.style.backgroundColor = "";
        }

        originalColumn = null;
        currentColumn = null;
    }
});

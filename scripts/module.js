/*
    Author: Martin Reifschneider
*/
import './boards.js';
import './add-task.js';
import { parseTaskIdToNumberId } from './boards-edit.js';
import { refresh } from './boards.js';
import { openOverlay } from './boards-overlay.js';
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
let isDragging = false; // Flag to track if the element is being dragged
let startX, startY, endX, endY, tapTimeout; // Start position for dragging
const tapThreshold = 10;
const swipeThresholdX = 30;   // Schwellenwert für horizontales Swiping
const swipeThresholdY = 30;
let dragTimeout;
let quickTap = false;


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


/**
 * Preparing movable object with all informations of catched div from mouse or touch event
 *
 * @param {*} taskElement
 */
function prepareMovableObject(taskElement) {
    if(!isDragging) return; 
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
}

/** Reset movable object */
function resetMovableObject() {
    if(movableDiv == null) return;
    movableDiv.querySelector('section').style.transition = "0.1s ease";
    movableDiv.querySelector('section').style.transform = "rotate(0deg)";
    movableDiv.style.display = "none";
    currentTaskId = null;
}

/** Reset touched column background color */
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

/**
 * Check if mouse bounding column rectangle
 *
 * @param {*} event
 * @param {*} column
 * @returns {boolean}
 */
function checkMousemoveBounding(event, column) {
    const rect = column.getBoundingClientRect();
    return (
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom
    );
}

/**
 * Check if end position on mouseup or touchend bounding column rectangle
 * to example if you move from column called "To Do" to "Done"
 *
 * @param {*} dropzone
 * @returns {boolean}
 */
function checkDropzoneBounding(dropzone) {
    const movableRect = movableDiv.getBoundingClientRect();
    const dropzoneRect = dropzone.getBoundingClientRect();
    return (
        movableRect.left < dropzoneRect.right &&
        movableRect.right > dropzoneRect.left &&
        movableRect.top < dropzoneRect.bottom &&
        movableRect.bottom > dropzoneRect.top
    );
}

/**
 * Function for waiting 200ms and preparing dragging element
 *
 * @param {*} isTouch
 * @param {*} event
 * @param {*} taskElement
 */
function waitForDrag(isTouch, event, taskElement) {
    // Set timout for dragging
    dragTimeout = setTimeout(() => {
        isDragging = true;
        quickTap = false;
        prepareMovableObject(taskElement);
        const rect = taskElement.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        movableDiv.style.left = (isTouch ? event.touches[0].pageX : event.pageX) - offsetX + "px";
        movableDiv.style.top = (isTouch ? event.touches[0].pageY : event.pageY) - offsetY + "px";
    }, 500);
}


// Function to handle start event for mouse or touch
function handleStart(event, isTouch = false) {
    event.preventDefault();
    const taskElement = event.target.closest(".task-card");
    if (taskElement) {
        currentTaskId = taskElement.id;
        quickTap = true;
        startX = isTouch ? event.touches[0].clientX : event.clientX;
        startY = isTouch ? event.touches[0].clientY : event.clientY;
        endX = isTouch ? event.touches[0].clientX : event.clientX;
        endY = isTouch ? event.touches[0].clientY : event.clientY;
        tapTimeout = setTimeout(() => { quickTap = false; }, 150);
        waitForDrag(isTouch, event, taskElement);
    }
}

// Start event for mouse
if(taskContainer != null) taskContainer.addEventListener("mousedown", function (event) {
    handleStart(event);
});

// Start event for touch
if(taskContainer != null) taskContainer.addEventListener("touchstart", function (event) {
    handleStart(event, true);
}, { passive: false });

// Function to handle mouse or touch move
function handleMove(event, isTouch = false) {
    if (!currentTaskId || !isDragging) return;

    movableDiv.style.left = (isTouch ? event.touches[0].pageX : event.pageX) - offsetX + "px";
    movableDiv.style.top = (isTouch ? event.touches[0].pageY : event.pageY) - offsetY + "px";

    let newColumn = null;
    dropzones.forEach(column => {
        if (isTouch ? checkDropzoneBounding(column) : checkMousemoveBounding(event, column)) newColumn = column;
    });
    colorTouchedColumn(newColumn);
    event.preventDefault();
}

// Move event for mouse
document.addEventListener("mousemove", function (event) {
    handleMove(event);
});

// Move event for touch
document.addEventListener("touchmove", function (event) {
    handleMove(event, true);
}, { passive: false });

/**
 * Function for scroll on touch event
 *
 * @param {*} deltaX
 * @param {*} deltaY
 */
function onScroll(deltaX, deltaY) {
    if(!quickTap && deltaX > swipeThresholdX && deltaX > deltaY) {
        const column = event.target.closest('.column');
        if(endX < startX) column.scrollLeft += 252;
        else column.scrollLeft -= 252;
    }
    else if (!quickTap && deltaY > swipeThresholdY && deltaY > deltaX) {
        const mainContainer = document.querySelector('main');
        if (endY < startY) mainContainer.scrollTop += 300;  // Scrollen um 100px nach unten
        else mainContainer.scrollTop -= 300;  // Scrollen um 100px nach oben
    }
}

/**
 * Function for swipe on touch event
 *
 * @param {*} event
 */
function handleSwipe(event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);
    if(deltaX < tapThreshold && deltaY < tapThreshold && quickTap) {
        const taskElement = event.target.closest(".task-card");
        if(taskElement) handleClickOnTask(taskElement.getAttribute("id"));
    }
    else onScroll(deltaX, deltaY);
}

/** Clear all set timeout */
function clearTimeouts() {
    clearTimeout(dragTimeout);
    clearTimeout(tapTimeout);
}

/**
 * Function to handle end event for mouse and touch
 *
 * @param {boolean} [isTouch=false]
 */
function handleEnd(event, isTouch = false) {
    clearTimeouts();
    if(isTouch) handleSwipe(event);
    if (!isDragging && quickTap) handleClickOnTask(currentTaskId);
    else if (isDragging && currentTaskId) {
        dropzones.forEach(dropzone => {
            const columnId = dropzone.getAttribute("id");
            if (checkDropzoneBounding(dropzone)) saveMovedTask(currentTaskId, columnId);
        });
        resetMovableObject();
        resetColumn();
    }
    isDragging = false;
    quickTap = false;
}


// End event for mouse
document.addEventListener("mouseup", function (event) {
    handleEnd(event);
});


// End event for touch
document.addEventListener("touchend", function (event) {
    handleEnd(event, true);
}, { passive: false });


/** 
 * Handle a simple click on a task
 * Add your click handling logic here
 * @param {*} taskId 
 */
function handleClickOnTask(taskId) {
    isDragging = false;
    let id = parseTaskIdToNumberId(taskId);
    openOverlay(id);
}
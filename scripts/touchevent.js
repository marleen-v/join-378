/*
    Author: Martin Reifschneider
*/


import { getCurrentDraggedElement } from "./boards.js";
import { parseTaskIdToNumberId } from "./boards-edit.js";

let container = document.getElementById("board-main");
export let touchmove = false;
let targetDiv = null;

/**
 * Function to load event listener
 *
 * @export
 */
export function handleTouchEventListener() {
    columnTouchmoveEventListener();
    columnTouchendEventListener()
}


/**
 * Help function to check if moved on current column with touch and set highlight current column to grey
 * or unset left highlighted column to white
 *
 * @param {*} div
 * @param {*} event
 */
function setTargetDiv(div, event) {
    let touch = event.touches[0], x = touch.clientX, y = touch.clientY;
    let rect = div.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        targetDiv = div; // set target div
        highlightColumn(targetDiv.id);
        return;
    }
    removeHighlightColumn(div.id);
}


/** Touch listener -> touch move */
function columnTouchmoveEventListener() {
    container.addEventListener("touchmove", function (event) {
        event.preventDefault();
        touchmove = true;
        let innerDivs = document.getElementsByClassName("column");
        targetDiv = null;

        for (let div of innerDivs) {
            setTargetDiv(div, event);
        }
    }, false);
}


/** Touch listener for touch end */
function columnTouchendEventListener() {
    container.addEventListener("touchend", function (event) {
        touchmove = false;
        if (targetDiv) {
            drop(targetDiv.id);
            removeHighlightColumn(targetDiv.id);
        }
        targetDiv = null; // Reset
    }, false);
}


/**
 * Function to drop task into column by touch
 *
 * @param {*} column
 */
function drop(column) {
    document.getElementById('boards-search').value = "";
    let id = parseTaskIdToNumberId(getCurrentDraggedElement());

    switch (column) {
        case 'to-do': column = 'To Do'; break; g
        case 'in-progress': column = 'In Progress'; break;
        case 'await-feedback': column = 'Await Feedback'; break;
        case 'done': column = 'Done'; break;
    }
    tasksFromFirebase[id].Column = column;
    putData(TASKS_DIR, tasksFromFirebase);
    refresh();
}

window.drop = drop;
import './boards.js';
import './add-task.js';
import { parseTaskIdToNumberId } from './boards-edit.js';
import { getCurrentDraggedElement, refresh } from './boards.js';
export const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
export const USERS_DIR = '/users';
export const CONTACTS_DIR = '/contacts';
export const TASKS_DIR = '/tasks';
let container = document.getElementById("board-main");
export let touchmove = false;
let targetDiv = null;
let draggedElement = null;
let offsetX = 0, offsetY = 0;

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
export async function loadActiveUser(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    return await res.json();;
  }


  /**
 * Puts user data to firebase
 * @param {string} path directory in firebase
 * @param {object} data object the needs to be stored
 */
export async function putData(path="", data={}){
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



// Touch listener -> touch move
container.addEventListener("touchmove", function(event) {
    touchmove = true;
    let touch = event.touches[0];
    let x = touch.clientX;
    let y = touch.clientY;
    let innerDivs = document.getElementsByClassName("column");
    targetDiv = null;

    for (let div of innerDivs) {
        let rect = div.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            targetDiv = div; // set target div
            highlightColumn(targetDiv.id);
            break;
        }
        removeHighlightColumn(div.id); 
        
    }
}, false);

// Touch listener for touch end
container.addEventListener("touchend", function(event) {
    touchmove = false;
    if (targetDiv) {
        drop(targetDiv.id);  
        removeHighlightColumn(targetDiv.id);      
    }
    targetDiv = null; // Reset
}, false);


/**
 * Function to drop task into column by touch
 *
 * @param {*} column
 */
function drop(column) {
    document.getElementById('boards-search').value = "";
    let id = parseTaskIdToNumberId(getCurrentDraggedElement());
        
    switch (column) {
        case 'to-do': column = 'To Do'; break;g
        case 'in-progress': column = 'In Progress'; break;
        case 'await-feedback': column = 'Await Feedback'; break;
        case 'done': column = 'Done'; break;
    }
    tasksFromFirebase[id].Column = column;
    putData(TASKS_DIR, tasksFromFirebase);
    refresh();
}


window.drop = drop;

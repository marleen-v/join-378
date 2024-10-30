import './boards.js';
import './add-task.js';
import { parseTaskIdToNumberId } from './boards-edit.js';
import { getCurrentDraggedElement, refresh } from './boards.js';
export const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
export const USERS_DIR = '/users';
export const CONTACTS_DIR = '/contacts';
export const TASKS_DIR = '/tasks';
let container = document.getElementById("board-main");


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

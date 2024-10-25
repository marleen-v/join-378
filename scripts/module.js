import './boards.js';
import './add-task.js';

export const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
export const USERS_DIR = '/users';
export const CONTACTS_DIR = '/contacts';
export const TASKS_DIR = '/tasks';


export async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}

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
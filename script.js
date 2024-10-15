const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
const ACTIVE_DIR = '/active';
let dataFromFirebase = [];
let tasksFromFirebase = [];
let activeUser = [];

let currentUserFirstName = "";
let currentUserLastName = "";


function init() {
    openSummary();
}


function openSummary() {
    window.location = "../html/summary.html";
}

function openBoards() {
    window.location = "../html/boards.html";
}


function openAddTask() {
    window.location = "../html/add-task.html";
}


function openContacts() {
    window.location = "../html/contacts.html";
}


function openPolicy() {
    window.location = "../html/policy.html";
}


function openImprint() {
    window.location = "../html/impressum.html";
}


async function loadData(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    dataFromFirebase = resToJson;
}


async function putData(path="", data={}){
    let res = await fetch(FIREBASE_URL + path + ".json",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    let resToJson = await res.json();
  }
  
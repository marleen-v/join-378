const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
const ACTIVE_DIR = '/active';
let dataFromFirebase = [];
let tasksFromFirebase = [];
let activeUser = [];
let contactColors = ["orange", "violet", "purple", "pink", "yellow", "green", "dark_purple", "red"];

let currentUserFirstName = "";
let currentUserLastName = "";


function init() {
    openSummary();
}

function openHelp() {
    window.location = "../html/help.html";
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
    return resToJson;
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

  function getRandomColor(){
    let r = Math.floor(Math.random() * 8);
    return contactColors[r];
  }


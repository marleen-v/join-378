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


/**
 * Opens summary page on startup
 */
function init() {
    openSummary();
}


/**
 * Opens help page
 */
function openHelp() {
    window.location = "../html/help.html";
}


/**
 * Opens login page
 */
function openLogin() {
    window.location = "../html/login.html";
}


/**
 * Opens summary page
 */
function openSummary() {
    window.location = "../html/summary.html";
}


/**
 * Opens board page
 */
function openBoards() {
    window.location = "../html/boards.html";
}


/**
 * Opens add task page
 */
function openAddTask() {
    window.location = "../html/add-task.html";
}


/**
 * Opens contacts page
 */
function openContacts() {
    window.location = "../html/contacts.html";
}


/**
 * Opens policy page
 */
function openPolicy() {
    window.location = "../html/policy.html";
}


/**
 * Opens imprint page
 */
function openImprint() {
    window.location = "../html/impressum.html";
}


/**
 * Loads data from firebase
 * @param {string} path directory in firebase
 * @returns 
 */
async function loadData(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


/**
 * Puts user data to firebase
 * @param {string} path directory in firebase
 * @param {object} data object the needs to be stored
 */
async function putData(path="", data={}){
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
 * Determines random color from color array
 * @returns color for user icon
 */
function getRandomColor(){
  let r = Math.floor(Math.random() * 8);
  return contactColors[r];
}


/**
 * Sets the Logo for Active User in Header
 */
async function getLogo(){
    activeUser = await loadData(ACTIVE_DIR);
    document.getElementById("userlogo").innerHTML = activeUser[0].initials;
}


/**
 * Checks origin of forwarding and hides menu-bar
 */
function checkOrigin(){
    if (document.referrer.includes("login.html") || document.referrer.includes("signup.html")){
      document.querySelector(".menu-bar").style.display = "none";
      document.body.style.pointerEvents = "none";
      document.querySelector("main").style.pointerEvents = "auto";
    }
}
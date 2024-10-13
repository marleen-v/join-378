const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
let dataFromFirebase = [];
let tasksFromFirebase = [];

let currentUserFirstName = "Sofia";
let currentUserLastName = "Müller";

let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");


function init() {
    //nur zum testen
    initBoard();
}


async function loadBoard() {
    const htmlContent = await loadHTML('./html/board.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}


async function loadAddTask() {
    const htmlContent = await loadHTML('./html/add-task.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}
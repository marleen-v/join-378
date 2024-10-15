import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
let currentDraggedElement;
let tasks = [];


async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


async function loadBoards() {
    //const htmlContent = await loadHTML('../html/boards-main.html');
    tasks = await loadData(TASKS_DIR);

    if (tasks) {
        //processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        showData();
    }
}


function setCard(element, index, id, column) {
    let taskId = 'taskId' + id;
    let taskTemplate = getTaskCard(taskId, element.Column);
    let className = document.querySelector(`.board-main-${column}`);
    className.innerHTML += taskTemplate;
    let card = document.querySelector('.add-task-card');
    card.classList.replace("add-task-card", `add-task-card${index}`);
    let currentCard = document.querySelector(`.add-task-card${index}`);
    currentCard.querySelector('.add-task-card-top').innerHTML = element.Category;
    currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
    currentCard.querySelector('.add-task-card-description').innerHTML = element.Description;
    currentCard.setAttribute("ondragstart", `startDragging('${taskId}')`);
    let personsHTML = "";
    element.Persons.forEach(person => { personsHTML += /*html*/`<div>${person}</div> `; });
    currentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
}


function showData() {    
    let index = 0;
    tasks.forEach((element, id) => {
        if (element.Column === "To Do") setCard(element, index, id, "to-do");
        if (element.Column === "In Progress") setCard(element, index, id, "in-progress");
        if (element.Column === "Await Feedback") setCard(element, index, id, "await-feedback");
        if (element.Column === "Done") setCard(element, index, id, "done");
        index++;
    });
}

function startDragging(id) {
    currentDraggedElement = id;
    console.log(id);

}

function getTaskCard(taskId, element) {
    return /*html*/`
        <section id="${taskId}" class="task-card add-task-card" draggable="true" ondragstart="startDragging(${element['id']})">
            <div class="add-task-card-top"></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks"></div>
            <div class="add-task-card-assigned-to"></div>
        </section>  
    `;
}

function moveTo(column) {
    let currentCard = document.getElementById(currentDraggedElement);
    currentCard.querySelector('.add-task-card-headline');

    tasks.forEach((element, id) => {
        const task = 'taskId' + id;
        if (task === currentDraggedElement) {
            element.Column = column;
        }

    });
    putData(TASKS_DIR, tasks);
    refresh();
}

function refresh() {
    document.querySelector('.board-main-to-do').innerHTML = "";
    document.querySelector('.board-main-in-progress').innerHTML = "";
    document.querySelector('.board-main-await-feedback').innerHTML = "";
    document.querySelector('.board-main-done').innerHTML = "";
    showData();
}

function allowDrop(ev) {
    ev.preventDefault();
}


async function putData(path = "", data = {}) {
    let res = await fetch(FIREBASE_URL + path + ".json",
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}


window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.loadBoards = loadBoards;
window.refresh = refresh;



import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
let currentDraggedElement;



async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


async function loadBoards() {
    const htmlContent = await loadHTML('../html/boards-main.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        showData();
    }
}


async function showData() {
    let json = await loadData(TASKS_DIR);
    //let taskTemplate = getTaskCard(element);//await loadHTML('../html/add-task-card.html');
    console.log(json);

    let index = 0;
    json.forEach(element => {
        if (element.Category === "To Do") {
            let taskTemplate = getTaskCard(element.Category);
            console.log(element);
            let toDo = document.querySelector('.board-main-to-do');
            let html = /*html*/`
                <div>${element.Title}</div>  
            `;
            toDo.innerHTML += taskTemplate;
            console.log(index);

            let card = document.querySelector('.add-task-card');
            card.classList.replace("add-task-card", `add-task-card${index}`);
            let currentCard = document.querySelector(`.add-task-card${index}`);
            currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
            currentCard.querySelector('.add-task-card-description').innerHTML = element.Description;
            currentCard.setAttribute("ondrop", `moveTo('add-task-card${index}', 'to-do')`);
            let personsHTML = "";
            element.persons.forEach(person => {
                personsHTML += /*html*/`
                    <div>${person}</div>  
                `;
            });
            currentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
            //cardTop.innerHTML += html; 

            index++;
        }

    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function getTaskCard(element) {
    return /*html*/`
        <section class="task-card add-task-card" draggable="true" ondragstart="startDragging(${element['id']})">
            <div class="add-task-card-top"></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks"></div>
            <div class="add-task-card-assigned-to"></div>
        </section>  
    `;
}

function moveTo(id, column) {
    console.log(column);
    
}

function allowDrop(ev) {
    ev.preventDefault();
}

window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.loadBoards = loadBoards;



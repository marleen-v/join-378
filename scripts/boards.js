import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";
import { getPriority } from "./add-task.js";
import { search } from "./boards-filter.js";
import { openOverlay } from "./boards-overlay.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const CONTACTS_DIR = '/contacts';
const TASKS_DIR = '/tasks';
let currentDraggedElement;
let searchId = document.getElementById('boards-search');
export let tasks = [];
export let contacts = [];


export function updateTasks(list) {
    tasks = list;
}


async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


/**
 * Load board and store all data for board from firebase strorage
 *
 * @async
 * @returns {*}
 */
async function loadBoards() {
    //const htmlContent = await loadHTML('../html/boards-main.html');
    tasks = await loadData(TASKS_DIR);
    contacts = await loadData(CONTACTS_DIR);

    if (tasks) {
        //processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        showData(tasks);
    }
}

/**
 * Set Background Color of top row category it exists 'User Story' and 'Technical Task'
 *
 * @param {*} currentCard
 * @param {*} element
 */
export function setBgColor(currentCard, element) {
    if (element.Category === "User Story") {
        currentCard.querySelector('.add-task-card-category').classList.add('bg-color-blue');
        currentCard.querySelector('.add-task-card-category').classList.remove('bg-color-turkey');
    }
    else {
        currentCard.querySelector('.add-task-card-category').classList.remove('bg-color-blue');
        currentCard.querySelector('.add-task-card-category').classList.add('bg-color-turkey');
    }

}

/**
 * Get current color of user icon displayed in circle icon
 *
 * @param {*} firstName
 * @param {*} lastName
 * @returns {string}
 */
function getUserColor(firstName, lastName) {
    let color = "";
    contacts.forEach(element => {
        if (element.firstName == firstName || element.lastName == lastName) {
            color = element.color;
        }
    });
    return color;
}


/**
 * Parse user name to initials
 *
 * @param {*} currentCard
 * @param {*} element
 */
export function setUserInitial(element, displayFullName = false) {    
    let personsHTML = "";
    element.Persons.forEach(person => {
        let splittedName = person.split(' ');
        let firstName = splittedName[0].charAt(0);
        let lastName = splittedName[1].charAt(0);
        let initial = firstName + lastName;
        let color = getUserColor(splittedName[0], splittedName[1]);        
        personsHTML += /*html*/`
            <span class="circle ${color} flex justify-content-center align-items-center"><span>${initial}</span></span> 
            ${(displayFullName)? "<span>" + person + "</span>" : ""}
        `;
    });    
    return personsHTML;
}

/**
 * Set and collect all elements for displayed card with all informations with card ctaegory, headline description to example
 *
 * @param {*} element
 * @param {*} index
 * @param {*} taskId
 */
function setCardElements(element, index) {
    let currentCard = document.querySelector(`.add-task-card${index}`);
    currentCard.querySelector('.add-task-card-category').innerHTML = element.Category;
    setBgColor(currentCard, element);
    currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
    currentCard.querySelector('.add-task-card-description').innerHTML = element.Description.slice(0, 34) + '...';
    setSubtasks(currentCard, element);    
    currentCard.querySelector('.add-task-card-assigned-to').innerHTML = setUserInitial(element);
    currentCard.querySelector('.add-task-card-priority').innerHTML = getPriority(element);//getPriority(element);
}


export function calculateDoneSubtasks(element) {
    let done = 0;
    element.Subtasks.forEach(element => { (element.Done == true) ? done+=1 : done+=0 });
    return done;
}

/**
 * Get progress bar with bootstrap and show if exists subtasks
 *
 * @param {*} element
 * @returns {string}
 */
function getProgressBar(element) {
    let done = calculateDoneSubtasks(element);
    let procent = (done / element.Subtasks.length) * 100;
    
    return /*html*/`
        <div class="progressbar-container">
            <div class="progressbar" style="width: ${procent}%"></div>
        </div>
        <span class="flex align-items-center">${done}/${element.Subtasks.length} Subtasks</span>
    `
}

/**
 * Set subtasks if are exist if not then not shown
 *
 * @param {*} currentCard
 * @param {*} element
 */
function setSubtasks(currentCard, element) {
    if(element.Subtasks == null) currentCard.querySelector('.add-task-card-subtasks').innerHTML = "";
    else currentCard.querySelector('.add-task-card-subtasks').innerHTML = getProgressBar(element); //element.Subtasks.length + " Subtasks";
}

/**
 * Set build task card for board - kanban board
 *
 * @param {*} element
 * @param {*} index
 * @param {*} id
 * @param {*} column
 */
export function setCard(element, index, column) {
    let taskId = 'taskId' + element.id;
    let taskTemplate = getTaskCard(element.id, taskId);    
    let className = document.querySelector(`.board-main-${column}`);
    className.innerHTML += taskTemplate;
    let card = document.querySelector('.add-task-card');
    card.classList.replace("add-task-card", `add-task-card${index}`);
    setCardElements(element, index);
}


export function checkEmptyColumns() {    
    if(!search(tasks, "Column", "To Do")) document.querySelector(`.board-main-to-do`).innerHTML = getEmptyColumn();
    if(!search(tasks, "Column", "In Progress")) document.querySelector(`.board-main-in-progress`).innerHTML = getEmptyColumn();
    if(!search(tasks, "Column", "Await Feedback")) document.querySelector(`.board-main-await-feedback`).innerHTML = getEmptyColumn();
    if(!search(tasks, "Column", "Done")) document.querySelector(`.board-main-done`).innerHTML = getEmptyColumn();
}


function clearColumns() {
    document.querySelector(`.board-main-to-do`).innerHTML = "";
    document.querySelector(`.board-main-in-progress`).innerHTML = "";
    document.querySelector(`.board-main-await-feedback`).innerHTML = "";
    document.querySelector(`.board-main-done`).innerHTML = "";
}

/** 
 * Show all data to board it exists 4 columns | To Do | In Progress | Await Feedback | Done
*/
export function showData(array) {
    clearColumns();
    //let index = 0;
    array.forEach((element, index) => {          
        if (element.Column === "To Do") setCard(element, index, "to-do");
        if (element.Column === "In Progress") setCard(element, index, "in-progress");
        if (element.Column === "Await Feedback") setCard(element, index, "await-feedback");
        if (element.Column === "Done") setCard(element, index, "done");
        index++;
    });   
    checkEmptyColumns();
}

/**
 * Store the current id at start of draging a task card
 *
 * @param {*} id
 */
function startDragging(id) {
    if(!id) return;
    currentDraggedElement = id;
}


function getEmptyColumn() {
    return /*html*/`
        <section class="flex justify-content-center align-items-center emptyColumn">
            <span>No tasks To do</span>
        </section>
    `;
}


/**
 * Get html structure of task card
 *
 * @param {*} taskId
 * @param {*} element
 * @returns {string}
 */
function getTaskCard(id, taskId) {    
    return /*html*/`
        <section onclick="openOverlay(${id})" id="${taskId}" class="task-card add-task-card" draggable="true" ondragstart="startDragging('${taskId}')">
            <div class="flex align-items-center add-task-card-top"><div class="flex align-items-center justify-content-center add-task-card-category"></div></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks align-items-center"></div>
            <div class="add-task-card-bottom">
                <div class="add-task-card-assigned-to flex"></div>
                <div class="add-task-card-priority flex align-items-center justify-content-flex-end"></div>
            </div>
        </section>  
    `;
}

function highlightColumn(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlightColumn(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Store current dropped task card into firebase and dropped column
 *
 * @param {*} column
 */
function moveTo(column) {
    document.getElementById('boards-search').value = "";
    let currentCard = document.getElementById(currentDraggedElement);    
    currentCard.querySelector('.add-task-card-headline');

    tasks.forEach((element, id) => {
        const task = 'taskId' + id;
        if (task === currentDraggedElement) {
            element.Column = column;
        }
        
    });
    putBoardData(TASKS_DIR, tasks);
    refresh();
}


/** 
 * Refresh the changed board if an element is dropped
*/
function refresh() {
    document.querySelector('.board-main-to-do').innerHTML = "";
    document.querySelector('.board-main-in-progress').innerHTML = "";
    document.querySelector('.board-main-await-feedback').innerHTML = "";
    document.querySelector('.board-main-done').innerHTML = "";
    showData(tasks);
}

/**
 * Allowing to drop a div element
 *
 * @param {*} ev
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Put the changed data to firebase
 *
 * @async
 * @param {string} [path=""]
 * @param {{}} [data={}]
 * @returns {unknown}
 */
async function putBoardData(path = "", data = {}) {
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

function clearHighlightedTasks() {
    if(searchId.value == "") 
        tasks.forEach(element => { document.getElementById('taskId' + element.id).style.backgroundColor = 'white'; });
}


searchId.addEventListener('input', function(e) {
    clearHighlightedTasks();
});

window.highlightColumn = highlightColumn;
window.removeHighlightColumn = removeHighlightColumn;
window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.loadBoards = loadBoards;
window.refresh = refresh;
window.openOverlay = openOverlay;


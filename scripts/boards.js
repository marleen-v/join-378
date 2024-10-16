import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";
import { getPriority } from "./add-task.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const CONTACTS_DIR = '/contacts';
const TASKS_DIR = '/tasks';
let currentDraggedElement;
let tasks = [];
let contacts = [];


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
        showData();
    }
}

/**
 * Set Background Color of top row category it exists 'User Story' and 'Technical Task'
 *
 * @param {*} currentCard
 * @param {*} element
 */
function setBgColor(currentCard, element) {
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
        if (element.firstName == firstName && element.lastName == lastName) {
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
function setUserInitial(currentCard, element) {
    let personsHTML = "";
    element.Persons.forEach(person => {
        let splittedName = person.split(' ');
        let firstName = splittedName[0].charAt(0);
        let lastName = splittedName[1].charAt(0);
        let initial = firstName + lastName;
        let color = getUserColor(splittedName[0], splittedName[1]);        
        personsHTML += /*html*/`<span class="circle ${color} flex justify-content-center align-items-center"><span>${initial}</span></span> `;
    });
    currentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
}

/**
 * Set and collect all elements for displayed card with all informations with card ctaegory, headline description to example
 *
 * @param {*} element
 * @param {*} index
 * @param {*} taskId
 */
function setCardElements(element, index, taskId) {
    let currentCard = document.querySelector(`.add-task-card${index}`);
    currentCard.querySelector('.add-task-card-category').innerHTML = element.Category;
    setBgColor(currentCard, element);
    currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
    currentCard.querySelector('.add-task-card-description').innerHTML = element.Description.slice(0, 34) + '...';
    currentCard.setAttribute("ondragstart", `startDragging('${taskId}')`);
    setSubtasks(currentCard, element);    
    setUserInitial(currentCard, element);
    currentCard.querySelector('.add-task-card-priority').innerHTML = getPriority(element);//getPriority(element);
}

/**
 * Get progress bar with bootstrap and show if exists subtasks
 *
 * @param {*} element
 * @returns {string}
 */
function getProgressBar(element) {
    let done = (element.Subtasks.Done.length > 0 && element.Subtasks.Done[0] !== "") ? element.Subtasks.Done.length : 0;
    let procent = (done / element.Subtasks.Total.length) * 100;
    return /*html*/`
        <div class="progress" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="height: 20px">
            <div class="progress-bar" style="width: ${procent}%"></div>
        </div>
        <span class="flex align-items-center">${done}/${element.Subtasks.Total.length} Subtasks</span>
    `
}

/**
 * Set subtasks if are exist if not then not shown
 *
 * @param {*} currentCard
 * @param {*} element
 */
function setSubtasks(currentCard, element) {
    if(element.Subtasks.Total.length < 2 && element.Subtasks.Total[0] === "") currentCard.querySelector('.add-task-card-subtasks').innerHTML = "";
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
function setCard(element, index, id, column) {
    let taskId = 'taskId' + id;
    let taskTemplate = getTaskCard(taskId, element.Column);
    let className = document.querySelector(`.board-main-${column}`);
    className.innerHTML += taskTemplate;
    let card = document.querySelector('.add-task-card');
    card.classList.replace("add-task-card", `add-task-card${index}`);
    setCardElements(element, index);
}


/** 
 * Show all data to board it exists 4 columns | To Do | In Progress | Await Feedback | Done
*/
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

/**
 * Store the current id at start of draging a task card
 *
 * @param {*} id
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * Get html structure of task card
 *
 * @param {*} taskId
 * @param {*} element
 * @returns {string}
 */
function getTaskCard(taskId, element) {
    return /*html*/`
        <section id="${taskId}" class="task-card add-task-card" draggable="true" ondragstart="startDragging(${element['id']})">
            <div class="add-task-card-top"><div class="add-task-card-category"></div></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks align-items-center"></div>
            <div class="add-task-card-bottom">
                <div class="add-task-card-assigned-to"></div>
                <div class="add-task-card-priority"></div>
            </div>
        </section>  
    `;
}

/**
 * Store current dropped task card into firebase and dropped column
 *
 * @param {*} column
 */
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


/** 
 * Refresh the changed board if an element is dropped
*/
function refresh() {
    document.querySelector('.board-main-to-do').innerHTML = "";
    document.querySelector('.board-main-in-progress').innerHTML = "";
    document.querySelector('.board-main-await-feedback').innerHTML = "";
    document.querySelector('.board-main-done').innerHTML = "";
    showData();
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



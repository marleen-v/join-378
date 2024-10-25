import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";
import { parseTaskIdToNumberId } from "./boards-edit.js";
import { getInputForm, getCategory, getUserIcon, getSubtaskInput, getSubtaskMask, editSubtask, getDisplaySubtaskMask } from './add-task-template.js';
import { getUrgentSVG, getMediumSVG, getLowSVG, checkedBoxSVG, uncheckedBoxSVG } from "./svg-template.js";

let priority = "medium";
let toggleContactList = false, toggleCategory = false, toggleSubtask = false;
let contacts = [];
let subtasks = [];
let addedUser = [];
let activeUser = [];
let category = "";
let tasks = [];


export async function loadActiveUser(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    activeUser = await res.json();
    return activeUser;
}

async function loadAddTask() {
    tasks = await loadData(TASKS_DIR);
    contacts = await loadData(CONTACTS_DIR);
    activeUser = await loadActiveUser(ACTIVE_DIR);
    document.querySelector('main').innerHTML = getInputForm();
    setBgColor('medium');
    getLogo();
}

function addTask() {
    console.log("Add");

}

function isChecked(element, taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let person = element.firstName + " " + element.lastName;
    if (findPersons(tasks[id].Persons, person)) return checkedBoxSVG();
    return uncheckedBoxSVG();
}


export function findPersons(data, searchString) {
    for (let index = 0; index < data.length; index++) {
        if (data[index].email === searchString) return true;
    }
    return false;
}


function addUserItem(element, index) {
    let selectBox = "";
    if(findPersons(addedUser, element.email)) selectBox = checkedBoxSVG()
    else selectBox = uncheckedBoxSVG();
    return /*html*/`
        <div class="task-user-select grid grid-columns-3-48px-1fr-48px selection" onclick="addUser(${index})">
            <span class="circle ${element.color} flex justify-content-center align-items-center set-width-height-42"><span>${element.initials}</span></span> 
            <span class="flex align-items-center">${element.firstName} ${element.lastName}</span>
            <div class="flex align-items-center">${selectBox}</div>
        </div>
    `;
}


function removePerson(data, elementToRemove) {
    data.forEach((item, index) => {
        if (item.email === elementToRemove) {
            data.splice(index, 1);
        }
    });
    return data;
}


function displayAddedUser() {
    document.querySelector('.display-assigned-user').innerHTML = "";
    addedUser.forEach(element => {
        document.querySelector('.display-assigned-user').innerHTML += getUserIcon(element);
    });
}

function addUser(index) {    
    if (!findPersons(addedUser, contacts[index].email)) {
        addedUser.push(contacts[index]); 
        displayAddedUser();
    }
    else {
        removePerson(addedUser, contacts[index].email);
    }
    openContacts();
}


function getActiveUser(element) {
    if(element.email == activeUser.email) return true;
    return false;
}


function openContacts() {
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "|";
    let persons = document.querySelector('.select-box-contacts');
+   persons.classList.add('bg-white');
    persons.classList.add('set-z-index-100');
    persons.innerHTML = "";
    contacts.forEach((element, index) => {
        persons.innerHTML += addUserItem(element, index);
        if (getActiveUser(element)) document.querySelector('.task-user-select').classList.add('set-bg-dark-blue');
        else document.querySelector('.task-user-select').classList.remove('set-bg-dark-blue');
    });
    document.getElementById('contacts-toggle-img').style.transform = "rotate(180deg)";

}


function closeContacts() {
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "Select contacts to assign";
    let persons = document.querySelector('.select-box-contacts');
    persons.classList.remove('bg-white');
    persons.classList.remove('set-z-index-100');
    persons.innerHTML = "";
    document.getElementById('contacts-toggle-img').style.transform = "rotate(0deg)";
}

function addContact() {
    toggleContactList = !toggleContactList;
    if (toggleContactList) {
        openContacts();
    }
    else {
        closeContacts();
    }
}


function setBgColor(element) {
    let div = document.querySelector(`#${element}`);

    switch (element) {
        case 'urgent': div.classList.add('set-bg-red'); break;
        case 'medium': div.classList.add('set-bg-orange'); break;
        case 'low': div.classList.add('set-bg-green'); break;
    }
    div.querySelector('svg').classList.add('filter-color-to-white');

}


function removePriorityColor(element) {
    let detailedCard = document.querySelector(`${element}`);
    let buttons = detailedCard.querySelectorAll('.priority-buttons > button');

    buttons.forEach(item => {
        item.classList.remove('set-bg-red');
        item.classList.remove('set-bg-orange');
        item.classList.remove('set-bg-green');
        item.querySelector('svg').classList.remove('filter-color-to-white');
    });
}

export function setPriorityColor(element, task) {
    removePriorityColor(element);

    switch (task.Priority) {
        case 'Urgent': setBgColor(task.Priority.toLowerCase()); break;
        case 'Medium': setBgColor(task.Priority.toLowerCase()); break;
        case 'Low': setBgColor(task.Priority.toLowerCase()); break;
    }
}

/**
 * Return current priority as SVG icon
 *
 * @export
 * @param {*} element
 * @returns {string}
 */
export function getPriority(priority) {    
    let svg = "";
    switch (priority) {
        case 'Urgent' || 'urgent': svg = getUrgentSVG(); break;
        case 'Medium' || 'medium': svg = getMediumSVG(); break;
        case 'Low' || 'low': svg = getLowSVG(); break;
    }
    return svg;
}


function setPriority(prio) {
    priority = prio;
    removePriorityColor('.task-form-container');
    setBgColor(prio);
}

function addCategory(cat) {
    category = cat;
    document.querySelector('#category-input').value = cat;
    chooseCategory();
}


function openCategory() {
    let category = document.querySelector('.add-category');
    category.classList.add('bg-white');
    category.classList.add('set-z-index-100');
    document.getElementById('category-toggle-img').style.transform = "rotate(180deg)";

}

function closeCategory() {
    let category = document.querySelector('.add-category');
    category.classList.remove('bg-white');
    category.classList.remove('set-z-index-100');
    document.getElementById('category-toggle-img').style.transform = "rotate(0deg)";
}

function chooseCategory() {
    toggleCategory = !toggleCategory;
    let category = document.querySelector('.add-category');
    category.innerHTML = (toggleCategory) ? getCategory() : "";
    (toggleCategory) ? openCategory() : closeCategory();
}


function removeSubtask(index) {
    subtasks.splice(index, 1);
    displaySubtasks();
}

function saveSubtaskEdit(index) {
    let subtaskInput = document.getElementById(`added-subtask-input${index}`).value;
    if(subtaskInput !== "") subtasks[index].Description = subtaskInput;
    displaySubtasks();
}


export function displaySubtasks() {
    let subtaskDisplay = document.querySelector('.added-subtasks');
    subtaskDisplay.innerHTML = "";
    
    if(subtasks.length < 1) subtaskDisplay.innerHTML = "";
    else {
        subtasks.forEach((element, index) => {
            subtaskDisplay.innerHTML += getDisplaySubtaskMask(element, index); 
        });
    }
}

function pushNewSubtask() {
    let input = document.querySelector('#add-new-subtask').value;
    if(input !== "") {
        let subtask =  { Description: input, Done: false };    
        subtasks.push(subtask);  
        displaySubtasks('add-task', -1);
    } 
    document.querySelector('.add-new-subtask-box').innerHTML = getSubtaskMask();    
}


function addNewSubtask() {
    toggleSubtask = !toggleSubtask;
    let subtask = document.querySelector('.add-new-subtask-box');
    subtask.innerHTML = (toggleSubtask) ? getSubtaskInput() : getSubtaskMask();
    
}

function clearButton() {
    subtasks = [];
    addedUser = [];
    category = "";
    priority = "Medium";
    loadAddTask();
}


function getTaskInfos() {
    let persons = [];
    addedUser.forEach(element => { persons.push(element.firstName + " " + element.lastName) });
    return {
        "id": tasks.length,
        "Column": "To Do",
        "Title": document.getElementById('title').value,
        "Description": document.getElementById('description').value,
        "Date": document.getElementById('due-date').value,
        "Priority": priority.charAt(0).toUpperCase() + priority.slice(1),
        "Category": category,
        "Subtasks": subtasks,
        "Persons": persons,
      };      
}


function createNewTask() {       
    tasks.push(getTaskInfos());            
    putData(TASKS_DIR, tasks);
    
    setTimeout(() => {
        window.location = "../html/boards.html";  
    }, "300");
}



window.clearButton = clearButton;
window.loadAddTask = loadAddTask;
window.createNewTask = createNewTask;
window.setPriority = setPriority;
window.addContact = addContact;
window.addUser = addUser;
window.chooseCategory = chooseCategory;
window.addCategory = addCategory;
window.addNewSubtask = addNewSubtask;
window.pushNewSubtask = pushNewSubtask;
window.removeSubtask = removeSubtask;
window.editSubtask = editSubtask;
window.saveSubtaskEdit = saveSubtaskEdit;
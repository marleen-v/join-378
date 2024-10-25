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
/*
function getUserIcon(element) {
    return /*html*//*`
        <span class="circle ${element.color} flex justify-content-center align-items-center set-width-height-42"><span>${element.initials}</span></span> 
  
    `;
}*/

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
/*

function addUserItem(element, index) {
    let selectBox = "";
    if(findPersons(addedUser, element.email)) selectBox = checkedBoxSVG()
    else selectBox = uncheckedBoxSVG();
    return /*html*//*`
        <div class="task-user-select grid grid-columns-3-48px-1fr-48px selection" onclick="addUser(${index})">
            <span class="circle ${element.color} flex justify-content-center align-items-center set-width-height-42"><span>${element.initials}</span></span> 
            <span class="flex align-items-center">${element.firstName} ${element.lastName}</span>
            <div class="flex align-items-center">${selectBox}</div>
        </div>
    `;
}*/

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

    //div.classList.add('set-bg-orange');  
    //div.querySelector('svg').classList.add('filter-color-to-white'); 
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
    console.log(priority);
    
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

/*
function getCategory() {
    return /*html*//*`
        <div class="grid grid-rows-2">
            <div class="mg-top-8px p-8px selection clickable" onclick="addCategory('User Story')">User Story</div>
            <div class="p-8px selection clickable" onclick="addCategory('Technical Task')">Technical Task</div>  
        </div> 
    `;
}*/

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

/*
function getSubtaskMask() {
    return /*html*//*`
        <div onclick="addNewSubtask()" class="subtasks-add-box p-right-8px clickable">
            <span class="mg-left-8px">Add new subtask</span>
            <img class="click-item size-16px" src="../assets/icons/subtasks_plus.svg" alt="">
        </div>
    `;
}*/

/*
function getSubtaskInput() {
    return /*html*//*`
        <div class="subtasks-add-box subtask-input p-right-8px">
            <div class="p-left-8px"><input id="add-new-subtask" class="add-new-subtask" type="text" placeholder="Add new task..."></div>
            <div onclick="addNewSubtask()" class="size-16px flex justify-content-center click-item clickable"><img src="../assets/icons/close.svg" alt=""></div>
            <div class="divider set-height-60"></div>
            <div onclick="pushNewSubtask()" class="size-16px flex justify-content-center click-item mg-left-8px clickable"><img class="filter-color-to-black" src="../assets/icons/check.svg" alt=""></div>
        </div>
    `;
}*/

function removeSubtask(index) {
    subtasks.splice(index, 1);
    displaySubtasks();
}

function saveSubtaskEdit(index) {
    let subtaskInput = document.getElementById(`added-subtask-input${index}`).value;
    if(subtaskInput !== "") subtasks[index].Description = subtaskInput;
    displaySubtasks();
}

/*
function editSubtask(element,index) {
    let edit = document.querySelector(`.added-subtask${index}`);
    edit.classList.remove('hide-added-subtasks-item-children');
    edit.innerHTML = /*html*//*`
        <li class="p-left-8px"><input class="input-subtask" id="added-subtask-input${index}" type="text" placeholder="${element}"></li>  
        <div class="display-subtasks-mask">
            <div onclick="saveSubtaskEdit(${index})" class="flex justify-content-center">
                <img class="filter-color-to-black" src="../assets/icons/check.svg" alt="">
            </div>
            <div class="divider"></div>
            <div onclick="removeSubtask(${index})" class="flex justify-content-center">${trashSVG()}</div>
        </div>
    `;
}

export function getDisplaySubtaskMask(element, index) {
    return /*html*//*`
        <div class="added-subtasks-item hide-added-subtasks-item-children added-subtask${index}">
            <li class="p-left-8px">${element.Description}</li>
            <div class="display-subtasks-mask">
                <div onclick="editSubtask('${element.Description}', ${index})" class="flex justify-content-center">${editSVG()}</div>
                <div class="divider"></div>
                <div onclick="removeSubtask(${index})" class="flex justify-content-center">${trashSVG()}</div>
            </div>
        </div> 
    `;
}*/

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
    console.log(tasks);
    
    tasks.push(getTaskInfos());            
    putData(TASKS_DIR, tasks);
    //window.location = "../html/boards.html";
    
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
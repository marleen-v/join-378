import { getInputForm, getCategory, getUserIcon, getSubtaskInput, getSubtaskMask, editSubtask, getDisplaySubtaskMask } from './add-task-template.js';
import { getUrgentSVG, getMediumSVG, getLowSVG, checkedBoxSVG, uncheckedBoxSVG } from "./svg-template.js";
import { loadActiveUser, loadData } from "./module.js";

let priority = "medium";
let toggleContactList = false, toggleCategory = false, toggleSubtask = false;
let subtasks = [];
let addedUser = [];
let tasks = [];


/**
 * Load function which load data from firebase and display add task
 * form to screen
 *
 * @async
 * @returns {*}
 */
async function loadAddTask() {
    tasksFromFirebase = await loadData(TASKS_DIR);
    contactsFromFirebase = await loadData(CONTACTS_DIR);
    activeUser = await loadActiveUser(ACTIVE_DIR);
    console.log(activeUser);
    
    document.querySelector('main').innerHTML = getInputForm();
    setBgColor('medium');
    getLogo();
}


/**
 * Function which search contacts to find contact right contact informations
 *
 * @export
 * @param {*} data
 * @param {*} searchString
 * @returns {boolean}
 */
export function findPersons(data, searchString) {
    for (let index = 0; index < data.length; index++) {
        if (data[index].email === searchString) return true;
    }
    return false;
}


/**
 * Function which return a template to display user informations
 * just display initials in a circle
 *
 * @param {*} element
 * @param {*} index
 * @returns {string}
 */
function addUserItem(element, index) {
    let selectBox = "";
    if(findPersons(addedUser, element.email)) selectBox = checkedBoxSVG()
    else selectBox = uncheckedBoxSVG();
    return /*html*/`
        <div class="task-user-select grid grid-columns-3-48px-1fr-48px selection" onclick="addUser(${index})">
            <span class="circle ${element.color} flex justify-content-center align-items-center set-width-height-42"><span>${element.initials}</span></span> 
            <span class="username${index} flex align-items-center">${element.firstName} ${element.lastName}</span>
            <div class="flex align-items-center">${selectBox}</div>
        </div>
    `;
}


/**
 * Function which remove unchecked user when checked box is clicked
 *
 * @param {*} data
 * @param {*} elementToRemove
 * @returns {*}
 */
function removePerson(data, elementToRemove) {
    data.forEach((item, index) => {
        if (item.email === elementToRemove) {
            data.splice(index, 1);
        }
    });
    return data;
}


/** Function which display all added user informations */
function displayAddedUser() {
    document.querySelector('.display-assigned-user').innerHTML = "";
    addedUser.forEach(element => {
        document.querySelector('.display-assigned-user').innerHTML += getUserIcon(element);
    });
}

/**
 * Function which add user into a list and call displayAddedUser for displaying
 *
 * @param {*} index
 */
function addUser(index) {    
    if (!findPersons(addedUser, contactsFromFirebase[index].email)) {
        addedUser.push(contactsFromFirebase[index]); 
    }
    else {
        removePerson(addedUser, contactsFromFirebase[index].email);
    }
    displayAddedUser();
    openContacts();
}


/**
 * Help function to compare active user to show which user is active
 *
 * @param {*} element
 * @returns {boolean}
 */
export function getActiveUser(element) {   
    if(element.email === activeUser[0].email) return true;
    return false;
}


/**
 * Function which highlight active user
 *
 * @export
 * @param {*} element
 */
export function highlightActiveUser(user, highlight) {    
    let parent =  document.querySelector(user).parentNode;
    if (highlight)  { 
        parent.classList.add('set-bg-dark-blue');
        parent.querySelector('div > svg').classList.add('filter-color-to-white');
    }
    else {
        parent.classList.remove('set-bg-dark-blue');
        parent.querySelector('div > svg').classList.remove('filter-color-to-white');
    }
}


/** Function which generate all contacts in a contact select box for adding user */
function openContacts() {
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "|";
    let persons = document.querySelector('.select-box-contacts');
+   persons.classList.add('bg-white');
    persons.classList.add('set-z-index-100');
    persons.innerHTML = "";
    
    contactsFromFirebase.forEach((element, index) => {
        persons.innerHTML += addUserItem(element, index);
        if(getActiveUser(element)) {
            highlightActiveUser(`.username${index}`, true);
            document.querySelector(`.username${index}`).innerHTML = `${element.firstName} ${element.lastName} (you)`;
        }
        else highlightActiveUser(`.username${index}`, false);
    });
    document.getElementById('contacts-toggle-img').style.transform = "rotate(180deg)";

}


/** Function which close contact select box */
function closeContacts() {
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "Select contacts to assign";
    let persons = document.querySelector('.select-box-contacts');
    persons.classList.remove('bg-white');
    persons.classList.remove('set-z-index-100');
    persons.innerHTML = "";
    document.getElementById('contacts-toggle-img').style.transform = "rotate(0deg)";
}

/** Function which open and close contact select box */
async function addContact() {
    contactsFromFirebase = await loadData(CONTACTS_DIR);
    toggleContactList = !toggleContactList;
    if (toggleContactList) {
        openContacts();
    }
    else {
        closeContacts();
    }
}


/**
 * Function which set user contact background color of initals circle
 *
 * @param {*} element
 */
function setBgColor(element) {
    let div = document.querySelector(`#${element}`);

    switch (element) {
        case 'urgent': div.classList.add('set-bg-red'); break;
        case 'medium': div.classList.add('set-bg-orange'); break;
        case 'low': div.classList.add('set-bg-green'); break;
    }
    div.querySelector('svg').classList.add('filter-color-to-white');

}


/**
 * Function which remove all priority button colors
 *
 * @param {*} element
 */
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

/**
 * Function which set clicked button with current selected color
 * Urgent: red
 * Medium: orange
 * Low: green
 *
 * @export
 * @param {*} element
 * @param {*} task
 */
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


/**
 * Function to set priority
 *
 * @param {*} prio
 */
export function setPriority(prio) {
    priority = prio;
    removePriorityColor('.task-form-container');
    setBgColor(prio);
}

/**
 * Function to add task category
 * Categories are: User Story | Technical Task
 *
 * @param {*} cat
 */
function addCategory(cat) {
    document.querySelector('#category-input').value = cat;
    chooseCategory();
}


/** Function to open category select box and to rotate select triangle */
function openCategory() {
    let category = document.querySelector('.add-category');
    category.classList.add('bg-white');
    category.classList.add('set-z-index-100');
    document.getElementById('category-toggle-img').style.transform = "rotate(180deg)";
}

/** Function to close category select box and restore select triangle */
function closeCategory() {
    let category = document.querySelector('.add-category');
    category.classList.remove('bg-white');
    category.classList.remove('set-z-index-100');
    document.getElementById('category-toggle-img').style.transform = "rotate(0deg)";
}


/** Toggle help function to open or close category select box */
function chooseCategory() {
    toggleCategory = !toggleCategory;
    let category = document.querySelector('.add-category');
    category.innerHTML = (toggleCategory) ? getCategory() : "";
    (toggleCategory) ? openCategory() : closeCategory();
}


/**
 * Function to remove added subtasks
 *
 * @param {*} index
 */
function removeSubtask(index) {
    subtasks.splice(index, 1);
    displaySubtasks();
}

/**
 * Function to save added subtasks
 *
 * @param {*} index
 */
function saveSubtaskEdit(index) {
    let subtaskInput = document.getElementById(`added-subtask-input${index}`).value;
    if(subtaskInput !== "") subtasks[index].Description = subtaskInput;
    displaySubtasks();
}


/**
 * Function to display added subtasks
 *
 * @export
 */
function displaySubtasks() {
    let subtaskDisplay = document.querySelector('.added-subtasks');
    subtaskDisplay.innerHTML = "";
    
    if(subtasks.length < 1) subtaskDisplay.innerHTML = "";
    else {
        subtasks.forEach((element, index) => {
            subtaskDisplay.innerHTML += getDisplaySubtaskMask(element, index); 
        });
    }
}

/** Function which push added subtasks into a temporary list and 
 * to show added subtasks
 */
function pushNewSubtask() {
    let input = document.querySelector('#add-new-subtask').value;
    if(input !== "") {
        let subtask =  { Description: input, Done: false };    
        subtasks.push(subtask);  
        displaySubtasks('add-task', -1);
    } 
    document.querySelector('.add-new-subtask-box').innerHTML = getSubtaskMask();    
}


/** Event listener which add new subtask when user type in and pressed enter key */
function pushNewSubtaskOnPressedEnter() {
    if(document.getElementById('add-new-subtask')) 
        document.getElementById('add-new-subtask').addEventListener("keypress", event => { if(event.key == "Enter") pushNewSubtask(); });
}


/** Toggle Function which open or close subtask input field */
function addNewSubtask() {
    toggleSubtask = !toggleSubtask;
    let subtask = document.querySelector('.add-new-subtask-box');
    subtask.innerHTML = (toggleSubtask) ? getSubtaskInput() : getSubtaskMask();
    pushNewSubtaskOnPressedEnter();
}

/** Clear button which clear all inputs in add task form */
function clearButton() {
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('due-date').value = "";
    document.getElementById('category-input').value = "";
    document.querySelector('.display-assigned-user').innerHTML = "";
    if(document.querySelector('.added-subtasks-item')) document.querySelector('.added-subtasks-item').innerHTML = "";
    subtasks = [];
    addedUser = [];
    setPriority("medium");
}


/**
 * Function which collect all input values into JSON format and return JSON data
 *
 * @returns {{ id: any; Column: string; Title: any; Description: any; Date: any; Priority: any; Category: any; Subtasks: {}; Persons: {}; }}
 */
function getTaskInfos(column) {
    let persons = [];
    addedUser.forEach(element => { persons.push(element.firstName + " " + element.lastName) });
    return {
        "id": tasksFromFirebase.length,
        "Column": column,
        "Title": document.getElementById('title').value,
        "Description": document.getElementById('description').value,
        "Date": document.getElementById('due-date').value,
        "Priority": priority.charAt(0).toUpperCase() + priority.slice(1),
        "Category": document.getElementById('category-input').value,
        "Subtasks": subtasks,
        "Persons": persons,
      };      
}


/** Function which put all data into firebase and call board */
async function createNewTask(column) {          
    tasksFromFirebase = await loadData(TASKS_DIR); 
    tasksFromFirebase.push(getTaskInfos(column));            
    putData(TASKS_DIR, tasksFromFirebase);
    
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
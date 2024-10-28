import { getContacts, highlightActiveUser, setPriorityColor } from "./add-task.js";
import { setDetailedCard } from "./boards-overlay.js";
import { tasks, setUserInitial, activeUser } from "./boards.js";
import { getDetailedEditableCard, getDisplaySubtaskMask, editCardSubtask, getSubtaskInput, addLinkedItem } from './boards-edit-template.js';
import { getDetailedCard } from "./boards-overlay-template.js";
import { checkedBoxSVG, uncheckedBoxSVG } from "./svg-template.js";
import { putData } from "./module.js";
let toggleContactList = false;
let formData = [];
let contacts = [];

/**
 * Help Function to generate string ID into numbered id
 *
 * @export
 * @param {*} taskId
 * @returns {*}
 */
export function parseTaskIdToNumberId(taskId) {
    let splitId = taskId.split('taskId');
    return parseInt(splitId[1]);
}

/**
 * Function which set editable task card and display into overlayed screen
 *
 * @export
 * @param {*} taskId
 */
export function setDetailedEditableCard(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let detailedCard = document.querySelector('.detailed-card');
    
    if(formData.length < 1) {
        detailedCard.querySelector('.input-edit-headline').value = tasks[id].Title;
        detailedCard.querySelector('.textarea-edit-description').innerHTML = tasks[id].Description;
        detailedCard.querySelector('.due-date').value = tasks[id].Date;
    }
    else updateFormData();
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(tasks[id], true, true);
    setPriorityColor(".detailed-card", tasks[id]);
    if(tasks[id].Subtasks != null) displayCardSubtasks(tasks[id].Subtasks, id);
}

/**
 * Function which select priority it displayed as three buttons
 * Urgent   |   Medium      |   Low
 *
 * @param {*} taskId
 * @param {*} priority
 */
function selectPriority(taskId, priority) {
    let id = parseTaskIdToNumberId(taskId);
    tasks[id].Priority = priority;
    document.querySelector('.overlay').innerHTML = getDetailedEditableCard(taskId);
    setDetailedEditableCard(taskId);
    updateFormData(formData);
}

/**
 * Function to close editable task card -> button
 * it retruns to first detailed task card
 *
 * @param {*} taskId
 */
function cancelEdit(taskId) {
    let overlay = document.querySelector('.overlay');
    overlay.innerHTML = getDetailedCard(taskId);
    let id = parseTaskIdToNumberId(taskId);
    setDetailedCard(id);
}

/** Function which update all user changes of editable task card */
function updateFormData() {
    document.querySelector('#input-edit-headline').value = formData[0];
    document.querySelector('#textarea-edit-description').value = formData[1];
    document.querySelector('#due-date').value = formData[2];
}

/** Function which save all user changes of editable task card  */
function getFormData() {
    formData = [];
    formData.push(document.querySelector('#input-edit-headline').value);
    formData.push(document.querySelector('#textarea-edit-description').value);
    formData.push(document.querySelector('#due-date').value);    
}


/**
 * Function which close editable task card but store all informations into
 * firebase
 *
 * @param {*} taskId
 */
function closeEdit(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    getFormData();
    tasks[id].Title = formData[0];
    tasks[id].Description = formData[1];
    tasks[id].Date = formData[2];
    putData(TASKS_DIR, tasks);
    document.querySelector('.overlay').innerHTML = getDetailedCard(taskId);
    setDetailedCard(id);
}


/**
 * Help function to find contact persons
 *
 * @param {*} data
 * @param {*} searchString
 * @returns {boolean}
 */
function findPersons(data, searchString) {
    if(data == null) return false;
    for (let index = 0; index < data.length; index++) {
        if (data[index] === searchString) return true;
    }
    return false;
}

/**
 * Function to remove added contacts
 *
 * @param {*} data
 * @param {*} elementToRemove
 * @returns {*}
 */
function removePerson(data, elementToRemove) {
    data.forEach((item, index) => {
        if (item === elementToRemove) {
            data.splice(index, 1);
        }
    });
    return data;
}


/**
 * Function to check or uncheck selected contacts
 *
 * @export
 * @param {*} element
 * @param {*} taskId
 * @returns {*}
 */
export function isChecked(element, taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let person = element.firstName + " " + element.lastName;
    if (findPersons(tasks[id].Persons, person)) return checkedBoxSVG();
    return uncheckedBoxSVG();
}

/**
 * Function which open or close contact select box
 *
 * @param {*} index
 * @param {*} taskId
 */
function chooseContact(index, taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let person = contacts[index].firstName + " " + contacts[index].lastName;
    if (!findPersons(tasks[id].Persons, person)) {
        if(tasks[id].Persons == null) tasks[id]['Persons'] = [person];
        else tasks[id].Persons.push(person);
        openContactSelectBox(taskId);
    }
    else {
        removePerson(tasks[id].Persons, person);
        openContactSelectBox(taskId);
    }
}

/**
 * Help function to compare all contacts with active user
 *
 * @export
 * @param {*} element
 * @returns {boolean}
 */
export function getActiveUser(element) {
    if (element.email === activeUser.email) return true;
    return false;
}


/**
 * Function to focus contact select box because sometimes by scrolling
 * it will scrolling task card body and not select box body
 *
 * @param {*} active
 */
function focusUserSelectBox(active) {
    let container = document.querySelector('.detailed-card-editable-container');
    if (active) {
        container.classList.remove('auto-overflow-y');
        container.classList.add('hidden-overflow-y');
        container.scrollTo(0, 100);
    }
    else {
        container.classList.add('auto-overflow-y');
        container.classList.remove('hidden-overflow-y');
    }
}


/**
 * Open contact select box for selecting contacts into task card
 *
 * @param {*} taskId
 */
function openContactSelectBox(taskId) {
    focusUserSelectBox(true);
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "|";
    let persons = document.querySelector('.add-task-card-persons');
    persons.classList.add('set-height-140px');
    console.log(contacts);
    
    persons.innerHTML = "";
    contacts.forEach((element, index) => {
        persons.innerHTML += addLinkedItem(element, index, taskId);
        if(getActiveUser(element)) {
            highlightActiveUser(true);
            document.querySelector(`.username${index}`).innerHTML = `${element.firstName} ${element.lastName} (you)`;
        }
    });
}


/**
 * Function to close contact select box
 *
 * @param {*} taskId
 */
function closeContactSelectBox(taskId) {
    focusUserSelectBox(false);
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "Select contacts to assign";
    let persons = document.querySelector('.add-task-card-persons');
    persons.classList.remove('set-height-140px');
    persons.innerHTML = "";
    setDetailedEditableCard(taskId);
}


/**
 * Toggle function for open or close contact select box
 *
 * @param {*} taskId
 */
async function assignContact(taskId) {
    toggleContactList = !toggleContactList;
    if (toggleContactList) {
        contacts = await getContacts();
        openContactSelectBox(taskId);
        document.getElementById('assign-to-toggle-icon').style.transform = "rotate(180deg)";
    }
    else {
        closeContactSelectBox(taskId);
        document.getElementById('assign-to-toggle-icon').style.transform = "rotate(0deg)";        
    }

}

/**
 * Template for subtasks without -> input field
 *
 * @export
 * @param {*} taskId
 * @returns {string}
 */
export function getSubtaskMask(taskId) {
    return /*html*/`
        <div onclick="addSubtask('${taskId}')" class="subtasks-add-box p-right-8px clickable">
            <span class="mg-left-8px">Add new subtask</span>
            <img class="click-item size-16px" src="../assets/icons/subtasks_plus.svg" alt="">
        </div>
    `;
}

/**
 * Function to push subtask into list and show on task card
 *
 * @param {*} taskId
 */
function pushSubtask(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let input = document.querySelector('#add-new-subtask').value;
    if (input == "") { cancelSubtask(); return; }
    if (tasks[id].Subtasks) tasks[id].Subtasks.push({ "Description": input, "Done": false });
    else tasks[id]["Subtasks"] = [{ "Description": input, "Done": false }];
    document.querySelector('.detailed-task-card-subtasks').innerHTML = getSubtaskMask(taskId);
    displayCardSubtasks(tasks[id].Subtasks, id, 'boards');
}


/** Function to cancel subtask box -> button*/
function cancelSubtask() {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskMask();
}

/**
 * Function for add subtask -> button
 *
 * @param {*} taskId
 */
function addSubtask(taskId) {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskInput(taskId);
}


/**
 * Function for remove subtask -> button
 *
 * @param {*} taskId
 * @param {*} index
 */
function removeCardSubtask(taskId,index) {           
    tasks[taskId].Subtasks.splice(index, 1);
    putData(TASKS_DIR, tasks);
    displayCardSubtasks(tasks[taskId].Subtasks, taskId);
}

/**
 * Function for save added subtask -> button
 *
 * @param {*} taskId
 * @param {*} index
 */
function saveSubtaskCardEdit(taskId, index) {
    let subtaskInput = document.getElementById(`added-subtask-input${index}`).value;
    if(tasks[taskId].Subtasks == null) tasksArray[taskId].Subtasks = [{Description: subtaskInput, Done: false }];
    else if(subtaskInput !== "") tasks[taskId].Subtasks[index].Description = subtaskInput;
    putData(TASKS_DIR, tasks);
    displayCardSubtasks(tasks[taskId].Subtasks, taskId);
}


/**
 * Function for display all added or not added subtasks
 *
 * @param {*} subtasks
 * @param {*} id
 */
function displayCardSubtasks(subtasks, id) {
    let subtaskDisplay = document.querySelector('.added-subtasks');
    subtaskDisplay.innerHTML = "";
    
    subtasks.forEach((element, index) => {
        subtaskDisplay.innerHTML += getDisplaySubtaskMask(element, id, index);
    });
}


window.selectPriority = selectPriority;
window.closeEdit = closeEdit;
window.assignContact = assignContact;
window.chooseContact = chooseContact;
window.addSubtask = addSubtask;
window.cancelSubtask = cancelSubtask;
window.pushSubtask = pushSubtask;
window.cancelEdit = cancelEdit;
window.displayCardSubtasks = displayCardSubtasks;
window.saveSubtaskCardEdit = saveSubtaskCardEdit;
window.removeCardSubtask = removeCardSubtask;
window. editCardSubtask = editCardSubtask;
window.getFormData = getFormData;

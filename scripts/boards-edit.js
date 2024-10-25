import { setPriorityColor } from "./add-task.js";
import { setDetailedCard } from "./boards-overlay.js";
import { tasks, setUserInitial, contacts, activeUser } from "./boards.js";
import { getDetailedEditableCard, getDisplaySubtaskMask, editCardSubtask, getSubtaskInput, addLinkedItem } from './boards-edit-template.js';
import { getDetailedCard } from "./boards-overlay-template.js";
import { checkedBoxSVG, uncheckedBoxSVG } from "./svg-template.js";
let toggleContactList = false;

export function parseTaskIdToNumberId(taskId) {
    let splitId = taskId.split('taskId');
    return parseInt(splitId[1]);
}

export function setDetailedEditableCard(taskId) {
    let id = parseTaskIdToNumberId(taskId);

    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.querySelector('.input-edit-headline').value = tasks[id].Title;
    detailedCard.querySelector('.textarea-edit-description').innerHTML = tasks[id].Description;
    detailedCard.querySelector('.due-date').value = tasks[id].Date;
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(tasks[id], true, true);
    setPriorityColor(".detailed-card", tasks[id]);
    if(tasks[id].Subtasks != null) displayCardSubtasks(tasks[id].Subtasks, id);
}

function selectPriority(taskId, priority) {
    let id = parseTaskIdToNumberId(taskId);
    let formData = getFormData();

    tasks[id].Priority = priority;
    document.querySelector('.overlay').innerHTML = getDetailedEditableCard(taskId);
    updateFormData(formData);
    setDetailedEditableCard(taskId);

}

function cancelEdit(taskId) {
    let overlay = document.querySelector('.overlay');
    overlay.innerHTML = getDetailedCard(taskId);
    let id = parseTaskIdToNumberId(taskId);
    setDetailedCard(id);
}

function updateFormData(formData) {
    document.querySelector('#input-edit-headline').value = formData[0];
    document.querySelector('#textarea-edit-description').value = formData[1];
    document.querySelector('#due-date').value = formData[2];
}

function getFormData() {
    let formData = [];
    formData.push(document.querySelector('#input-edit-headline').value);
    formData.push(document.querySelector('#textarea-edit-description').value);
    formData.push(document.querySelector('#due-date').value);
    return formData;
}

function closeEdit(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let formData = getFormData();
    tasks[id].Title = formData[0];
    tasks[id].Description = formData[1];
    tasks[id].Date = formData[2];
    putData(TASKS_DIR, tasks);
    document.querySelector('.overlay').innerHTML = getDetailedCard(taskId);
    setDetailedCard(id);
}


function findPersons(data, searchString) {
    for (let index = 0; index < data.length; index++) {
        if (data[index] === searchString) return true;
    }
    return false;
}

function removePerson(data, elementToRemove) {
    data.forEach((item, index) => {
        if (item === elementToRemove) {
            data.splice(index, 1);
        }
    });
    return data;
}


export function isChecked(element, taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let person = element.firstName + " " + element.lastName;
    if (findPersons(tasks[id].Persons, person)) return checkedBoxSVG();
    return uncheckedBoxSVG();
}

function chooseContact(index, taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let person = contacts[index].firstName + " " + contacts[index].lastName;
    if (!findPersons(tasks[id].Persons, person)) {
        tasks[id].Persons.push(person);
        openContactSelectBox(taskId);
    }
    else {
        removePerson(tasks[id].Persons, person);
        openContactSelectBox(taskId);
    }
}

export function getActiveUser(element) {
    if (element.email === activeUser.email) return true;
    return false;
}


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


function openContactSelectBox(taskId) {
    focusUserSelectBox(true);
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "|";
    let persons = document.querySelector('.add-task-card-persons');
    persons.classList.add('set-height-140px');
    persons.innerHTML = "";
    contacts.forEach((element, index) => {
        persons.innerHTML += addLinkedItem(element, index, taskId);
        if (getActiveUser(element)) document.querySelector('.task-user-select').classList.add('set-bg-dark-blue');
        else document.querySelector('.task-user-select').classList.remove('set-bg-dark-blue');
    });
}


function closeContactSelectBox(taskId) {
    focusUserSelectBox(false);
    let assignBox = document.querySelector('.assign-to-select-box > span');
    assignBox.innerHTML = "Select contacts to assign";
    let persons = document.querySelector('.add-task-card-persons');
    persons.classList.remove('set-height-140px');
    persons.innerHTML = "";
    setDetailedEditableCard(taskId);
}


function assignContact(taskId) {
    toggleContactList = !toggleContactList;
    if (toggleContactList) {
        openContactSelectBox(taskId);
        document.getElementById('assign-to-toggle-icon').style.transform = "rotate(180deg)";
    }
    else {
        closeContactSelectBox(taskId);
        document.getElementById('assign-to-toggle-icon').style.transform = "rotate(0deg)";
    }
}

export function getSubtaskMask(taskId) {
    return /*html*/`
        <div onclick="addSubtask('${taskId}')" class="subtasks-add-box p-right-8px clickable">
            <span class="mg-left-8px">Add new subtask</span>
            <img class="click-item size-16px" src="../assets/icons/subtasks_plus.svg" alt="">
        </div>
    `;
}

function pushSubtask(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    let input = document.querySelector('#add-new-subtask').value;
    if (input == "") { cancelSubtask(); return; }
    if (tasks[id].Subtasks) tasks[id].Subtasks.push({ "Description": input, "Done": false });
    else tasks[id]["Subtasks"] = [{ "Description": input, "Done": false }];
    document.querySelector('.detailed-task-card-subtasks').innerHTML = getSubtaskMask(taskId);
    displayCardSubtasks(tasks[id].Subtasks, id, 'boards');
}


function cancelSubtask() {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskMask();
}

function addSubtask(taskId) {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskInput(taskId);
}


function removeCardSubtask(taskId,index) {           
    tasks[taskId].Subtasks.splice(index, 1);
    putData(TASKS_DIR, tasks);
    displayCardSubtasks(tasks[taskId].Subtasks, taskId);
}

function saveSubtaskCardEdit(taskId, index) {
    let subtaskInput = document.getElementById(`added-subtask-input${index}`).value;
    if(tasks[taskId].Subtasks == null) tasksArray[taskId].Subtasks = [{Description: subtaskInput, Done: false }];
    else if(subtaskInput !== "") tasks[taskId].Subtasks[index].Description = subtaskInput;
    putData(TASKS_DIR, tasks);
    displayCardSubtasks(tasks[taskId].Subtasks, taskId);
}


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

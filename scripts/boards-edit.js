import { getPriority, setPriorityColor } from "./add-task.js";
import { getCloseSVG, closeOverlay, getDetailedCard, setDetailedCard, uncheckedBoxSVG, checkedBoxSVG } from "./boards-overlay.js";
import { tasks, setUserInitial, contacts, getUserColor, activeUser } from "./boards.js";
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
}

function selectPriority(taskId, priority) {
    let id = parseTaskIdToNumberId(taskId);

    tasks[id].Priority = priority;
    document.querySelector('.overlay').innerHTML = getDetailedEditableCard(taskId);
    setDetailedEditableCard(taskId);

}

function cancelEdit(taskId) {
    let overlay = document.querySelector('.overlay');
    overlay.innerHTML = getDetailedCard(taskId);
    let id = parseTaskIdToNumberId(taskId);
    setDetailedCard(id);
}

function closeEdit(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    tasks[id].Title = document.querySelector('#input-edit-headline').value;
    tasks[id].Description = document.querySelector('#textarea-edit-description').value;
    tasks[id].Date = document.querySelector('#due-date').value;
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


function isChecked(element, taskId) {
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

function getActiveUser(element) {
    if (element.email === activeUser.email) return true;
    return false;
}

function addLinkedItem(element, index, taskId) {
    let color = getUserColor(element.firstName, element.lastName);
    let id = parseTaskIdToNumberId(taskId);
    let selectBox = isChecked(element, taskId);
    let active = (getActiveUser(element)) ? " (you)" : "";
    return /*html*/`
        <div class="task-user-select grid grid-columns-3-48px-1fr-48px clickable" onclick="chooseContact(${index}, '${taskId}')">
            <span class="circle ${color} flex justify-content-center align-items-center set-width-height-42"><span>${element.initials}</span></span> 
            <span class="flex align-items-center">${element.firstName} ${element.lastName}${active}</span>
            <div class="flex align-items-center">${selectBox}</div>
        </div>
    `;
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
    }
    else {
        closeContactSelectBox(taskId);
    }
}

function getSubtaskMask(taskId) {
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
    if (input == "") return;
    if (tasks[id].Subtasks) tasks[id].Subtasks.push({ "Description": input, "Done": false });
    else tasks[id]["Subtasks"] = [{ "Description": input, "Done": false }];
    document.querySelector('.detailed-task-card-subtasks').innerHTML = getSubtaskMask(taskId);
}


function getSubtaskInput(taskId) {
    return /*html*/`
        <div class="subtasks-add-box subtask-input p-right-8px">
            <div class="p-left-8px"><input id="add-new-subtask" class="add-new-subtask" type="text" placeholder="Add new task..."></div>
            <div onclick="cancelSubtask()" class="size-16px flex justify-content-center click-item clickable"><img src="../assets/icons/close.svg" alt=""></div>
            <div class="divider"></div>
            <div onclick="pushSubtask('${taskId}')" class="size-16px flex justify-content-center click-item mg-left-8px clickable"><img class="filter-color-to-black" src="../assets/icons/check.svg" alt=""></div>
        </div>
    `;
}

function cancelSubtask() {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskMask();
}

function addSubtask(taskId) {
    let container = document.querySelector('.detailed-task-card-subtasks');
    container.innerHTML = getSubtaskInput(taskId);
}


export function getDetailedEditableCard(taskId) {
    return /*html*/`
        <section class="detailed-card grid-rows-auto">
            <div class="detailed-card-top">
                <div></div>
                <div onclick="cancelEdit('${taskId}')"class="flex justify-content-center align-items-center detailed-card-close">${getCloseSVG()}</div>
            </div>
            <div class="detailed-card-editable-container grid grid-auto-rows gap-8px auto-overflow-y mg-right-8px">
                <form id="task-edit-form" class="task-edit-form" onsubmit="closeEdit('${taskId}');return false;">
                    <div class="add-task-card-headline grid grid-rows-2 mg-right-8px gap-8px">
                        <span class="input-edit-label detailed-card-label">Title</span>
                        <input id="input-edit-headline" class="input-edit-headline input-border p-left-8px" type="text" required>
                    </div>
                    <div class="grid grid-rows-2 mg-right-8px mg-top-8px">
                        <span class="input-edit-label detailed-card-label">Description</span>
                        <textarea name="" id="textarea-edit-description" class="textarea-edit-description input-border mg-top-8px p-left-8px p-right-8px set-height-100px p-top-8px" required></textarea>
                    </div>
                    <div class="add-task-card-date grid grid-rows-2 mg-top-8px mg-right-8px">
                        <!-- Fälligkeitsdatum -->
                        <span class="input-edit-label detailed-card-label">Due date</span>
                        <input class="due-date p-left-8px p-right-8px mg-top-8px input-border" type="date" id="due-date" name="due_date" required>
                    </div>
                </form>
                <div class="add-task-card-priority grid grid-rows-2 gap-8px align-items-center justify-content-flex-start mg-right-8px">
                    <span class="flex detailed-card-label">Priority</span>
                    <div class="priority-buttons flex">
                    <button class="task-button grid grid-columns-2 clickable" type="button" id="urgent" data-priority="hoch" onclick="selectPriority('${taskId}', 'Urgent')">
                        <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Urgent</span>    
                        <div class="flex align-items-center set-height-100">${getPriority("Urgent")}</div>
                    </button>
                    <button class="task-button grid grid-columns-2 clickable" type="button" id="medium" data-priority="mittel" onclick="selectPriority('${taskId}', 'Medium')">
                        <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Medium</span>    
                        <div class="flex align-items-center set-height-100">${getPriority("Medium")}</div>
                    </button>
                    <button class="task-button grid grid-columns-2 clickable" type="button" id="low" data-priority="niedrig" onclick="selectPriority('${taskId}', 'Low')">
                        <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Low</span>    
                        <div class="flex align-items-center set-height-100">${getPriority("Low")}</div>
                    </button>
                </div>
            </div>
            <div class="grid grid-rows-2 gap-8px mg-right-8px mg-top-8px">
                <span class="detailed-card-label">Assigned to:</span>
                <div class="add-task-card-assigned-to grid grid-rows-2 gap-8px">
                    <div class="assign-to-select-box p-right-8px clickable" onclick="assignContact('${taskId}')">
                        <span class="mg-left-8px">Select contacts to assign</span>
                        <img class="click-item size-16px" src="../assets/icons/arrow_drop_downaa.svg" alt="">
                    </div>
                    <div class="add-task-card-persons grid grid-rows-auto auto-overflow-y set-height-128px"></div>
                </div>
            </div>
            <div class="grid grid-rows-2 gap-8px mg-right-8px">
                <span class="detailed-card-label mg-top-8px">Subtasks</span>
                <div class="detailed-task-card-subtasks flex">
                    ${getSubtaskMask(taskId)}
                </div>
            </div>
            </div>  
            <div class="add-task-card-bottom flex justify-content-flex-end align-items-center mg-right-8px">
                <div class="flex">
                    <button form="task-edit-form" type="submit" class="flex justify-content-center align-items-center btn-ok clickable">
                        <span class="mg-right-8px">Ok</span>
                        <img src="../assets/icons/check.svg" alt="">
                    </button>
                </div>
            </div>
        </section>  
    `;
}

window.selectPriority = selectPriority;
window.closeEdit = closeEdit;
window.assignContact = assignContact;
window.chooseContact = chooseContact;
window.addSubtask = addSubtask;
window.cancelSubtask = cancelSubtask;
window.pushSubtask = pushSubtask;
window.cancelEdit = cancelEdit;

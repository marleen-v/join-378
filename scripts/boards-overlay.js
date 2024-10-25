import { getPriority } from "./add-task.js";
import { parseTaskIdToNumberId, setDetailedEditableCard } from "./boards-edit.js";
import { setBgColor, setUserInitial, tasks, calculateDoneSubtasks, showData } from "./boards.js";
import { checkedBoxSVG, uncheckedBoxSVG } from "./svg-template.js";
import { getDetailedEditableCard } from "./boards-edit-template.js";
import { getDetailedCard } from "./boards-overlay-template.js";


function setOpacity() {
    document.querySelector('.overlay').classList.add('trans-dark-bg-p-50');
}


function unsetOpacity() {
    document.querySelector('.overlay').classList.remove('trans-dark-bg-p-50');
}


function setDate(card, id) {
    const date = new Date(tasks[id].Date);
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedDate = formatter.format(date);
    card.querySelector('.add-task-card-date').innerHTML = "Due date: " + formattedDate;
}


function getOverlay() {
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('d_none');
    overlay.classList.remove('z-index-minus-1');
    overlay.classList.add('z-index-2000');
    return overlay;
}


function checkDone(taskId, index) {
    let id = parseTaskIdToNumberId(taskId);
    tasks[id].Subtasks[index].Done = !tasks[id].Subtasks[index].Done;
    putData(TASKS_DIR, tasks);
    document.querySelector('.overlay').innerHTML = getDetailedCard('taskId' + id);
    setDetailedCard(id);
}


function setSubtasks(detailedCard, id) {
    if(tasks[id].Subtasks == null) return;
    tasks[id].Subtasks.forEach((element, index) => {
        if(element !== "") { 
            if(element.Done == true) detailedCard.querySelector('.add-task-card-subtasks').innerHTML += /*html*/`
                <div onclick="checkDone('taskId${id}', ${index})" class="grid grid-columns-2-32px-1fr align-items-center"><div class="clickable">${checkedBoxSVG()}</div><div class="flex align-items-center">${element.Description}</div></div>
            `;
            else detailedCard.querySelector('.add-task-card-subtasks').innerHTML += /*html*/`
                <div onclick="checkDone('taskId${id}', ${index})" class="grid grid-columns-2-32px-1fr align-items-center"><div class="clickable">${uncheckedBoxSVG()}</div><div class="flex align-items-center">${element.Description}</div></div>
            `;
        }
    });
}


export function setDetailedCard(id) {
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.querySelector('.add-task-card-category').innerHTML = tasks[id].Category;
    setBgColor(detailedCard, tasks[id]);
    detailedCard.querySelector('.add-task-card-headline').innerHTML = tasks[id].Title;
    detailedCard.querySelector('.add-task-card-description').innerHTML = tasks[id].Description;
    setDate(detailedCard, id);
    detailedCard.querySelector('.add-task-card-priority').innerHTML = `<div class="mg-right-8px">Priority:</div><div class="mg-right-8px">${tasks[id].Priority}</div><div class="flex align-items-center">${getPriority(tasks[id].Priority)}</div>`;
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(tasks[id], true, true);
    let userIcons = detailedCard.querySelectorAll('.circle');
    userIcons.forEach(element => { element.style.width = "42px"});
    setSubtasks(detailedCard, id);
}


function editTask(taskId) {
    let overlay = document.querySelector('.overlay');
    overlay.innerHTML = getDetailedEditableCard(taskId);
    setDetailedEditableCard(taskId);    
}


function deleteTask(taskId) {    
    for (let i = 0; i < tasks.length; i++) {
        let task = "taskId" + i;
        if (task === taskId) {
            tasks.splice(i, 1);
        }
    }
    tasks.forEach((element, index) => { element.id = index });
    putData(TASKS_DIR, tasks);
    closeOverlay();
    showData(tasks);
}


export function openOverlay(id) {
    let overlay = getOverlay();
    overlay.innerHTML = getDetailedCard('taskId' + id);
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.classList.remove('runOutAnimation');
    detailedCard.classList.add('runInAnimation');
    setDetailedCard(id);
    setOpacity();
}


export function closeOverlay() {
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.classList.add('runOutAnimation');
    detailedCard.classList.remove('runInAnimation');
    setTimeout(() => {
        let overlay = document.querySelector('.overlay');
        overlay.classList.add('d_none');
        overlay.classList.remove('z-index-2000');
        overlay.classList.add('z-index-minus-1');
        unsetOpacity();
        showData(tasks);
    }, "300");
}


window.closeOverlay = closeOverlay;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.checkDone = checkDone;
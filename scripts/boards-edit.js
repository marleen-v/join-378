import { getCloseSVG, closeOverlay } from "./boards-overlay.js";
import { tasks } from "./boards.js";


function parseTaskIdToNumberId(taskId) {
    let splitId = taskId.split('taskId');
    return parseInt(splitId[1]);
}

export function setDetailedEditableCard(taskId) {
    let id = parseTaskIdToNumberId(taskId);

    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.querySelector('.input-edit-headline').value = tasks[id].Title;
    detailedCard.querySelector('.textarea-edit-description').innerHTML = tasks[id].Description;
    detailedCard.querySelector('.due-date').value = tasks[id].Date;
}



export function getDetailedEditableCard(taskId) {
    return /*html*/`
        <section class="detailed-card grid-rows-2">
            <div class="detailed-card-top">
                <div></div>
                <div onclick="closeOverlay()"class="flex justify-content-center align-items-center detailed-card-close">${getCloseSVG()}</div>
            </div>
            <div class="detailed-card-editable-container auto-overflow-y">
            <div class="add-task-card-headline grid grid-rows-2">
                <span class="input-edit-label">Title</span>
                <input id="input-edit-headline" class="input-edit-headline" type="text">
            </div>
            <div class="add-task-card-description grid grid-rows-2">
                <span class="input-edit-label">Description</span>
                <textarea name="" id="textarea-edit-description" class="textarea-edit-description"></textarea>
            </div>
            <div class="add-task-card-date">
            <div>
                <!-- Fälligkeitsdatum -->
                <label class="task-label" for="due-date">Due date</label>
                <input class="due-date" type="date" id="due-date" name="due_date" required="">
              </div>
            </div>
            <div class="add-task-card-priority grid grid-rows-2 align-items-center justify-content-flex-start">
                <span>Priority</span>
                <div class="priority-buttons flex">
                    <button class="task-button clickable" type="button" id="urgent" data-priority="hoch" onclick="selectPriority(this)">Urgent</button>
                    <button class="task-button clickable" type="button" id="medium" data-priority="mittel" onclick="selectPriority(this)">Medium</button>
                    <button class="task-button clickable" type="button" id="low" data-priority="niedrig" onclick="selectPriority(this)">Low</button>
                </div>
              
            </div>
            <div>
                Assigned to:
                <div class="add-task-card-assigned-to">
                    <div class="add-task-card-persons grid align-items-center grid-columns-2-48px-1fr gap-8px mg-top-8px"></div>
                </div>
            </div>
            <div>
                Subtasks
                <div class="detailed-task-card-subtasks add-task-card-subtasks grid align-items-center grid-columns-2-32px-1fr mg-top-8px"></div>
            </div>
            <div class="add-task-card-bottom flex justify-content-flex-end align-items-center">
            </div>
            </div>
        </section>  
    `;
}
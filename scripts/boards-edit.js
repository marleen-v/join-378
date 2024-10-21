import { getCloseSVG, closeOverlay } from "./boards-overlay.js";
import { tasks, setUserInitial } from "./boards.js";


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
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(tasks[id], false);
}



export function getDetailedEditableCard(taskId) {
    return /*html*/`
        <section class="detailed-card grid-rows-2">
            <div class="detailed-card-top">
                <div></div>
                <div onclick="closeOverlay()"class="flex justify-content-center align-items-center detailed-card-close">${getCloseSVG()}</div>
            </div>
            <div class="detailed-card-editable-container grid grid-auto-rows gap-8px auto-overflow-y mg-right-8px">
            <div class="add-task-card-headline grid grid-rows-2 mg-right-8px">
                <span class="input-edit-label">Title</span>
                <input id="input-edit-headline" class="input-edit-headline" type="text">
            </div>
            <div class="add-task-card-description grid grid-rows-2 mg-right-8px">
                <span class="input-edit-label">Description</span>
                <textarea name="" id="textarea-edit-description" class="textarea-edit-description"></textarea>
            </div>
            <div class="add-task-card-date grid grid-rows-2 gap-8px mg-right-8px">
                <!-- Fälligkeitsdatum -->
                <label class="task-label" for="due-date">Due date</label>
                <input class="due-date" type="date" id="due-date" name="due_date" required="">
            </div>
            <div class="add-task-card-priority grid grid-rows-2 gap-8px align-items-center justify-content-flex-start mg-right-8px">
                <span>Priority</span>
                <div class="priority-buttons flex">
                    <button class="task-button clickable" type="button" id="urgent" data-priority="hoch" onclick="selectPriority(this)">Urgent</button>
                    <button class="task-button clickable" type="button" id="medium" data-priority="mittel" onclick="selectPriority(this)">Medium</button>
                    <button class="task-button clickable" type="button" id="low" data-priority="niedrig" onclick="selectPriority(this)">Low</button>
                </div>
              
            </div>
            <div class="grid grid-rows-2 gap-8px mg-right-8px">
                <span>Assigned to:</span>
                <div class="add-task-card-assigned-to grid grid-rows-2 gap-8px clickable">
                    <div class="assign-to-select-box">
                        <span class="mg-left-8px">Select contacts to assign</span>
                        <img src="../assets/icons/arrow_drop_downaa.svg" alt="">
                    </div>
                    <div class="add-task-card-persons flex"></div>
                </div>
            </div>
            <div class="grid grid-rows-2 gap-8px mg-right-8px">
                <span>Subtasks</span>
                <div class="detailed-task-card-subtasks flex">
                    <div class="subtasks-add-box">
                        <span class="mg-left-8px">Add new subtask</span>
                        <img src="../assets/icons/subtasks_plus.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="add-task-card-bottom flex justify-content-flex-end align-items-center mg-right-8px">
            </div>
            </div>
        </section>  
    `;
}
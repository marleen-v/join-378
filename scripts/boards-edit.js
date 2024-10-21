import { getPriority, setPriorityColor } from "./add-task.js";
import { getCloseSVG, closeOverlay, getDetailedCard, setDetailedCard } from "./boards-overlay.js";
import { tasks, setUserInitial } from "./boards.js";


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
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(tasks[id], false);
    setPriorityColor(".detailed-card", id);
}

function selectPriority(taskId, priority) {
    let id = parseTaskIdToNumberId(taskId);

    tasks[id].Priority = priority;
    document.querySelector('.overlay').innerHTML = getDetailedEditableCard(taskId);
    setDetailedEditableCard(taskId);
    
}

function closeEdit(taskId) {
    let id = parseTaskIdToNumberId(taskId);
    document.querySelector('.overlay').innerHTML = getDetailedCard(taskId);
    setDetailedCard(id);
}


export function getDetailedEditableCard(taskId) {
    return /*html*/`
        <section class="detailed-card grid-rows-auto">
            <div class="detailed-card-top">
                <div></div>
                <div onclick="closeOverlay()"class="flex justify-content-center align-items-center detailed-card-close">${getCloseSVG()}</div>
            </div>
            <div class="detailed-card-editable-container grid grid-auto-rows gap-8px auto-overflow-y mg-right-8px">
            <div class="add-task-card-headline grid grid-rows-2 mg-right-8px gap-8px">
                <span class="input-edit-label detailed-card-label">Title</span>
                <input id="input-edit-headline" class="input-edit-headline input-border p-left-8px" type="text">
            </div>
            <div class="grid grid-rows-2 mg-right-8px gap-8px">
                <span class="input-edit-label detailed-card-label">Description</span>
                <textarea name="" id="textarea-edit-description" class="textarea-edit-description input-border p-left-8px p-right-8px set-height-100px p-top-8px"></textarea>
            </div>
            <div class="add-task-card-date grid grid-rows-2 gap-8px mg-right-8px">
                <!-- Fälligkeitsdatum -->
                <span class="input-edit-label detailed-card-label">Due date</span>
                <input class="due-date p-left-8px p-right-8px input-border" type="date" id="due-date" name="due_date" required="">
            </div>
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
            <div class="grid grid-rows-2 gap-8px mg-right-8px">
                <span class="detailed-card-label">Assigned to:</span>
                <div class="add-task-card-assigned-to grid grid-rows-2 gap-8px clickable">
                    <div class="assign-to-select-box">
                        <span class="mg-left-8px">Select contacts to assign</span>
                        <img src="../assets/icons/arrow_drop_downaa.svg" alt="">
                    </div>
                    <div class="add-task-card-persons flex auto-overflow-y"></div>
                </div>
            </div>
            <div class="grid grid-rows-2 gap-8px mg-right-8px">
                <span class="detailed-card-label">Subtasks</span>
                <div class="detailed-task-card-subtasks flex">
                    <div class="subtasks-add-box">
                        <span class="mg-left-8px">Add new subtask</span>
                        <img src="../assets/icons/subtasks_plus.svg" alt="">
                    </div>
                </div>
            </div>
            </div>  
            <div class="add-task-card-bottom flex justify-content-flex-end align-items-center mg-right-8px">
            <div class="flex">
                <button class="flex justify-content-center align-items-center btn-ok clickable" onclick="closeEdit('${taskId}')">
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

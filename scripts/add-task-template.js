import { getPriority } from './add-task.js';
import { getCloseSVG } from './boards-overlay.js';

/**
 * Generate a SVG for low Icon
 *
 * @returns {string}
 */
function getLowSVG() {
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
            <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
        </svg>
    `;
}

export function getInputForm() {
    return /*html*/`
    <section id="add-task" class="add-task">
        <div class="add-task-head flex align-items-center">
            <div class="add-task-headline">
                <h1>Add Task</h1>
            </div>
        </div>
        <div class="task-form-container">
        <form id="create-task-form" class="task-form" onsubmit="createNewTask(); return false;">
            <div class="grid grid-rows-auto gap-32px">
                <div class="add-task-form">
                    <div class="part-1-form">
                        <div>
                            <!-- Titel -->
                            <span>Title<span class="required-star">*</span></span>
                            <input class="task-input" type="text" id="title" name="title" required>
                        </div>
                        <div>
                            <span>Description</span>
                            <textarea class="task-textarea" id="description" name="description" rows="4" placeholder="Enter a description"></textarea>
                        </div>  
                        <div class="select-contact">
                            <span class="detailed-card-label">Assigned to:</span>
                            <div class="add-task-card-assigned-to grid grid-rows-2" >
                                <div class="assign-to-select-box p-right-8px clickable" onclick="addContact()">
                                    <span class="mg-left-8px">Select contacts to assign</span>
                                    <img id="contacts-toggle-img" class="click-item size-16px" src="../assets/icons/arrow_drop_downaa.svg" alt="">
                                </div>
                                <div class="select-box-contacts mg-top-minus-8px"></div>
                            </div>
                            <div class="display-assigned-user"></div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="part-2-form">
                        <div>
                            <!-- Fälligkeitsdatum -->
                            <span>Due date<span class="required-star">*</span></span>
                            <input class="task-input" type="date" id="due-date" name="due_date" required>
                        </div>
                        <div class="select-priority">
                            <span class="flex detailed-card-label">Priority</span>
                            <div class="priority-buttons flex">
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="urgent" data-priority="hoch" onclick="setPriority('urgent')">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Urgent</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Urgent")}</div>
                                </button>
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="medium" data-priority="mittel" onclick="setPriority('medium')">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Medium</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Medium")}</div>
                                </button>
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="low" data-priority="niedrig" onclick="setPriority('low')">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Low</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Low")}</div>
                                </button>
                            </div>
                        </div>
                        <div class="select-category">
                            <span class="mg-top-8px">Category<span class="required-star">*</span></span>

                            <div class="select-category-box p-right-8px clickable" onclick="chooseCategory()">
                                <!--<span class="mg-left-8px">Select category</span>-->
                                <input class="category-input" placeholder="Select category" type="text" id="category-input" name="category-input" required>
                                <img id="category-toggle-img" class="click-item size-16px" src="../assets/icons/arrow_drop_downaa.svg" alt="">
                            </div>
                            
                            <div class="add-category"></div>
                        </div>
                        <div class="add-new-subtask">
                            <span class="mg-top-8px">Subtasks</span>
                            <div class="add-new-subtask-box flex">
                                <div onclick="addNewSubtask()" class="subtasks-add-box p-right-8px clickable">
                                    <span class="mg-left-8px">Add new subtask</span>
                                    <img class="click-item size-16px" src="../assets/icons/subtasks_plus.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-task-form-bottom">
                    <div class="flex required-info"><span class="required-star">*</span><span>This Field is required</span></div>
                    <div></div>
                    <div class="flex justify-content-flex-end">
                        <button onclick="clearButton()" class="flex justify-content-center align-items-center btn-clear mg-right-8px clickable">
                            <span class="mg-right-8px set-font-icon-700">Clear</span>
                            <div class="flex align-items-center">${getCloseSVG()}</div>
                        </button>
                        <button form="create-task-form" type="submit" class="flex justify-content-center align-items-center btn-add-task clickable">
                            <span class="mg-right-8px set-font-icon-700">Create Task</span>
                            <img class="flex align-items-center" src="../assets/icons/check.svg" alt="">
                        </button>
                    </div>
                </div>
            </div>
        </form>
</div>
</section>
    `;
}
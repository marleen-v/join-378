import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";
import { parseTaskIdToNumberId } from "./boards-edit.js";
//import { tasks } from "./boards.js";
import { getCloseSVG } from './boards-overlay.js';

async function loadAddTask() {
    //const htmlContent = await loadHTML('../html/add-task-main.html');
    document.querySelector('main').innerHTML = getInputForm();
    setBgColor('medium');
    /*
    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    */
}

function addTask() {
    console.log("Add");

}


/**
 * Generate a SVG for urgent Icon
 *
 * @returns {string}
 */
function getUrgentSVG() {
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_235867_297)">
                <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
                <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
            </g>
            <defs>
                <clipPath id="clip0_235867_297">
                    <rect width="20" height="14.5098" fill="white" transform="translate(0.748535 0.745117)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}

/**
 * Generate a SVG for medium Icon
 *
 * @returns {string}
 */
function getMediumSVG() {
    return /*html*/`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_235867_4016)">
                <path d="M23.5685 19.1666L8.43151 19.1666C8.18446 19.1666 7.94752 19.0677 7.77283 18.8918C7.59814 18.7158 7.5 18.4772 7.5 18.2283C7.5 17.9795 7.59814 17.7408 7.77283 17.5649C7.94752 17.3889 8.18446 17.29 8.43151 17.29L23.5685 17.29C23.8155 17.29 24.0525 17.3889 24.2272 17.5649C24.4019 17.7408 24.5 17.9795 24.5 18.2283C24.5 18.4772 24.4019 18.7158 24.2272 18.8918C24.0525 19.0677 23.8155 19.1666 23.5685 19.1666Z" fill="#FFA800"/>
                <path d="M23.5685 14.7098L8.43151 14.7098C8.18446 14.7098 7.94752 14.6109 7.77283 14.435C7.59814 14.259 7.5 14.0204 7.5 13.7715C7.5 13.5227 7.59814 13.284 7.77283 13.1081C7.94752 12.9321 8.18446 12.8333 8.43151 12.8333L23.5685 12.8333C23.8155 12.8333 24.0525 12.9321 24.2272 13.1081C24.4019 13.284 24.5 13.5227 24.5 13.7715C24.5 14.0204 24.4019 14.259 24.2272 14.435C24.0525 14.6109 23.8155 14.7098 23.5685 14.7098Z" fill="#FFA800"/>
            </g>
            <defs>
                <clipPath id="clip0_235867_4016">
                <rect width="17" height="6.33333" fill="white" transform="translate(7.5 12.8333)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}


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

export function setPriorityColor(element, id) {
    removePriorityColor(element);

    switch (tasks[id].Priority) {
        case 'Urgent': setBgColor(tasks[id].Priority.toLowerCase()); break;
        case 'Medium': setBgColor(tasks[id].Priority.toLowerCase()); break;
        case 'Low': setBgColor(tasks[id].Priority.toLowerCase()); break;
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
        case 'Urgent': svg = getUrgentSVG(); break;
        case 'Medium': svg = getMediumSVG(); break;
        case 'Low': svg = getLowSVG(); break;
    }
    return svg;
}


function getInputForm() {
    return /*html*/`
    <section id="add-task" class="add-task">
        <div class="add-task-head flex align-items-center">
            <div class="add-task-headline">
                <h1>Add Task</h1>
            </div>
        </div>
        <div class="task-form-container">
        <form id="task-form" class="task-form" onsubmit="addTask()">
            <div class="grid grid-rows-auto gap-64px">
                <div class="grid grid-columns-3-1fr-1px-1fr gap-32px">
                    <div class="grid grid-rows-auto gap-8px">
                        <div>
                            <!-- Titel -->
                            <span>Title</span>
                            <input class="task-input" type="text" id="title" name="title" required>
                        </div>
                        <div>
                            <span>Description</span>
                            <textarea class="task-textarea" id="description" name="description" rows="4" placeholder="Enter a description" required></textarea>
                        </div>  
                        <div class="grid grid-rows-2 gap-8px mg-right-8px mg-top-8px">
                            <span class="detailed-card-label">Assigned to:</span>
                            <div class="add-task-card-assigned-to grid grid-rows-2 gap-8px">
                                <div class="assign-to-select-box p-right-8px clickable">
                                    <span class="mg-left-8px">Select contacts to assign</span>
                                    <img class="click-item size-16px" src="../assets/icons/arrow_drop_downaa.svg" alt="">
                                </div>
                                <div class="add-task-card-persons grid grid-rows-auto auto-overflow-y set-height-128px"></div>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="grid grid-rows-auto gap-8px">
                        <div>
                            <!-- Fälligkeitsdatum -->
                            <span>Due date</span>
                            <input class="task-input" type="date" id="due-date" name="due_date" required>
                        </div>
                        <div class="add-task-card-priority grid grid-rows-2 gap-8px align-items-center justify-content-flex-start mg-right-8px">
                            <span class="flex detailed-card-label">Priority</span>
                            <div class="priority-buttons flex">
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="urgent" data-priority="hoch">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Urgent</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Urgent")}</div>
                                </button>
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="medium" data-priority="mittel">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Medium</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Medium")}</div>
                                </button>
                                <button class="task-button grid grid-columns-2 clickable" type="button" id="low" data-priority="niedrig">
                                    <span class="flex align-items-center set-height-100 justify-content-center set-width-84px">Low</span>    
                                    <div class="flex align-items-center set-height-100">${getPriority("Low")}</div>
                                </button>
                            </div>
                        </div>
                        <div class="add-task-card-assigned-to grid grid-rows-2 gap-8px mg-top-16px">
                            <span class="detailed-card-label mg-top-8px">Category</span>
                                <div class="assign-to-select-box p-right-8px clickable">
                                    <span class="mg-left-8px">Select category</span>
                                    <img class="click-item size-16px" src="../assets/icons/arrow_drop_downaa.svg" alt="">
                                </div>
                                <div class="add-task-card-persons grid grid-rows-auto auto-overflow-y set-height-128px"></div>
                            </div>
                        <div class="grid grid-rows-2 gap-8px mg-right-8px">
                            <span class="detailed-card-label mg-top-8px">Subtasks</span>
                            <div class="detailed-task-card-subtasks flex">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-columns-3-1fr-1px-1fr">
                    <div></div>
                    <div></div>
                    <div class="flex justify-content-flex-end">
                        <button form="task-edit-form" type="submit" class="flex justify-content-center align-items-center btn-clear mg-right-8px clickable">
                            <span class="mg-right-8px set-font-icon-700">Clear</span>
                            <div class="flex align-items-center">${getCloseSVG()}</div>
                        </button>
                        <button form="task-edit-form" type="submit" class="flex justify-content-center align-items-center btn-add-task clickable">
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


function getAddTaskTemplate() {
    return /*html*/`
        <section id="add-task" class="add-task">
            <div class="add-task-head flex align-items-center">
                <div class="add-task-headline">
                    <h1>Add Task</h1>
                </div>
            </div>
            <div class="add-task-main">
                <form id="task-form" class="task-form" onsubmit="addTask()">
                    <!-- Linker und rechter Bereich mit senkrechter Linie -->
                    <div class="form-row">
                        <!-- Linke Seite (Titel und Zuweisen an) -->
                        <div class="left-side">
                            <div>
                                <!-- Titel -->
                                <label class="task-label" for="title">Title</label>
                                <input class="task-input" type="text" id="title" name="title" required>
                            </div>
                            <!-- Beschreibung -->
                            <label class="task-label" for="description">Description</label>
                            <textarea class="task-textarea" id="description" name="description" rows="4" placeholder="Enter a description" required></textarea>
                            <div>
                                <!-- Zuweisen an -->
                                <label class="task-label" for="assigned-to">Assigned to</label>
                                <select class="task-select" id="assigned-to" name="assigned_to" required>
                                    <option value="" disabled selected>Select contacts to assign</option>
                                    <option value="mitarbeiter1">Mitarbeiter 1</option>
                                    <option value="mitarbeiter2">Mitarbeiter 2</option>
                                    <option value="mitarbeiter3">Mitarbeiter 3</option>
                                </select>
                            </div>
                        </div>

                        <!-- Rechte Seite (Fälligkeitsdatum) mit vertikaler Trennung -->
                        <div class="right-side divider-vertical">
                            <div>
                                <!-- Fälligkeitsdatum -->
                                <label class="task-label" for="due-date">Due date</label>
                                <input class="task-input" type="date" id="due-date" name="due_date" required>
                            </div>

                            <!-- Priorität als Buttons -->
                            <label>Priority</label>
                            <div class="priority-buttons">
                                <button class="task-button clickable" type="button" class="priority-button" id="urgent" data-priority="hoch" onclick="selectPriority(this)">Urgent</button>
                                <button class="task-button clickable" type="button" class="priority-button active" id="medium" data-priority="mittel" onclick="selectPriority(this)">Medium</button>
                                <button class="task-button clickable" type="button" class="priority-button" id="low" data-priority="niedrig" onclick="selectPriority(this)">Low</button>
                            </div>

                            <!-- Kategorie -->
                            <label class="task-label" for="category">Category</label>
                            <select class="task-select" id="category" name="category" required>
                                <option value="" disabled selected>Select task category</option>
                                <option value="entwicklung">Entwicklung</option>
                                <option value="marketing">Marketing</option>
                                <option value="design">Design</option>
                            </select>

                            <!-- Subtasks -->
                            <label class="task-label">Subtasks</label>
                            <div id="subtasks-container">
                                <div class="subtask-container">
                                    <input class="task-input" type="text" name="subtasks[]" placeholder="Add new subtask">
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" onclick="addSubtask()">Weitere Unteraufgabe hinzufügen</button>

                    <!-- Absenden -->
                    <button type="submit">Aufgabe erstellen</button>
                </form>
            </div>
        </section>    
    `;
}




window.loadAddTask = loadAddTask;
window.addTask = addTask;

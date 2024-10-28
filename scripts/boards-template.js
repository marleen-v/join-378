/**
 * Get html structure of task card
 *
 * @param {*} taskId
 * @param {*} element
 * @returns {string}
 */
export function getTaskCard(id, taskId) {    
    return /*html*/`
        <section onclick="openOverlay(${id})" id="${taskId}" class="task-card add-task-card clickable" draggable="true" ondragstart="startDragging('${taskId}')">
            <div class="flex align-items-center add-task-card-top"><div class="flex align-items-center justify-content-center add-task-card-category"></div></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks grid grid-columns-2-1fr-100px align-items-center"></div>
            <div class="add-task-card-bottom grid grid-columns-2">
                <div class="add-task-card-assigned-to flex"></div>
                <div class="add-task-card-priority flex align-items-center justify-content-flex-end"></div>
            </div>
        </section>  
    `;
}


/**
 * Template which returns user initials displayed in circle
 *
 * @export
 * @param {*} element
 * @returns {string}
 */
export function getGroupUserInitials(element) {
    let persons = (element.Persons.length > 9) ? ">9" : element.Persons.length + "P";;
    return /*html*/`
        <span class="circle red flex justify-content-center align-items-center set-width-height-42"><span>${persons}</span></span> 
    `;
}


/**
 * Template which returns user mask
 *
 * @export
 * @param {*} person
 * @param {*} initials
 * @param {*} color
 * @param {*} displayFullname
 * @param {boolean} [grid=false]
 * @returns {string}
 */
export function getUser(person, initials, color, displayFullname, grid = false) {
    let layout = "flex justify-content-center align-items-center set-width-height-42";
    (grid === true) ? layout ="grid grid-columns-2-48px-1fr" : "flex justify-content-center align-items-center set-width-height-42";
    return /*html*/`
         ${(grid) ? '<div class="task-user-select ' + layout + '">' : ''}
            <span class="circle ${color} flex justify-content-center align-items-center set-width-height-42"><span>${initials}</span></span> 
            ${(displayFullname) ? '<span class="flex align-items-center">'+ person + '</span>' : ''}
         ${(grid) ? '</div>' : '' }  
    `;
}


/**
 * Function which calculate progress bar values
 *
 * @param {*} element
 * @returns {number}
 */
function calculateDoneSubtasks(element) {
    let done = 0;
    element.Subtasks.forEach(element => { (element.Done == true) ? done+=1 : done+=0 });
    return done;
}


/**
 * Get progress bar with bootstrap and show if exists subtasks
 *
 * @param {*} element
 * @returns {string}
 */
export function getProgressBar(element) {
    let done = calculateDoneSubtasks(element);
    let procent = (done / element.Subtasks.length) * 100;
    
    return /*html*/`
        <div class="progressbar-container">
            <div class="progressbar" style="width: ${procent}%"></div>
        </div>
        <span class="flex align-items-center">${done}/${element.Subtasks.length} Subtasks</span>
    `
}
/*
    Author: Martin Reifschneider
*/
import { getSubtaskMask } from "./add-task-template.js";
import { closeCategory, closeContacts, toggleCategory, toggleContacts, toggleSubask, toggleSubtaskButton } from "./add-task.js";


function handleSelectContactBox(event) {
    if(event.target.closest('.assign-to-select-box')) return;
    if (!event.target.closest('.task-user-select')) {
        toggleContacts();
        closeContacts();
    }
}

function handleSelectCategoryBox(event) {
    if (!event.target.closest('.select-category-box'))  {
        toggleCategory();
        closeCategory();
    }
}

function handleSelectSubtaskButton(event) {
    if (!event.target.closest('.subtasks-add-box')) {   
        if(toggleSubtaskButton) {          
            let subtask = document.querySelector('.add-new-subtask-box');
            subtask.innerHTML = getSubtaskMask();
            toggleSubask();
        }
    }
}

/**
 * Function for starting event listener that close opened select boxes on add task
 *
 * @export
 */
export function addListener() {  
    const taskForm = document.querySelector('.task-form-container');
    if(taskForm == null) return;
    document.addEventListener("click", (event) => { 
        handleSelectContactBox(event);
        handleSelectCategoryBox(event)
        handleSelectSubtaskButton(event)
    });
}


/**
 * Function for date validation
 *
 * @param {*} d
 * @returns {string}
 */
export function validateDate(d) {
    // Prüfen, ob d ein gültiges Datum ist
    if (!isNaN(d.getTime())) {
        const today = new Date(); // aktuelles Datum

        // Wenn das eingegebene Datum vor dem heutigen Datum liegt
        if (d < today) {
            return "";
        }

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
        const day = String(d.getDate()).padStart(2, '0'); // Tag formatieren
        return `${year}-${month}-${day}`;
    }

    return "";
}



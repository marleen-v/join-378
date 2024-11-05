/*
    Author: Martin Reifschneider
*/
import { getSubtaskMask } from "./add-task-template.js";
import { closeCategory, closeContacts, toggleCategory, toggleContacts, toggleSubask, toggleSubtaskButton } from "./add-task.js";


/**
 * Function to handle select box contacts button auto close if user click outside
 *
 * @param {*} event
 */

function handleSelectContactBox(event) {
    if(event.target.closest('.assign-to-select-box')) return;
    if (!event.target.closest('.task-user-select')) {
        toggleContacts();
        closeContacts();
    }
}

/**
 * Function to handle select box category button auto close if user click outside
 *
 * @param {*} event
 */

function handleSelectCategoryBox(event) {
    if (!event.target.closest('.select-category-box'))  {
        toggleCategory();
        closeCategory();
    }
}

/**
 * Function to handle subtask button auto close if user click outside
 *
 * @param {*} event
 */
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













/*
const documentElement = document;

class EventManager {
    constructor() {
        this.listenersMap = new Map(); // Speichert alle Event-Listener
    }

    /**
     * Fügt einen Event-Listener hinzu und verwaltet ihn
     *
     * @param {HTMLElement} element - Das DOM-Element
     * @param {string} event - Der Event-Typ (z.B. 'click')
     * @param {function} handler - Die Event-Handler-Funktion
     *//*
    addEventListener(element, event, handler) {
        // Hole vorhandene Listener für das Element oder initialisiere leeres Objekt
        const elementListeners = this.listenersMap.get(element) || {};

        // Füge Listener nur hinzu, wenn er noch nicht existiert
        if (!elementListeners[event]) {
            element.addEventListener(event, handler);
            elementListeners[event] = handler;
            this.listenersMap.set(element, elementListeners);
        }
    }

    /**
     * Entfernt einen verwalteten Event-Listener
     *
     * @param {HTMLElement} element - Das DOM-Element
     * @param {string} event - Der Event-Typ (z.B. 'click')
     *//*
    removeEventListener(element, event) {
        const elementListeners = this.listenersMap.get(element);

        // Überprüfe, ob der Listener existiert, und entferne ihn
        if (elementListeners && elementListeners[event]) {
            element.removeEventListener(event, elementListeners[event]);
            delete elementListeners[event];
        }
    }

    /**
     * Entfernt alle Event-Listener für ein bestimmtes Element
     *
     * @param {HTMLElement} element - Das DOM-Element
     *//*
    removeAllListenersForElement(element) {
        const elementListeners = this.listenersMap.get(element);

        // Entferne jeden Listener, der dem Element zugeordnet ist
        if (elementListeners) {
            for (let [event, handler] of Object.entries(elementListeners)) {
                element.removeEventListener(event, handler);
            }
            this.listenersMap.delete(element); // Entfernt das Element aus der Map
        }
    }

    /**
     * Entfernt alle verwalteten Event-Listener für alle Elemente
     *//*
    removeAllListeners() {
        // Iteriere über alle Elemente und entferne alle zugeordneten Listener
        for (let [element, elementListeners] of this.listenersMap.entries()) {
            for (let [event, handler] of Object.entries(elementListeners)) {
                element.removeEventListener(event, handler);
            }
        }
        this.listenersMap.clear(); // Leert die gesamte Map
    }
}

// Beispiel für die Verwendung des EventManagers
const eventManager = new EventManager();

// Beispiel-Handler für spezifische Aktionen
function handleClickOutsideContacts(event) {
    if (!event.target.closest('.assign-to-select-box') && !event.target.closest('.task-user-select')) {
        toggleContacts();
        closeContacts();
    }
}

// Beispiel-Handler für Kategorie-Auswahl
function handleClickOutsideCategory(event) {
    if (!event.target.closest('.select-category-box')) {
        toggleCategory();
        closeCategory();
    }
}

// Hinzufügen der Event-Listener mit dem EventManager
export function addListener() {
    eventManager.addEventListener(documentElement, 'click', handleClickOutsideContacts);
    eventManager.addEventListener(documentElement, 'click', handleClickOutsideCategory);
}
// Entfernen eines spezifischen Listeners (optional)
//eventManager.removeEventListener(documentElement, 'click', handleClickOutsideCategory);

// Entfernen aller Listener von einem Element (optional)
//eventManager.removeAllListenersForElement(documentElement);

// Entfernen aller Listener (optional)
export function removeListener() {
    eventManager.removeAllListeners();
}*/

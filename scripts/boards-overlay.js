import { getPriority } from "./add-task.js";
import { setBgColor, setUserInitial, tasks } from "./boards.js";

let totalTasks = [], doneTasks = [];


export function openOverlay(id) {
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('d_none');
    overlay.classList.remove('z-index-minus-1');
    overlay.classList.add('z-index-2000');
    overlay.innerHTML = getDetailedCard();
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.querySelector('.add-task-card-category').innerHTML = tasks[id].Category;
    setBgColor(detailedCard, tasks[id]);
    detailedCard.querySelector('.add-task-card-headline').innerHTML = tasks[id].Title;
    detailedCard.querySelector('.add-task-card-description').innerHTML = tasks[id].Description;
    const date = new Date(tasks[id].Date);
    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedDate = formatter.format(date);
    detailedCard.querySelector('.add-task-card-date').innerHTML = "Due date: " + formattedDate;
    detailedCard.querySelector('.add-task-card-priority').innerHTML = "Priority: " + tasks[id].Priority + " " + getPriority(tasks[id]);
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(detailedCard, tasks[id], true);
    let userIcons = detailedCard.querySelectorAll('.circle');
    userIcons.forEach(element => { element.style.width = "42px"});
    totalTasks = tasks[id].Subtasks.Total;
    doneTasks = tasks[id].Subtasks.Done;
    tasks[id].Subtasks.Total.forEach((element) => {
        if(element !== "") { 
            if(totalTasks.find(isDone)) detailedCard.querySelector('.add-task-card-subtasks').innerHTML += checkedBoxSVG() + " " + element;
            else detailedCard.querySelector('.add-task-card-subtasks').innerHTML += uncheckedBoxSVG() + " " + element;
        }
    });
}


function getDetailedCard() {
    return /*html*/`
        <section class="detailed-card">
            <div class="detailed-card-top">
                <div class="flex justify-content-center align-items-center add-task-card-category"></div>
                <div onclick="closeOverlay()"class="flex justify-content-center align-items-center detailed-card-close">${getCloseSVG()}</div>
            </div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-date"></div>
            <div class="add-task-card-priority flex align-items-center justify-content-flex-start"></div>
            <div class="add-task-card-assigned-to">Assigned to:
                <div class="add-task-card-persons grid align-items-center grid-columns-2-64px-1fr gap-8px mg-top-8px"></div>
            </div>
            <div>Subtasks
                <div class="add-task-card-subtasks grid align-items-center grid-columns-2-32px-1fr mg-top-8px"></div>
            </div>
            <div class="add-task-card-bottom">
            </div>
           <div></div>
           <div></div>
        </section>  
    `;
}


function getCloseSVG() {
    return /*html*/`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_239190_2246" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
                <rect x="4" y="4" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_239190_2246)">
                <path d="M16 17.4L11.1 22.3C10.9167 22.4834 10.6834 22.575 10.4 22.575C10.1167 22.575 9.88338 22.4834 9.70005 22.3C9.51672 22.1167 9.42505 21.8834 9.42505 21.6C9.42505 21.3167 9.51672 21.0834 9.70005 20.9L14.6 16L9.70005 11.1C9.51672 10.9167 9.42505 10.6834 9.42505 10.4C9.42505 10.1167 9.51672 9.88338 9.70005 9.70005C9.88338 9.51672 10.1167 9.42505 10.4 9.42505C10.6834 9.42505 10.9167 9.51672 11.1 9.70005L16 14.6L20.9 9.70005C21.0834 9.51672 21.3167 9.42505 21.6 9.42505C21.8834 9.42505 22.1167 9.51672 22.3 9.70005C22.4834 9.88338 22.575 10.1167 22.575 10.4C22.575 10.6834 22.4834 10.9167 22.3 11.1L17.4 16L22.3 20.9C22.4834 21.0834 22.575 21.3167 22.575 21.6C22.575 21.8834 22.4834 22.1167 22.3 22.3C22.1167 22.4834 21.8834 22.575 21.6 22.575C21.3167 22.575 21.0834 22.4834 20.9 22.3L16 17.4Z" fill="#2A3647"/>
            </g>
        </svg>
    `;
}


function isDone(task) {
    return doneTasks === task;
}


function closeOverlay() {
    let overlay = document.querySelector('.overlay');
    overlay.classList.add('d_none');
    overlay.classList.remove('z-index-2000');
    overlay.classList.add('z-index-minus-1');
}

function uncheckedBoxSVG() {
    return /*html*/`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
        </svg>
    `;
}

function checkedBoxSVG() {
    return /*html*/`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 12L12 16L20 4.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}


window.closeOverlay = closeOverlay;
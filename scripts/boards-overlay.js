import { getPriority } from "./add-task.js";
import { setBgColor, setUserInitial, tasks } from "./boards.js";

let totalTasks = [], doneTasks = [];


function setOpacity() {
    document.querySelector('.overlay').classList.add('trans-dark-bg-p-50');
}


function unsetOpacity() {
    document.querySelector('.overlay').classList.remove('trans-dark-bg-p-50');
}


function setDate(card, id) {
    const date = new Date(tasks[id].Date);
    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
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


function setSubtasks(detailedCard, id) {
    totalTasks = tasks[id].Subtasks.Total;
    doneTasks = tasks[id].Subtasks.Done;
    tasks[id].Subtasks.Total.forEach((element) => {
        if(element !== "") { 
            if(totalTasks.find(isDone)) detailedCard.querySelector('.add-task-card-subtasks').innerHTML += checkedBoxSVG() + " " + element;
            else detailedCard.querySelector('.add-task-card-subtasks').innerHTML += uncheckedBoxSVG() + " " + element;
        }
    });
}


function setDetailedCard(id) {
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.classList.remove('runOutAnimation');
    detailedCard.classList.add('runInAnimation');
    detailedCard.querySelector('.add-task-card-category').innerHTML = tasks[id].Category;
    setBgColor(detailedCard, tasks[id]);
    detailedCard.querySelector('.add-task-card-headline').innerHTML = tasks[id].Title;
    detailedCard.querySelector('.add-task-card-description').innerHTML = tasks[id].Description;
    setDate(detailedCard, id);
    detailedCard.querySelector('.add-task-card-priority').innerHTML = `<div class="mg-right-8px">Priority:</div><div class="mg-right-8px">${tasks[id].Priority}</div><div class="flex align-items-center">${getPriority(tasks[id])}</div>`;
    detailedCard.querySelector('.add-task-card-persons').innerHTML = setUserInitial(detailedCard, tasks[id], true);
    let userIcons = detailedCard.querySelectorAll('.circle');
    userIcons.forEach(element => { element.style.width = "42px"});
    setSubtasks(detailedCard, id);
}


export function openOverlay(id) {
    let overlay = getOverlay();
    overlay.innerHTML = getDetailedCard();
    setDetailedCard(id);
    setOpacity();
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
                <div class="add-task-card-persons grid align-items-center grid-columns-2-48px-1fr gap-8px mg-top-8px"></div>
            </div>
            <div>Subtasks
                <div class="add-task-card-subtasks grid align-items-center grid-columns-2-32px-1fr mg-top-8px"></div>
            </div>
            <div class="add-task-card-bottom flex justify-content-flex-end align-items-center">
                <div class="add-task-delete mg-right-left-8px clickable">${trashSVG()}</div><span class="mg-right-8px clickable">Delete</span>
                <div class="add-task-edit mg-right-left-8px clickable">${editSVG()}</div><span class="clickable">Edit</span>
            </div>
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
    let detailedCard = document.querySelector('.detailed-card');
    detailedCard.classList.add('runOutAnimation');
    detailedCard.classList.remove('runInAnimation');
    setTimeout(() => {
        let overlay = document.querySelector('.overlay');
        overlay.classList.add('d_none');
        overlay.classList.remove('z-index-2000');
        overlay.classList.add('z-index-minus-1');
        unsetOpacity();
    }, "300");
}

function editSVG() {
    return /*html*/`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_239190_2307" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_239190_2307)">
                <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/> 
            </g>
        </svg>
    `;
}

function trashSVG() {
    return /*html*/`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_239190_2301" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"/>
            </mask>
                <g mask="url(#mask0_239190_2301)">
                <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
            </g>
        </svg>
    `;
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
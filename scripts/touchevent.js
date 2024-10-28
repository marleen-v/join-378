import { parseTaskIdToNumberId } from './boards-edit';
import { tasks } from './boards.js';

let moving = null;
let currentTask = 0;

function pickup(event, id) {
    currentTask = parseTaskIdToNumberId(id);
    if(window.screen.width > 700) return;
    currentDraggedElement = id;
    moving = event.target;
    

    moving.style.height = moving.clientHeight;
    moving.style.width = moving.clientWidth;
    moving.style.position = 'fixed';
    moving.style.zIndex = '-10';
}






function move(event) {
    if(window.screen.width > 700) return;
    if (moving) {        
        if (event.clientX) {
            // mousemove
            moving.style.left = event.clientX - moving.clientWidth / 2;
            moving.style.top = event.clientY - moving.clientHeight / 2;
            moving.offsetX = event.offsetX;
            moving.offsetY = event.offsetY;
            console.log(moving.offsetX);
            

        } else {
            // touchmove - assuming a single touchpoint
            moving.style.left = event.changedTouches[0].clientX - moving.clientWidth / 2;
            moving.style.top = event.changedTouches[0].clientY - moving.clientHeight / 2;

        }
    }
}


function drop(event) {
    if(window.screen.width > 700) return;
    let column = "";
    if (moving) {

        switch (event.currentTarget.getAttribute('id')) {
            case 'to-do': column = 'To Do'; break;
            case 'in-progress': column = 'In Progress'; break;
            case 'await-feedback': column = 'Await Feedback'; break;
            case 'done': column = 'Done'; break;
        }

        tasks.forEach((element, id) => {
            const task = 'taskId' + id;
            if (task === currentTask) {
                element.Column = column;
            }
            
        });
        //putData(TASKS_DIR, tasks);
        refresh();
    }
}


window.pickup = pickup;
window.move = move;
window.drop = drop;
import { refresh, showData } from "./boards.js";
import { parseTaskIdToNumberId } from "./boards-edit.js";

let draggable = document.getElementById("dragelement");
let movable = null;
let startTime;
let drag = false;
let holdTimeout;
let targetDiv = null;

let movableDiv = document.getElementById('dragelement');
const dropzones = document.querySelectorAll('.column');
let isDragging = false;
let offsetX, offsetY;

let id = "", i;


export function dragAndDropListener() {
    //dragStart();
    //startDragAndDrop();
    //mouseUp();
    //mouseMove();
    columnListener();
}
/*

function getColumn(key) {
    let column = "";
    switch (key) {
        case 'to-do': column = "To Do"; break;
        case 'in-progress': column = "In Progress"; break;
        case 'await-feedback': column = "Await Feedback"; break;
        case 'done': column = "Done"; break;
    }
    return column;
}

function getTaskBody(id, index) {
    return /*html*//*`
        <section onclick="openOverlay(0)" id="${id}" class="task-card add-task-card${index} clickable prevent-select" ondragstart="startDragging('${id}')"></section>  
    `;
}


function columnListener() {

    for (let index = 0; index < tasksFromFirebase.length; index++) {
        document.querySelector(`#taskId${index}`).addEventListener("mousedown", event => {
    //movableDiv.addEventListener('mousedown', function (event) {
    if(event.target) {
      isDragging = true;
      draggable.classList.remove('d_none');
      draggable.innerHTML = getTaskBody(id, index);
        draggable.querySelector('.task-card').innerHTML = document.getElementById(`taskId${index}`).innerHTML;
        
        draggable.style.left = event.pageX - draggable.offsetWidth / 2 + "px";
                draggable.style.top = event.pageY - draggable.offsetHeight / 2 + "px";
                draggable.querySelector('.task-card').style.transform = "rotate(15deg)";
      offsetX = event.offsetX;
      offsetY = event.offsetY;
      draggable.style.zIndex = 1000;
      id = "taskId" + index;
    }
    });
}
    
    document.addEventListener('mousemove', function (event) {
      if (isDragging) {
        // Position des beweglichen Elements aktualisieren
        draggable.style.left = event.pageX - offsetX + 'px';
        draggable.style.top = event.pageY - offsetY + 'px';
    
        // Bounding-Box des bewegten Elements
        const movableRect = draggable.getBoundingClientRect();
    
        // Überprüfen, ob das bewegte Element eine Dropzone berührt
        dropzones.forEach(dropzone => {
          const dropzoneRect = dropzone.getBoundingClientRect();
    
          if (
            movableRect.left < dropzoneRect.right &&
            movableRect.right > dropzoneRect.left &&
            movableRect.top < dropzoneRect.bottom &&
            movableRect.bottom > dropzoneRect.top
          ) {
            //dropzone.style.backgroundColor = 'lightgreen'; // Zeigt an, dass sie berührt wird
            document.getElementById(dropzone.id).style.backgroundColor = 'lightgreen';
            //console.log("Berührt:", dropzone.id);
            //console.log(id);
            document.getElementById(id).classList.add('d_none');
            let i = parseTaskIdToNumberId(id)
            tasksFromFirebase[i].Column = getColumn(dropzone.id);

            
          }/* else {
            dropzone.style.backgroundColor = 'lightgray'; // Standardfarbe
          }*/
        /*});
      }
    });
    
    document.addEventListener('mouseup', function () {
      isDragging = false;
      // Optional: Setzt die Farben zurück
      dropzones.forEach(dropzone => dropzone.style.backgroundColor = 'transparent');
      draggable.classList.add('d_none');
      draggable.style.zIndex = 1;
      document.getElementById(id).classList.remove('d_none');
      //refresh();
      showData(tasksFromFirebase);
      dragAndDropListener();
    });    


}


function dragStart() {
    draggable.addEventListener("dragstart", event => { event.preventDefault(); });
}

function startDragAndDrop() {
//document.querySelectorAll('.task-card').forEach(item => {
//    item.addEventListener('mousedown', function(event) {
    for (let index = 0; index < tasksFromFirebase.length; index++) {
        document.querySelector(`#taskId${index}`).addEventListener("mousedown", event => {
            event.preventDefault();
      // Timeout für "Halten" starten
      holdTimeout = setTimeout(() => {
        console.log("Langes Halten erkannt.");
        mouseDown(event, index);
      }, 200); // 200 ms ist die Halteschwelle
    });
  
    document.querySelector(`#taskId${index}`).addEventListener('mouseup', function(event) {
      // Timeout abbrechen, wenn es ein einfacher Klick ist
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
        // Aktion für einfachen Klick ausführen
      }
    });
  
    // Optional: Timeout auch abbrechen, wenn die Maus den Bereich verlässt
    document.querySelector(`#taskId${index}`).addEventListener('mouseleave', function() {
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
      }
    
  });
}
}

function mouseDown(event, index) {
    
    //for (let index = 0; index < tasksFromFirebase.length; index++) {
      //  document.querySelector(`#taskId${index}`).addEventListener("mousedown", event => {
            if (event.target) {
                isDragging = true;
                draggable.classList.remove('d_none');
                draggable.innerHTML = document.getElementById(`taskId${index}`).innerHTML;
                draggable.style.left = event.pageX - draggable.offsetWidth / 2 + "px";
                draggable.style.top = event.pageY - draggable.offsetHeight / 2 + "px";
                draggable.style.transform = "rotate(45deg)";
                }
                
       // }, false);
    //}
}

function mouseMove() {
    document.addEventListener("mousemove", event => {
        if(isDragging) {
            draggable.style.left = event.pageX - draggable.offsetWidth / 2 + "px";
            draggable.style.top = event.pageY - draggable.offsetHeight / 2 + "px";
            offsetX = event.offsetX;
            offsetY = event.offsetY;
            clearTimeout(startTime);
            startTime = null;
        }
    });
}

function mouseUp() {
    document.addEventListener("mouseup", event => {
        isDragging = false;
        draggable.classList.add('d_none');
        startTime = null;
        columnListener();
    });
}*/
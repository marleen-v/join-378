// Dialog
const dialogRef = document.querySelector("dialog");
const errorMessage = document.getElementById("error-message");

// Dialog Contactform
const dialogTitle = document.getElementById("dialog-title");
const dialogSubline = document.getElementById("dialogSubline");
const dialogColor = document.getElementById("dialogColor");
const dialogInitials = document.getElementById("dialogInitials");
const contactForm = document.getElementById("contactForm");

// Dialog Contactform Buttons
const cancelBtnTitle = document.getElementById("cancelBtnTitle");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtnTitle = document.getElementById("submitBtnTitle");
const checkIcon = document.getElementById("checkIcon");

//Dialog Contactform Input Fields
const inputNameRef = document.getElementById("c-name");
const inputEmailRef = document.getElementById("c-email");
const inputPhoneRef = document.getElementById("c-phone");

let emailExists;

let dialogDetails = [];

let dialogContents = 
{
 "add": {
      "dialogTitle": "Add Contact",
      "dialogSubline": "Tasks are better with a team!",
      "cancelBtnTitle": "Cancel",
      "submitBtnTitle": "Create Contact",
      "dialogInitials": '<img src="../assets/icons/person.svg" alt="" class="circle-icon" />'

    },
    "edit": {
         "dialogTitle": "Edit Contact",
         "dialogSubline": "",
         "cancelBtnTitle": "Delete",
         "submitBtnTitle": "Save",
         "dialogColor": currentContact.color,
         "dialogInitials": currentContact.initials

       }
     };
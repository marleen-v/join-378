// Dialog
const dialog = document.querySelector("dialog");
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

/**
 * This function opens the dialog
 */
function openContactDialog() {
  dialog.showModal();
}

/**
 * This function closes the dialog
 */
function closeContactDialog() {
  dialog.close();
  contactForm.reset();
  dialogColor.classList.remove(currentContact.color);
  errorMessage.classList.add("d_none");
  cancelBtn.classList.add("flex"); //was removed if add-dialog was opened beforehand (on mobile)
}

/**
 * This function validates the form
 */
function checkForm() {
  errorMessage.classList.add("d_none");
  emailExists = checkContactEmail();
  if (contactForm.checkValidity() && !emailExists) {
    submitBtn.classList.remove("inactiv-btn");
    checkIcon.classList.remove("inactive-color");
    errorMessage.classList.add("d_none");
  } else {
    submitBtn.classList.add("inactiv-btn");
    checkIcon.classList.add("inactive-color");
  }
}

inputNameRef.addEventListener("input", checkForm);
inputEmailRef.addEventListener("input", checkForm);
inputPhoneRef.addEventListener("input", checkForm);

/**
 * This function checks if entered email already exists
 * @returns - false, for does not exists or true, for does exist
 */
function checkContactEmail() {
  emailExists = contactList.some(
    (contact) => contact.email === inputEmailRef.value
  );
  if (emailExists) {
    //if email exists check if this email is in currentContact, if it is return false
    if (currentContact != [] && currentContact.email === inputEmailRef.value) {
      errorMessage.classList.add("d_none");
      return !emailExists;
    } else {
      errorMessage.classList.remove("d_none");
      return emailExists;
    }
  }
}

/**
 * This function renders the dialog to add a contact
 *
 */
function renderAddContactDialog() {
  dialogTitle.innerHTML = "Add Contact";
  dialogSubline.innerHTML = "Tasks are better with a team!";
  dialogInitials.innerHTML =
    '<img src="../assets/icons/person.svg" alt="" class="circle-icon" />';
  cancelBtnTitle.innerHTML = "Cancel";
  submitBtnTitle.innerHTML = "Create Contact";
  /* dialogColor.classList.add("neutralColor"); */
  cancelBtn.onclick = function () {
    closeContactDialog();
  };
  contactForm.onsubmit = function () {
    if (!emailExists) {
      addNewContact();
      errorMessage.classList.add("d_none");
    } else {
      return false;
    }
  };

  submitBtn.classList.add("inactiv-btn");
  checkIcon.classList.add("inactive-color");

  if (window.innerWidth < 1200) {
    cancelBtn.classList.add("d_none");
    cancelBtn.classList.remove("flex");
  }

  openContactDialog();
}

/**
 * This function renders the dialog to edit a chosen contact
 *
 * @param {Number} index
 */
function renderEditContactDialog(index) {
  dialogTitle.innerHTML = "Edit Contact";
  dialogSubline.innerHTML = "";
  cancelBtnTitle.innerHTML = "Delete";
  submitBtnTitle.innerHTML = "Save";
  dialogColor.classList.add(currentContact.color);
  dialogInitials.innerHTML = currentContact.initials;
  cancelBtn.onclick = function () {
    deleteContact(index);
    dialogColor.classList.remove(currentContact.color);
    errorMessage.classList.add("d_none");
  };
  contactForm.onsubmit = function () {
    if (!emailExists) {
      updateContactInfo(index);
      dialogColor.classList.remove(currentContact.color);
      errorMessage.classList.add("d_none");
    } else {
      return false;
    }
  };

  fillInputFields(index);

  submitBtn.classList.remove("inactiv-btn");
  checkIcon.classList.remove("inactive-color");

  openContactDialog();
}

/**
 * This function fills in
 *
 * @param {Number} index
 */
function fillInputFields(index) {
  inputNameRef.value =
    contactList[index].firstName + " " + contactList[index].lastName;
  inputEmailRef.value = contactList[index].email;
  inputPhoneRef.value = contactList[index].phone;
}

const BASE_URL = "https://join-378-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadContactData() {
    const response = await fetch(BASE_URL + "/contacts" + ".json")
   const data = await response.json();
   return data
}

async function renderContacts() {

    const contentRef = document.getElementById("contact-container");
    contentRef.innerHTML = "";
    const contacts = await loadContactData();

    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        contentRef.innerHTML += renderContactsHTML(contact);
    }
}

function renderContactsHTML(contact){
    
    return `
    <div class="single-contact-container flex align-items-center">
            <div class="ellipse flex justify-content-center align-items-center"><span></span></div>
            <div class="name-email flex flex-column">
              <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
              <span class="contact-email">${contact.email}</span>
            </div>
          </div>
    `
}
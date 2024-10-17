function getTemplateMainSummary(){
  return `
    <section class="summary-section">
        <div class="header-main">
          <h1>Join 360</h1>
          <span>Key Metrics at a Glance</span>
        </div>

        <div class="data-ctn">
          <div class="object-data">

            <div class="todo-done-ctn">
              <div class="todo bgwhite-colblack-br30 w264h168">
                <div class="circle69"><img src="../assets/icons/edit.png" alt=""></div>
                <div><p class="font64colblackw600">${getNumberToDoTasks()}</p><p class="color2A">To-Do</p></div>
              </div>
              <div class="done bgwhite-colblack-br30 w264h168">
                <div class="circle69"><img src="../assets/icons/Vector@2x.png" alt=""></div>
                <div><p class="font64colblackw600" id="done_tasks">${getNumberDoneTasks()}</p><p class="color2A">Done</p></div>
              </div>
            </div>

            <div class="urgent-ctn bgwhite-colblack-br30 w560h168">
              <div class="urgent-left-side">
                <div class="circle-urgent"><img src="../assets/icons/Prio alta.png" alt=""></div>
              
                <div class="urgent-data">
                  <p class="font64colblackw600" id="urgent_tasks">${getNumberUrgentTasks()}</p>
                  <p class="color2A">Urgent</p>
                </div>
              
              </div>
              <div class="date-ctn">
                <p class="font21w700">${getDeadlineMonth()}&nbsp;${getDeadlineDay()},&nbsp;${getDeadlineYear()}</p>
                <p class="font16w400">Upcoming Deadline</p>
              </div>
            </div>

            <div class="tasks-ctn">
              <div class="board bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">${getTasksInBoard()}</p><p class="color2A">Tasks in Board</p></div>
              <div class="progress bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">${getNumberTasksInProgress()}</p><p class="color2A">Tasks in Progress</p></div>
              <div class="feedback bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">${getNumberTasksAwaitingFeedback()}</p><p class="color2A">Awaiting Feedback</p></div>
            </div>
            
          </div>

          <div id="greeting_ctn" class="greeting-ctn"></div>

        </div>

      </section>
  `;
}


/**
 * This function returns the html for the rendering of each contact
 *
 * @param {Array} contact - this is a single contact info
 * @returns
 */
function getContactHTML(contact, index) {
  return `
    <button class="single-contact-btn flex align-items-center" onclick="showContactInfo(${index})">
            <span class="circle ${contact.color} flex justify-content-center align-items-center">
              <span>${contact.initials}</span>
            </span>
            <span class="name-email flex flex-column">
              <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
              <span class="contact-email">${contact.email}</span>
            </span>
          </button>
    `;
}

/**
 * This function returns the html-template for the contact-info of a clicked contact 
 * 
 * @returns 
 */
function getContactInfoTemplate(index) {
  return `
   <div class="contact-info">
              <div class="single-contact-large flex align-items-center">
                <div
                  class="circle ${currentContact.color} circle-large flex justify-content-center align-items-center"
                >
                  <span>${currentContact.initials}</span>
                </div>
                <div class="name-email flex flex-column">
                  <div class="contact-name-large">${currentContact.firstName} ${currentContact.lastName}</div>
                  <div class="icon-container flex">
                    <button class="contact-icon-btn flex align-items-center" onclick="openEditContactDialog(${index})">
                      <img src="../assets/img/edit.svg" alt="" />
                      <span>Edit</span>
                    </button>
                    <button class="contact-icon-btn flex align-items-center" onclick="deleteContact(${index})">
                      <img src="../assets/img/delete.svg" alt="" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="contact-info-text flex align-items-center">
              Contact Information
            </div>
            <div
              class="email-phone-container flex flex-column"
              style="gap: 22px"
            >
              <div class="email flex flex-column" style="gap: 15px">
                <div style="font-weight: 700">Email</div>
                <div class="contact-email">${currentContact.email}</div>
              </div>
              <div class="phone flex flex-column" style="gap: 15px">
                <div style="font-weight: 700">Phone</div>
                <div>${currentContact.phone}</div>
              </div>
            </div>
            `;
}

/**
 * This function returns the html-template of a new Letter-Section in the conatctlist
 * 
 * @param {String} firstLetter 
 * @returns 
 */
function getNewSectionHTML(firstLetter) {
  return `
  <div class="letter">${firstLetter}</div>
  `;
}


function contactDialogTemplateHtml() {

  return `
        <img
        src="../assets/img/logo-weiss.png"
        class="join-logo"
        alt="join-logo"
      />
      <div class="dialog-title flex flex-column justify-content-center" id="dialog-title">
        <h1>${dialogElements.title}</h1>
        <span>${dialogElements.subline}</span>
        <div class="horizontal-line"></div>
      </div>
      <div class="form-container flex align-items-center justify-content-between position-relative">
        <div class="circle-container flex align-items-center justify-content-center" style="width:30%;">
        <div
          class="${dialogElements.color} circle circle-large flex justify-content-center align-items-center"
         
        >${dialogElements.initials}
          
        </div>
      </div>
      <form  onsubmit="${dialogElements.onsubmit}" method="dialog" class="flex flex-column" id="contactForm">
        <button  type="button" class="close-btn position-absolute" id="close" ><img src="../assets/icons/close.svg" alt="" onclick="closeDialog()"></button>
        <label class="flex justify-content-between">
          <input required
            class="contact-input"
            type="text"
            id="c-name"
            name="c-name"
            placeholder="Name"
          />
          <img
            class="input-icon"
            src="../assets/icons/person-grey.svg"
            alt=""
          />
        </label>
        <label class="flex justify-content-between">
          <input required
            class="contact-input"
            type="email"
          id="c-email"
          name="c-email"
          placeholder="Email"
          />
          <img
            class="input-icon"
            src="../assets/icons/mail.svg"
            alt=""
          />
        </label>
        <label class="flex justify-content-between">
          <input 
            class="contact-input"
            type="tel"
            id="c-phone"
            name="c-phone"
            placeholder="Phone"
          />
          <img
            class="input-icon"
            src="../assets/icons/phone.svg"
            alt=""
          />
        </label>
        
        <div class="btn-container flex flex-row">
        <button type="button" class="cancel-btn flex justify-content-between align-items-center" id="cancelBtn" onclick="${dialogElements.onclick_cancelBtn}"> 
        <span>${dialogElements.cancelBtn}</span>
        <img class="cancel-icon" src="../assets/icons/close.svg" alt="">
        </button>
        
          <button   type="submit" id="submitBtn" class="submit-btn flex justify-content-between create-conatct-btn contact-input align-items-center" >
          ${dialogElements.submitBtn}
            <img id="checkIcon" class=" check-icon input-icon" src="../assets/icons/check.svg"   alt=""/>
        </button>
      </div>
      
      </form>
        
      </div> 
  `
}
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

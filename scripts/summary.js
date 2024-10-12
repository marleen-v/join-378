let currentUserFirstName = "Sofia";
let currentUserLastName = "Müller";


function getGreetingTemplate(greetFormula){
  return `
    <p class="greeting-formula">${greetFormula},</p>
    <p class="greeting-person">${currentUserFirstName}&nbsp;${currentUserLastName}</p>
  `;
}


function initSummary(){
  showGreetingDependingOnDaytime();
}


function showGreetingDependingOnDaytime(){
  const HOURS = new Date().getHours();
  let formula = "Hallöchen";
  if(HOURS >= 6 && HOURS < 12){formula = "Good morning";} else
  if(HOURS >= 12 && HOURS < 18){formula = "Good day";} else
  if(HOURS >= 18 && HOURS < 22){formula = "Good evening";} else
  {formula = "Good night";}
  document.getElementById("greeting_ctn").innerHTML = getGreetingTemplate(formula);
}

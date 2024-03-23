
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }

  function init(){
    loadUsers();
    restoreActUser();
  }

  function initsummary(){
    actUser();
    loadUsers();
    document.getElementById('userName').innerHTML = name;
    initSummaryForm();
  }

  function initTask(){
    actUser();
    loadUsers();
    initTaskform();
  }

  function initBorad(){
    actUser();
    loadUsers();
    initBoardForm();
  }

  async function initContact(){
    actUser();
    loadUsers();
    await loadAllContacts();
    await sortContact();
    await loadContactPage();
    loadDetail(0);
    document.getElementById('contactinfo').classList.remove('display-none');
  }

  async function loadAllTask() {
    try {
        allTasks = JSON.parse(await getItem('tasks'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


async function loadContacts() {
  try {
      allAssigned = JSON.parse(await getItem('users'));
  } catch (e) {
      console.error('Loading error: ', e);
  }
}

async function loadAllContacts() {
  try {
      allContacts = JSON.parse(await getItem('contact'));
  } catch (e) {
      console.error('Loading error: ', e);
  }

}

function sortContact(){
  allContacts.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
})}
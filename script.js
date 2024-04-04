/**
 * Init for index.html
 */
function init() {
  loadUsers();
  restoreActUser();
}
/**
 * Init for summary.html
 */
async function initsummary() {
  await loadUsers();
  await initSummaryForm();
  await actUser();
  document.getElementById('userName').innerHTML = loggedInUserName;
  activeLink(1);
}
/**
 * Init for add_task.html
 */
async function initTask() {
  await loadUsers();
  await initTaskform();
  await actUser();
  activeLink(2);
}
/**
 * Init for datenschutzerklärung.html & impressum.html
 */
async function privacy(){
  await loadUsers();
  await actUser();
}
/**
 * Init for board.html
 */
async function initBorad() {
  await loadUsers();
  await initBoardForm();
  await actUser();
  activeLink(3);
}
/**
 * Init for contacts.html
 */
async function initContact() {
  await loadUsers();
  await loadAllContacts();
  await sortContact();
  await loadContactPage();
  activeLink(4);
  await actUser();
  if (window.innerWidth > 1070) {
    loadDetail(0);
  }
  document.getElementById('contactinfo').classList.remove('display-none');
}

/**
 * Load all task from backend
 */
async function loadAllTask() {
  try {
    allTasks = JSON.parse(await getItem('tasks'));
  } catch (e) {
    console.error('Loading error:', e);
  }
}
/**
 * Load all contacts from backend
 */
async function loadAllContacts() {
  try {
    allContacts = JSON.parse(await getItem('contact'));
  } catch (e) {
    console.error('Loading error: ', e);
  }
}
/**
 * Show Submenu for logout
 */
function loadSubMenu(i) {
  let subMenu = document.getElementById('subMenu' + i);
  if (subMenu.classList.contains('display-none')) {
    document.getElementById('subMenu' + i).classList.remove('display-none');
  } else
    document.getElementById('subMenu' + i).classList.add('display-none');
}
/**
 * Sort all contacts
 */
function sortContact() {
  allContacts.sort(function (a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  })
}
/**
 * Navigate to the specific page
 * 
 * @param {string} page - name of the page to load
 */
function navigateTo(page) {
  // Navigiere zur gewählten Seite
  window.location.href = page;
}

function openAGB(site){
  document.getElementById(site).style.display = "flex";
}

/**
 * Show a highligt for the actual page on the menu
 * 
 * @param {number} page - number of the active page
 */
function activeLink(page) {
  if (page === 1) {
    document.getElementById('sumMob').classList.add('activeLink');
    document.getElementById('addMob').classList.remove('activeLink');
    document.getElementById('boardMob').classList.remove('activeLink');
    document.getElementById('contMob').classList.remove('activeLink');
  } else if (page === 2) {
    document.getElementById('sumMob').classList.remove('activeLink');
    document.getElementById('addMob').classList.add('activeLink');
    document.getElementById('boardMob').classList.remove('activeLink');
    document.getElementById('contMob').classList.remove('activeLink');
  } else if (page === 3) {
    document.getElementById('sumMob').classList.remove('activeLink');
    document.getElementById('addMob').classList.remove('activeLink');
    document.getElementById('boardMob').classList.add('activeLink');
    document.getElementById('contMob').classList.remove('activeLink');
  } else if (page === 4) {
    document.getElementById('sumMob').classList.remove('activeLink');
    document.getElementById('addMob').classList.remove('activeLink');
    document.getElementById('boardMob').classList.remove('activeLink');
    document.getElementById('contMob').classList.add('activeLink');
  }
}
/**
 * Load template HTML
 * 
 * @returns 
 */
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
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
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

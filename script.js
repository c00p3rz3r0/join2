
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

function init() {
  loadUsers();
  restoreActUser();
}

async function initsummary() {
  await actUser();
  await loadUsers();
  document.getElementById('userName').innerHTML = name;
  await initSummaryForm();
  activeLink(1);
}

async function initTask() {
  await actUser();
  await loadUsers();
  await initTaskform();
  activeLink(2);
}

function initBorad() {
  actUser();
  loadUsers();
  initBoardForm();
  activeLink(3);
}

async function initContact() {
  await actUser();
  await loadUsers();
  await loadAllContacts();
  await sortContact();
  await loadContactPage();
  activeLink(4);
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
function loadSubMenu(i) {
  let subMenu = document.getElementById('subMenu' + i);
  if (subMenu.classList.contains('display-none')) {
    document.getElementById('subMenu' + i).classList.remove('display-none');
  } else
    document.getElementById('subMenu' + i).classList.add('display-none');
}


function sortContact() {
  allContacts.sort(function (a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  })
}

function navigateTo(page) {
  // Navigiere zur gewählten Seite
  window.location.href = page;
}
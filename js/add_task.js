let allTasks = [];
let selectedPrio ='';
let assignedPerson = [];
var assinedPersons = [];
let allAssigned = [];
const htmlfields = ['assinedPersons', 'task-list'];
let taskIdCounter = 0;
const subTasks = [];
let allContacts = [];

async function initTaskform(){
    await loadContacts();
    await loadAllTask();
    await loadAllContacts();
    sortContact();
}

let colors = ['#00BEE8','#FF7A00', '#9327FF', '#FC71FF'];


function clearTaskForm(){
    location.reload();
}

async function addTask() {
    let taskTitle = document.getElementById('taskTitle').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let taskDueDate = document.getElementById('dueDate').value;
    let taskCategory = document.getElementById('taskCategory').value;
    let taskPrio = document.getElementById('priority-input').value;
    allTasks.push({
        title: taskTitle,
        description: taskDescription,
        assigned: assinedPersons,
        dueDate: taskDueDate,
        prio: taskPrio,
        category: taskCategory,
        createdAt: new Date().getTime(),
    });
    await setItem('task', JSON.stringify(allTasks));
    console.log(allTasks);
}


function selectPriority(buttonId) {
    const buttons = document.querySelectorAll('.priority-btn');

    // Remove the 'active' class from all buttons
    buttons.forEach((button) => {
        button.classList.remove('active');
    });

    // Add the 'active' class to the selected button
    document.getElementById(buttonId).classList.add('active');

    // Update the selected priority
    selectedPrio = buttonId;
    document.getElementById('priority-input').value = selectedPrio;
}

function showContacts(){
    let contactdiv = document.getElementById('assignedContacts');
    contactdiv.innerHTML = ``;
    document.getElementById('headerAssigne').classList.add('display-none')
    for (let i = 0; i < allContacts.length; i++) {
        let bgcolor = colors[Math.floor(Math.random()*colors.length)];
        const element = allContacts[i];
        const firstLetter = element['firstName'].charAt(0).toUpperCase();
        contactdiv.innerHTML +=`
        <div class="assigneContact"><div class="assigned-circle" style="background-color: ${bgcolor};">${firstLetter}</div><p>${element['firstName']}</p> <input id=${i} type="checkbox"></div>`
    }
}

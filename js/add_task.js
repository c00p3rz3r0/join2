let allTasks = [];
let selectedPrio ='';
let assignedPerson = [];
let allAssigned = [];
const htmlfields = ['assinedPersons', 'task-list'];
let taskIdCounter = 0;
let subTasks = [];

async function initTaskform(){
    await loadContacts();
    await loadAllTask();
    await loadAllContacts();
    await sortContact();
}


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
    let assDiv = document.getElementById('assinedPersons');
    if (contactdiv.classList.contains('display-none')) {
        contactdiv.innerHTML = ``;
        assDiv.innerHTML = ``;
        contactdiv.classList.remove('display-none');
        for (let i = 0; i < allContacts.length; i++) {
            const element = allContacts[i];
            const firstLetter = element['name'].charAt(0).toUpperCase();
            const checkChecked = checked(i);
            contactdiv.innerHTML +=`
            <div class="assigneContact">
            <div class="assigned-circle" style="background-color: ${element['bgcolor']};">${firstLetter}</div>
            <p>${element['name']}</p> 
            <input onclick="addAssigne(${i})" ${checkChecked} id="check${i}" type="checkbox">
            </div>`
        }
    }else{
        contactdiv.classList.add('display-none');
        showAssignedPersons();
    }
}

function addAssigne(index){
    assignedPerson = [];
    for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        if (document.getElementById('check'+i).checked == true) {
            let firstname = allContacts[i]['name'];
            let color = allContacts[i]['bgcolor']
            assignedPerson.push({
                firstname: firstname,
                color: color,
            });
        }
    }

}

function checked(index){
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i]['firstname'];
        if (element == allContacts[index]['name']) {
            return "checked";
        }
    } return false;
}

function showAssignedPersons() {
    let assDiv = document.getElementById('assinedPersons');
    assDiv.innerHTML = ``;
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i];
        const firstLetter = element['firstname'].charAt(0).toUpperCase();
        assDiv.innerHTML += `
        <div>
        <div class="assigned-circle" style="background-color: ${element['color']};">${firstLetter}</div>
        </div>
        `;
    }
}

function addSubtask(){
    let inputSubtask = document.getElementById('subtask');
    if (inputSubtask.value == "") {
        alert('Enter new Subtask')
    }else{
    subTasks.push(inputSubtask.value);
    inputSubtask.value = ``;
    generateSubTask();
    }
}

function generateSubTask(){
    let addedSubtask = document.getElementById('addSubtask');
    addedSubtask.innerHTML = ``;
    for (let i = 0; i < subTasks.length; i++) {
        const element = subTasks[i];
        addedSubtask.innerHTML +=`
        <div id=subTask${i} class="input-subtask">
        <input onselect="editSubtask(${i})"  value="${i+1}   ${element}">
        <img src="/assets/img/add-subtask.svg" id=subTaskEdit${i} onclick="addSubtask()" class="display-none" alt="" srcset="">
        </div>
        `
        //document.getElementById('subTask'+i).addEventListener('focusin',editSubtask(i));
    }
}


function editSubtask(index){
    document.getElementById('subTask'+index).classList.add('subtasks-focus');
    document.getElementById('subTaskEdit'+index).classList.remove('display-none');
}

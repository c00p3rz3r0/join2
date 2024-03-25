let todoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];
let currentDraggedElement;

async function initBoardForm() {
    await loadAllTask();
    updateHTML();
    await loadContacts();
    await loadAllContacts();
    await sortContact();
}

function loadCards(array, boardCat) {
    document.getElementById(boardCat).innerHTML = ``;
    if (array.length === 0) {
        generateNoTask(boardCat);
    } else {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            generateCard(boardCat, element, i);
            generateAssignUsers(boardCat, i, element);
        }
    }
}

function generateCard(boardCat, element, i) {
    let subtaskAmount = element['subTasks'].length;
    let priority = getPriority(element);
    document.getElementById(boardCat).innerHTML += `
    <div class="board-card" draggable="true" onclick="openDetail('${element['createdAt']}')" ondragstart="startDragging('${element['createdAt']}')">
    <div><span class="lable-board-card">User Story</span></div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div class="progress">
    <progress id="progress" value="50" max="100"></progress>
    <span>1/${subtaskAmount} Subtask</span>
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id="bottom${boardCat}${i}"></div>
    <img src="${priority}" alt=""></div>
    `
}

function updateHTML() {
    let todo = allTasks.filter(t => t['category'] == 'To Do');
    loadCards(todo, 'boardToDo');
    let inProgress = allTasks.filter(t => t['category'] == 'In progress');
    loadCards(inProgress, 'boardProgress');
    let awaitFeedback = allTasks.filter(t => t['category'] == 'Await feedback');
    loadCards(awaitFeedback, 'boardFeedback');
    let done = allTasks.filter(t => t['category'] == 'Done');
    loadCards(done, 'boardDone');
}

function getPriority(element) {
    let probtn;
    if (element['prio'] == 'mediumBtn') {
        probtn = 'assets/img/prio-media.svg';
    } else if (element['prio'] == 'urgentBtn') {
        probtn = 'assets/img/prio-alta.svg';
    } else {
        probtn = 'assets/img/prio-baja.svg';
    }
    return probtn;
}
function getPriorityName(element) {
    let probtn;
    if (element['prio'] == 'mediumBtn') {
        probtn = 'Medium';
    } else if (element['prio'] == 'urgentBtn') {
        probtn = 'Urgent';
    } else {
        probtn = 'Low';
    }
    return probtn;
}

function generateNoTask(boardCat) {
    document.getElementById(boardCat).innerHTML =
        `
    <div class="no-tasks" draggable="true" ondragstart="startDragging('0')">
    <div class=><span>No tasks To do</span></div>
    </div>
    `
}

function generateAssignUsers(boardCat, i, element) {
    let assignCard = document.getElementById('bottom' + boardCat + i);
    for (let index = 0; index < element['assigned'].length; index++) {
        const element2 = element['assigned'][index];
        const firstLetter = getLetters(element2['firstname'])
        assignCard.innerHTML += `
        <div class="assigned-circle" style="background-color: ${element2['color']};">${firstLetter}</div>
        `
    };
}

function startDragging(id) {
    for (let i = 0; i < allTasks.length; i++) {
        const array = allTasks[i];
        if (array['createdAt'] == id) {
            currentDraggedElement = i;
        }
    }
}
async function moveTo(category) {
    allTasks[currentDraggedElement]['category'] = category;
    await setItem('tasks', JSON.stringify(allTasks));
    initBoardForm();
}
function allowDrop(ev) {
    ev.preventDefault();
}

function openAddTask(index) {
    document.getElementById('addTaskBoard').classList.remove('display-none');
    document.getElementById('bg-popup').classList.remove('display-none');
    document.getElementById('bg-popup').classList.add('d-flex');
    document.getElementById('task-header-temp').classList.add('display-none');
    document.getElementById('addTaskBoard2').classList.remove('add-task-page');
    if (index === 1) {
        openEditInformation();
        window.alert('Edit dosen´t word :-)')
    }
}

function openEditInformation(){
    let element = allTasks[currentDraggedElement];
    document.getElementById('taskTitle').value = element['title'];
    document.getElementById('taskDescription').value = element['description'];
    document.getElementById('taskTitle').value = element['title'];
    document.getElementById('taskTitle').value = element['title'];
}
function closeAdd() {
    document.getElementById('addTaskBoard').classList.add('display-none');
    document.getElementById('task-header-temp').classList.remove('display-none');
    document.getElementById('bg-popup').classList.remove('d-flex');
    document.getElementById('bg-popup').classList.add('display-none');
}

function openDetail(id){
    let detailDiv = document.getElementById('taskDetail');
    document.getElementById('popUp').classList.remove('display-none');
    startDragging(id);
    detailDiv.innerHTML = ``;
    let element = allTasks[currentDraggedElement];
    let priority = getPriority(element);
    let prioName = getPriorityName(element);
    generateDetail(detailDiv,element,priority,prioName);
    generateSubtaskDetail(element);
    generateAssignUsersDetail(element);
}
async function deleteTask(){
        allTasks.splice(currentDraggedElement,1);
        await setItem('tasks', JSON.stringify(allTasks));
        initBorad();
        location.reload();
    }


function generateDetail(detailDiv, element, priority,prioName){
    detailDiv.innerHTML = `
    <div class="board-card-detail ">
    <div class="detail-top">
        <span class="lable-board-card">User Story</span>
        <img src="assets/img/close.svg" onclick="closeDetail()" alt="">
    </div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div><span>Due date:</span><span>${element['dueDate']}</span></div>
    <div><span>Priority:</span><span>${prioName}</span><img src="${priority}" alt=""></div>
    <span>Assigned To:</span>
    <div class="assign-detail" id="assignedTo">
    </div>
    <span>Subtasks:</span>
    <div class="assign-detail" id="subTasks">
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id=""></div>
    </div>
    <div class="contact-edit">
    <div id="editContact" onclick="openAddTask(1)" class="edit-contact"></div>
    <div class="delete-contact" onclick="deleteTask()"></div>
    </div>
    `;
}

function generateSubtaskDetail(element){
    let subtasks = document.getElementById('subTasks');
    subtasks.innerHTML = '';
    for (let i = 0; i < element['subTasks'].length; i++) {
        const subtask = element['subTasks'][i];
        subtasks.innerHTML +=`
        <div class="subtask-detail s16">
        <div class="">
        <input type="checkbox" name="" id="${i}">
        </div>
        <span>${subtask['task']}</span>
        </div>
        `;
    }
}
function generateAssignUsersDetail(element) {
    let assignCard = document.getElementById('assignedTo');
    for (let index = 0; index < element['assigned'].length; index++) {
        const element2 = element['assigned'][index];
        const firstLetter = getLetters(element2['firstname'])
        assignCard.innerHTML += `
        <div class="assigned-detail-block s19">
        <div class="assigned-circle-small s12" style="background-color: ${element2['color']};">${firstLetter}</div>
        <span>${element2['firstname']}</span>
        </div>
        `
    };
}

function closeDetail(){
    let detailDiv = document.getElementById('taskDetail');
    detailDiv.innerHTML = '';
    document.getElementById('popUp').classList.add('display-none');
}
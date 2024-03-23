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

function openAddTask() {
    document.getElementById('addTaskBoard').classList.remove('display-none');
    document.getElementById('bg-popup').classList.remove('display-none');
    document.getElementById('bg-popup').classList.add('d-flex');
    document.getElementById('task-header-temp').classList.add('display-none');
    document.getElementById('addTaskBoard2').classList.remove('add-task-page');

}
function closeAdd() {
    document.getElementById('addTaskBoard').classList.add('display-none');
    document.getElementById('task-header-temp').classList.remove('display-none');
    document.getElementById('bg-popup').classList.remove('d-flex');
    document.getElementById('bg-popup').classList.add('display-none');
}

function openDetail(id){
    let detailDiv = document.getElementById('taskDetail');
    startDragging(id);
    detailDiv.innerHTML = ``;
    let element = allTasks[currentDraggedElement];
    let priority = getPriority(element);
    let prioName = getPriorityName(element);
    detailDiv.innerHTML = `
    <div class="board-card-detail ">
    <div class="detail-top">
        <span class="lable-board-card">User Story</span>
        <img src="assets/img/close.svg" alt="">
    </div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div><span>Due date:</span><span>${element['dueDate']}</span></div>
    <div><span>Priosity:</span><span>${prioName}</span><img src="${priority}" alt=""></div>
    <div class="progress">
    <progress id="progress" value="50" max="100"></progress>
    <span>${element['subTasks']} Subtask</span>
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id=""></div>
    </div>
    `;
}
function createCardHTML(contactsDiv, i, color, inital, name, mail, truncatedEmail) {
    return contactsDiv.innerHTML += `
    <div class="contact-block" id="contact${i}" onclick="loadDetail(${i})">
    <div class="icon-board" style="background-color: ${color};">${inital}</div>
    <div class="">
    <span class="s20">${name}</span><br>
    <a class="s16 contact-mail" >${truncatedEmail}</a>
    </div>
    </div>`
        ;
}

/**
 * generate Card html
 * 
 * @param {string} boardCat - get the html id for the specific board category
 * @param {JSON} element - all task in the category todo or in progress etc
 * @param {number} i - index of the next card
 */
function generateCard(boardCat, element, i) {
    let subtaskAmount = element['subTasks'].length;
    let openSubtask = element['subTasks'].filter(obj => obj['taskStatus'] === 'true').length;
    let progressvalue = (openSubtask / subtaskAmount) * 100;
    let priority = getPriority(element);
    document.getElementById(boardCat).innerHTML += `
    <div class="board-card" id="${element['createdAt']}" draggable="true" touchmove="startDragging('${element['createdAt']}')" onclick="openDetail('${element['createdAt']}')" ondragstart="startDragging('${element['createdAt']}')">
    <div style="display: flex;"><span class="lable-board-card">User Story</span></div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div id="progressSubtask${i}" class="progress">
    <progress id="progress" value="${progressvalue}" max="100"></progress>
    <span>${openSubtask}/${subtaskAmount} Subtask</span>
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id="bottom${boardCat}${i}"></div>
    <img src="${priority}" alt=""></div>
    `
    if (subtaskAmount == 0) {
        document.getElementById('progressSubtask' + i).classList.add('display-none');
    }
}

/**
 * generate the aasign user of this task
 * 
 * @param {string} boardCat - get the html id for the specific board category
 * @param {number} i - index of the actual card
 * @param {JSON} element - actual task element
 */
function generateAssignUsers(boardCat, i, element) {
    let assignCard = document.getElementById('bottom' + boardCat + i);
    let moreAssigne = 0;
    for (let index = 0; index < element['assigned'].length; index++) {
        const element2 = element['assigned'][index];
        const firstLetter = getLetters(element2['firstname'])
        if (index < 3) {
            assignCard.innerHTML += `
            <div class="assigned-circle" style="background-color: ${element2['color']};">${firstLetter}</div>
            `
        } else {
            moreAssigne++;
        }

    };
    if (moreAssigne > 0) {
        assignCard.innerHTML += `
        <div class="more-Assigne">+${moreAssigne}</div>
        `
    }
}


/**
 * generate an "empty" div with a short text for no task in this category
 * 
 * @param {string} boardCat - get the html id for the specific board category
 */
function generateNoTask(boardCat) {
    document.getElementById(boardCat).innerHTML =
        `
    <div class="no-tasks" draggable="true" ondragstart="startDragging('0')">
    <div class=><span>No tasks To do</span></div>
    </div>
    `
}

/**
 * show all assigne user in the task form
 * 
 * @param {JSON} element - acutal task
 */
function showActualAssignedPersons(element) {
    let assDiv = document.getElementById('assinedPersons');
    assignedPerson = element['assigned'];
    assDiv.innerHTML = ``;
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i];
        const firstLetter = getLetters(element['firstname']) //element['firstname'].charAt(0).toUpperCase()+element['firstname'].ch;
        assDiv.innerHTML += `
        <div>
        <div class="assigned-circle" style="background-color: ${element['color']};">${firstLetter}</div>
        </div>
        `;
    }
}

/**
 * generate a detail view of the task
 * 
 * @param {div} detailDiv - div for the details
 * @param {JSON} element - actual task
 * @param {string} priority - image for the priority
 * @param {string} prioName - name of the priority
 */
function generateDetail(detailDiv, element, priority, prioName) {
    detailDiv.innerHTML = `
    <div class="board-card-detail ">
    <div class="detail-top">
        <span class="lable-board-card">User Story</span>
        <div class="MobileYes cat-switch">
        <span>Switch Category</span>
        <div>
            <img  style="z-index: 9999;" id="arrowUp" onclick="prevCat()"  src="assets/img/arrow-up2.svg">
            <img id="arrowDown" onclick="nextCat()" src="assets/img/arrow-down2.svg">
            </div>
        </div>
        <img src="assets/img/close.svg" onclick="closeDetail()" alt="">
        
    </div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div class="detail-style">
    <table>

    <tbody>
        <tr>
            <td>Due date:</td>
            <td>${element['dueDate']}</td>

        </tr>
        <tr>
            <td>Priority:</td>
            <td>${prioName}  <img src="${priority}" alt=""></td>
        </tr>            
    </tbody>
    </table>

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
    <img class="MobileYes" src="assets/img/v-vectos-edit.svg" alt="">
    <div class="delete-contact" onclick="deleteTask()"></div>
    </div>
    `;
}

/**
 * generate the subtask with the status of the checkbox
 * 
 * @param {JSON} element - actual task
 */
function generateSubtaskDetail(element) {
    let subtasks = document.getElementById('subTasks');
    subtasks.innerHTML = '';
    for (let i = 0; i < element['subTasks'].length; i++) {
        const subtask = element['subTasks'][i];
        let checkedbox = '';
        if (subtask['taskStatus'] == 'true') {
            checkedbox = 'checked';
        } else {
            checkedbox = '';
        }
        subtasks.innerHTML += `
        <div class="subtask-detail s16">
        <div class="">
        <input type="checkbox" name="" id="${i}" ${checkedbox} >
        </div>
        <span>${subtask['task']}</span>
        </div>
        `;
    }
}

/**
 * show the assigne user of the task
 * 
 * @param {JSON} element - actual task
 */
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

/**
 * show contacts for the assigne user
 */
function showContacts() {
    let contactdiv = document.getElementById('assignedContacts');
    let assDiv = document.getElementById('assinedPersons');
    if (contactdiv.classList.contains('display-none')) {
        contactdiv.innerHTML = ``;
        assDiv.innerHTML = ``;
        contactdiv.classList.remove('display-none');
        for (let i = 0; i < allContacts.length; i++) {
            const element = allContacts[i];
            const firstLetter = getLetters(element['name']) // element['name'].charAt(0).toUpperCase();
            const checkChecked = checked(i);
            contactdiv.innerHTML += `
            <div onclick="checkTheAssign(${i})" class="assigneContact">
            <div class="assigned-circle" style="background-color: ${element['bgcolor']};">${firstLetter}</div>
            <p>${element['name']}</p> 
            <input onclick="checkTheAssign(${i})" ${checkChecked} id="check${i}" type="checkbox">
            </div>`
        }
    } else {
        contactdiv.classList.add('display-none');
        showAssignedPersons();
    }
}


/**
 * generate html for the added subtask
 */
function generateSubTask() {
    let addedSubtask = document.getElementById('addSubtask');
    addedSubtask.innerHTML = ``;
    for (let i = 0; i < subTasks.length; i++) {
        const element = subTasks[i];
        addedSubtask.innerHTML += `
        <div class="input-subtask" ondblclick="editSubtask(${i})">
        <input id=subTask${i}  type="text" disabled   value="${element['task']}">
        <div class="subtaskIcons">
        <img src="assets/img/edit-subtask.svg" onclick="editSubtask(${i})" id=subTaskEdit${i} alt="" srcset="">
        <img src="assets/img/check-change.svg" class="display-none" onclick="confirmeditSubtask(${i})" id=checksubTaskEdit${i} alt="" srcset="">
        <img src="assets/img/vector-subtask.svg" id=subTaskEdit${i} alt="" srcset="">
        <img src="assets/img/delet.svg" onclick="deletSubtask('${element['task']}')" id=deleteSubtask${element['task']} alt="" srcset="">
        </div>
        </div>
        `
    }
}
async function initBoardForm() {
    await loadAllTask(); //load all backend tasks
    await loadContacts();

    const column = ['todo-tasks', 'inprogress-tasks', 'Feedback-tasks', 'done-tasks'];
    const category = ['To Do', 'In progress', 'Await feedback', 'Done'];

    for (let i = 0; i < 1; i++) {
        let tasks = allTasks.filter(t => t['category'] == category[i]);
        document.getElementById(column[i]).innerHTML = '';

        if (tasks.length === 0) {
            document.getElementById(column[i]).innerHTML = `<div class="no-tasks"><span>No tasks ${column[i]}</span></div>`;
        } else {
            for (let index = 0; index < tasks.length; index++) {
                const element = tasks[index];
                document.getElementById(column[i]).innerHTML += generateTodoHTML(element);
                alert(column[i], "done")
            }
        }
    }
    // actUser();
};

// generate the canbancard out form the task backand file

function generateTodoHTML(element) {

    // const hasAssignedUser = element.assigned && element.assigned.length > 0;
    const hasSubTasks = element.subTasks && element.subTasks.length > 0;

    // Count finished and total subtasks
    const totalSubTasks = element.subTasks.length;
    const finishedSubTasks = element.subTasks.filter(subtask => subtask.done === 1).length;


    // Map priority names to their corresponding SVG URLs
    const topicColor = {
        'User Storys': '#008bff',
        'Technical Support': '#b400ff',
        'Coding': '#ffc107'
    };

    // Get the color code for the topic

    const toipcColorCode = topicColor[element.topic]

    // Map priority names to their corresponding SVG URLs
    const priorityIcons = {
        'urgentBtn': 'assets/img/prio-alta.svg',
        'mediumBtn': 'assets/img/prio-media.svg',
        'lowBtn': 'assets/img/prio-baja.svg'
    };

    // Get the URL for the priority icon based on the priority value
    const priorityIconUrl = priorityIcons[element.prio];

    // create an only nominal progress %

    const percentage = Math.round((finishedSubTasks / totalSubTasks) * 100);

    // Check if element.assigned is an array
    const assignedUsers = Array.isArray(element.assigned) ? element.assigned : [];

    // // Loop through assigned users and create a circle for each with the assigned color and initials
    // const assignedCircles = assignedUsers.map(assigned => {
    //     const userInitial = assigned.initial.toUpperCase();
    //     const assignedColor = assigned.color;
    //     const circleStyle = `style="background-color: ${assignedColor}"`;

    //     return `<div class="assigned-circle assigned-circle-txt" ${circleStyle}>${userInitial}</div>`;
    // });

    // create the HTMLelemts with the save informations
    return /*html*/`    
    <div class="board-card" draggable="true" ondragstart="drag(${element['createdAt']})" id=""
            ondblclick="fullscreen(${element['createdAt']})">
            <div><span class="lable-board-card" style="background-color: ${toipcColorCode}">${element['topic']}</span>
                <!-- <button class="delete-button" onclick="clearTask(${element['createdAt']})">
                    <img src="assed/svg/contact-imgs/delete.svg" alt="" class="delete-img" />
                </button> -->
            </div>
            <div>
                <h3>${element['title']}</h3>
            </div>
            <div><span>${element['description']}</span></div>
            <div class="progress">
                <progress id="progress" aria-valuenow="${(finishedSubTasks / totalSubTasks * 100)}" aria-valuemin="0"
                    aria-valuemax="100"></progress>
                ${hasSubTasks ? `<span>Subtasks: ${finishedSubTasks}/${totalSubTasks}</span>` : `<span>No
                    subtasks.</span>`}
            </div>
            <div class="frame-139 d-none">Due Date: ${element['dueDate']}</div>
            <div class="icons">              
                <img src="${priorityIconUrl}" alt="Priority Icon">
            </div>  
        </div>      
</div>
    `
        ;
}

// <!-- <div class="icon-board">
// ${assignedCircles.join('')} Join the circles together 
// ${assignedUsers.length > 0 ? `<div class="frame-139">Assigned: ${element['assigned'].join(', ')}</div>` : `<div class="frame-139">No user assigned.</div>`}
// </div> -->
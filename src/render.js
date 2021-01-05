const { ipcRenderer } = require('electron');
let tasks = [];
let timer;

// let select_type = document.getElementById('type-select');
// select_type.addEventListener('change', ()=>{
//     let current_type = select_type.value
//     if (current_type == "1") {
//         document.getElementById('className_wrapper').style.display = 'block';
//         document.getElementById('className').disabled = false;

//         document.getElementById('classUrl_wrapper').style.display = 'none';
//         document.getElementById('classUrl').disabled = true;

//     }
//     if (current_type == "2") {
//         document.getElementById('className_wrapper').style.display = 'none';
//         document.getElementById('className').disabled = true;

//         document.getElementById('classUrl_wrapper').style.display = 'block';
//         document.getElementById('classUrl').disabled = false;
        
//     }
// });


document.getElementById('add-cofirm').addEventListener('click', (e) => {
    const name = document.getElementById('name').value;
    const typeSelect = document.getElementById('type-select').value;
    const classIdentifier = document.getElementById('classIdentifier').value;
    // const className = document.getElementById('className').value;
    // const classUrl = document.getElementById('classUrl').value;
    const taskTime = document.getElementById('task-time').value;
    const taskInterval = document.getElementById('task-interval').value;

    if (!name || typeSelect === "0" || !taskTime || !taskInterval || !classIdentifier) return;
    // if (typeSelect === "1"){
    //     if (!className) return;
    // } else {
    //     if (!classUrl) return;
    // }

    addTaskToStack({
        name,
        typeSelect: parseInt(typeSelect),
        classIdentifier,
        taskTime: taskTime.split(":").map(num => parseInt(num)),
        taskInterval: parseInt(taskInterval)
    });
});


function deleteTask(id) {
    tasks.splice(id, 1);
    refreshTasks();
}


function addTaskToStack(task) {
    tasks.push(task);
    refreshTasks();
}

function refreshTasks() {
    let final_html = '';
    let index = 0;
    tasks.map(t => {
        final_html += `
        <tr>
            <td>${index+1}</td>
            <td>${t.name}</td>
            <td id="${index}Time" ></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="startTask(${index});"><i class="bi bi-arrow-bar-left"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index});"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
        `;
        index++;
    });
    document.getElementById('tasksList').innerHTML = final_html;
    updateTimers((i) => {
        startTask(i);
        // console.log(`${i} finished. Starting task...`, tasks[i])
    });
}

function startTask(id) {
    ipcRenderer.invoke('activate-task', tasks[id]);
}


function updateTimers(callBack) {
    clearInterval(timer);
    timer = null;
    timer = setInterval(() => {
        for (let i = 0; i < tasks.length; i++) {
            var today = new Date();
            var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), tasks[i].taskTime[0], tasks[i].taskTime[1], 0);
            var countDownDate = myToday.getTime();
            // Get today's date and time
            var now = new Date().getTime();
    
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
    
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    
            document.getElementById(`${i}Time`).innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    
            if (distance < 0) {
                document.getElementById(`${i}Time`).innerHTML = '';
                callBack(i);
                deleteTask(i);
            }
        }
    }, 1000);

    return timer;
}


function deleteCookies() {
    ipcRenderer.invoke('delete-cookies');
}
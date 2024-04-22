taskform.addEventListener('submit', async event => {
    event.preventDefault();
    const task = document.getElementById('task').value;
    const est_time = document.getElementById('est_time').value;
    const description = document.getElementById('description').value;
    const manager=localStorage.getItem('username');

    const end = `/data-api/rest/Tasks/`;
    const res = await fetch(end);
    const result=await res.json();
    let d=result.value;

    const check=taskNameValid(d,task);
        
    if(check==1){
        //posts data to database
        const data={
        manager: manager,
        task: task,
        description: description,
        est_time: est_time
    }

        const endpoint = `/data-api/rest/Tasks/`;
        const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
        });
        window.location.reload();

    }
    else{
        alert("The task already exists");
    }

    
    
});

//gets the username of the manager
const manager=localStorage.getItem('username');
//renders the tasks for the manager to see
async function renderTasks(manager){
    const endpoint = `/data-api/rest/Tasks/`;
    const response = await fetch(endpoint);
    const result=await response.json();
    let data=result.value;
    console.log(data);
    data= getTasks(manager,data);

    //renders here
    data.forEach((entry, index) => {
        const task = document.createElement('block');
        task.classList.add('staff-card');
        task.innerHTML = `
            <h2>Task: ${entry.task}</h2>
            <p><strong>Discription:</strong> ${entry.description} </p>
            <p><strong>Estimated Time:</strong> ${entry.est_time} minutes </p>
            <hr width="90%" align="center"/>
            <section>
                <section id="${entry.task}">Shaneel: 0 minutes <section/>
            <section/> 
            <hr width="90%" align="center"/>
            <h3>Total Time: 0 minutes<h3/>
        `;
        staffList.appendChild(task);
    });
}

//takes in the arr of data,manager and outputs an arr of tasks that the manager has created
function getTasks(manager,json){
    const toreturn=[];
    for(const obj of json){
        if(obj.manager==manager){
            toreturn.push(obj);
        }
    }
    return toreturn;
}

renderTasks(manager);

//function makes sure that task doesnt already exist
//takes in arr of objects and a task
function taskNameValid(json,task){
    for(const obj of json){
        if(obj.task==task){
            return 0; //task already exists
        }
    }
    return 1; //task doesnt exist
}

/*test taskNameValid, getTasks will use[
    {
        "task_id": 1,
        "manager": "keren",
        "task": "Test",
        "description": "This is a test",
        "est_time": 5
    },
    {
        "task_id": 2,
        "manager": "keren",
        "task": "Task",
        "description": "I dont know",
        "est_time": 545
    },
    {
        "task_id": 3,
        "manager": "random",
        "task": "finance statements",
        "description": "This is a test",
        "est_time": 88
    },
    {
        "task_id": 4,
        "manager": "keren",
        "task": "Task1",
        "description": "d",
        "est_time": 55
    },
    {
        "task_id": 5,
        "manager": "keren",
        "task": "Task2",
        "description": "tgg",
        "est_time": 4
    }
]*/
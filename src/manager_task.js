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
    //console.log(data);
    data= getTasks(manager,data);

    //renders here
    data.forEach((entry, index) => {
        const task = document.createElement('section');
        task.classList.add('staff-card');
        task.innerHTML = `
            <h2>Task: ${entry.task}</h2>
            <p><strong>Discription:</strong> ${entry.description} </p>
            <p><strong>Estimated Time:</strong> ${entry.est_time} minutes </p>
            <hr width="90%" align="center"/>
            <p id="${entry.task}"><p/>
            <hr width="90%" align="center"/>
            <p id="${entry.task}time" sum="0"><p/>
        `;
        staffList.appendChild(task);
    });


    //adds tasks dropdown options
    const dropdownTask=document.getElementById("taskdrop");
    const managersTasks=getManagersTasks(data,manager);
    managersTasks.forEach(function(optionText,index) {
        let option = document.createElement("option");
        option.text=optionText;
        option.value = managersTasks[index];
        dropdownTask.add(option);
      });

    //add staff dropdown options
    const dropdownStaff=document.getElementById("staffdrop");
    const end1 = `/data-api/rest/Users`;
    const res1 = await fetch(end1);
    const result1=await res1.json();
    let d1=result1.value;
    const staffmembers=getStaff(d1);
    staffmembers.forEach(function(optionText, index) {
        var option = document.createElement("option");
        option.text = optionText;
        option.value = staffmembers[index];
        dropdownStaff.add(option);
      });

     //add each staff to the right task with num minutes worked
    const endpoint12 = `/data-api/rest/Time`;
    const response12 = await fetch(endpoint12);
    const result12=await response12.json();
    let data12=result12.value;
     //console.log(data12);
     for(i=0;i<data12.length;i++){
         if(managersTasks.includes(data12[i].task)){
            const container=document.getElementById(data12[i].task);
            const toadd=document.createElement("p");
            toadd.innerHTML=`
            <strong>${data12[i].staff}</strong>: ${data12[i].total_time} minutes
            `
            //updates the time to give total time on each tile
            container.appendChild(toadd);
            const e=document.getElementById(data12[i].task+"time");
            const c=document.getElementById(data12[i].task+"time").getAttribute("sum");
            let sum=parseInt(c)+data12[i].total_time;
            const a=e.setAttribute("sum",sum);
            e.textContent=`Total Time: ${sum} minutes`;
         }
     }

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

//get all staff, returns arrary of staff
function getStaff(json){
    const data=[];
    for(const obj of json){
        if(obj.role=="Staff"){
            data.push(obj.username);
        }
    }
    return data;
}
//get a list of tasks the manager has created
function getManagersTasks(json,manager){
    const data=[];
    for(const obj of json){
        if(obj.manager==manager){
            data.push(obj.task);
        }
    }
    return data;
}
//checks if assignment doesnt already exist
function existsAssignment(json,task,staff){
    for(const obj of json){
        if(obj.task==task && obj.staff==staff){
            return 0; //already exists
        }
    }
    return 1; //doesnt exist
}
//adds assignment
assignment.addEventListener('submit', async event => {
    event.preventDefault();
    const task=document.getElementById("taskdrop").value;
    const staff=document.getElementById("staffdrop").value;
    //checks if valid
   const end = `/data-api/rest/Assignment`;
    const res = await fetch(end);
    const result=await res.json();
    let d=result.value;
    console.log(d);
    const check=existsAssignment(d,task,staff);
    if(check==1){
        const data={
            task:task,
            staff:staff
        }
    
            const endpoint = `/data-api/rest/Assignment`;
            const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
            });

        const data1={
            task:task,
            staff:staff,
            total_time:0
        } 
            const end = `/data-api/rest/Time`;
            const res = await fetch(end, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data1)
            });   
        window.location.reload();
    }
    else{
        alert("The asssignment already exists");
    }
    
    //add entry in time table with 0 minutes
});

//data for excel timesheets
async function fetchUsers() {
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

async function fetchDateTimeLog() {
    const endpoint = `/data-api/rest/DateTimeLog`;
    const response = await fetch(endpoint);
    const logData = await response.json();
    return logData.value;
}

async function loadJustStaffDropDown() {
    const data = await fetchUsers();
    const dropdown = document.getElementById("staffSelection");

    const staffData = data.filter(obj => obj.role === "Staff");
    staffData.forEach(staff => {
        const optionStaff = document.createElement("option");
        optionStaff.value = staff.username;
        optionStaff.text = staff.username;
        dropdown.add(optionStaff);
    });
}
loadJustStaffDropDown();
document.getElementById('genExcelFile').addEventListener('click', async e => {
    e.preventDefault();
    console.log("Button clicked");
    const staffMember = document.getElementById("staffSelection").value;
    if (!staffMember) {
        // Display tooltip if staff member is not selected
        document.getElementById("staffSelection").title = "Please choose a staff member.";
        return;
    } else {
        // Reset tooltip if staff member is selected
        document.getElementById("staffSelection").title = "";
    }

    const logData = await fetchDateTimeLog();

    const filteredData = logData.filter(entry => entry.staff === staffMember);

    const taskTimeMap = {};
    filteredData.forEach(entry => {
        const taskKey = `${entry.task}-${entry.log_date}`;
        if (!taskTimeMap[taskKey]) {
            taskTimeMap[taskKey] = { task: entry.task, log_date: entry.log_date, staff: entry.staff, total_time: 0 };
        }
        taskTimeMap[taskKey].total_time += entry.time_logged;
    });

    const processedData = Object.values(taskTimeMap);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${staffMember}_TimeSheet`);

    worksheet.columns = [
        { header: 'Task', key: 'task' },
        { header: 'Log Date', key: 'log_date' },
        { header: 'Staff', key: 'staff' },
        { header: 'Total Time Logged', key: 'total_time' }
    ];

    processedData.forEach(item => {
        worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${staffMember}_time_logs_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

//exports functions to be used for testing
module.exports = {renderTasks, existsAssignment, taskNameValid, getManagersTasks, getStaff, getTasks};
/*test existsAssignment,getManagersTasks,getStaff,taskNameValid,getTasks will use[
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
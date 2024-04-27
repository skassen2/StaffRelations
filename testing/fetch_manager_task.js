const M = require('../src/manager_task.js');

async function renderTasks(manager){
    const endpoint = `/data-api/rest/Tasks/`;
    const response = await fetch(endpoint);
    const result=await response.json();
    let data=result.value;
    //console.log(data);
    data= M.getTasks(manager,data);

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
    const staffmembers=M.getStaff(d1);
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
     console.log(data12);
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

module.exports = {renderTasks};
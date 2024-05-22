let staffs = [
    {
        "name": "Jaedon",
        "surname": "Moodley",
        "username": "JMoodley",
        "password": "JM2323",
        "role": "Staff"
    },
    {
        "name": "Shaneel",
        "surname": "Kassen",
        "username": "SKassen",
        "password": "SK1212",
        "role": "Manager"
    },
    {
        "name": "Prashant",
        "surname": "Kessa",
        "username": "PKessa",
        "password": "PK3345",
        "role": "Staff"
    }
]
const staffList = document.getElementById('staffList');
staffList.innerHTML = '';
renderStaffList();
const staffForm = document.getElementById('staffForm');
staffForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    staffs.push({ name, surname, username, password, role }); 
    const index = staffs.length - 1; 
    
    const staffMember = document.createElement('block');
    staffMember.classList.add('staff-card');
    staffMember.innerHTML = `
        <h2>${name} ${surname}</h2>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Role:</strong> ${role}</p>
        <button class="btn-remove delete" data-index="${index}">Delete</button>
    `;
    staffList.appendChild(staffMember);
    staffForm.reset();
});

//where the deleting happens
staffList.addEventListener('click', async event => {
    const index = event.target.dataset.index;
    
    const personToDelete=usernameAndRole[index][0]; 
    
    //get id of rows in database that needs to be deleted from every table
    if(usernameAndRole[index][1]=="Manager"){
        //get managers tasks
        const managersTasks=[]
        let dataTasks1=await fetchTasks();
        for(const obj of dataTasks1){
            if(obj.manager==personToDelete){
                managersTasks.push(obj.task);
            }
        }
        //gets relevant ids based on the task managersTasks.includes(obj.task)
        const timeId=[]
        let datatime=await fetchTime();
        for(const obj of datatime){
            if(managersTasks.includes(obj.task)){
                timeId.push(obj.id);
            }
        }
        console.log("time",timeId);

        const assignmentId=[]
        let dataAssignment=await fetchAssignment();
        for(const obj of dataAssignment){
            if(managersTasks.includes(obj.task)){
                assignmentId.push(obj.assignment_id);
            }
        }
        console.log("Assignment",assignmentId);

        const tasks=[]
        let dataTasks=await fetchTasks();
        for(const obj of dataTasks){
            if(managersTasks.includes(obj.task)){
                tasks.push(obj.task_id);
            }
        }
        console.log("tasks",tasks);

        const feedback=[]
        let dataFeedback=await fetchFeedback();
        for(const obj of dataFeedback){
            if(managersTasks.includes(obj.task) || obj.sender==personToDelete || obj.receiver==personToDelete){
                feedback.push(obj.id);
            }
        }
        console.log("feedback",feedback);

        let dataMealOrders=await fetchMealOredrs();
        const orderIDs=[];
        for(const obj of dataMealOrders){
            if(obj.username==personToDelete){
                orderIDs.push(obj.order_id);
            }
        }
        console.log(orderIDs,"food orders");

        //do deleting
        //delete from time
       for(const id of timeId){
            const endpoint = '/data-api/rest/Time/id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from assignment
        for(const id of assignmentId){
            const endpoint = '/data-api/rest/Assignment/assignment_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from tasks
        for(const id of tasks){
            const endpoint = '/data-api/rest/Tasks/task_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from feedback
        for(const id of feedback){
            const endpoint = '/data-api/rest/Feedback/id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from users
        const endpoint = '/data-api/rest/Users/username';
        const response = await fetch(`${endpoint}/${personToDelete}`, {
            method: "DELETE"
        });
        //delete from meal_order
        for(const id of orderIDs){
            const endpoint = '/data-api/rest/Meal_orders/order_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        
        
    }
    else{
        const timeId=[]
        let datatime=await fetchTime();
        for(const obj of datatime){
            if(obj.staff==personToDelete){
                timeId.push(obj.id);
            }
        }
        console.log("time",timeId);

        const assignmentId=[]
        let dataAssignment=await fetchAssignment();
        for(const obj of dataAssignment){
            if(obj.staff==personToDelete){
                assignmentId.push(obj.assignment_id);
            }
        }
        console.log("Assignment",assignmentId);

        const tasks=[]
        let dataTasks=await fetchTasks();
        for(const obj of dataTasks){
            if(obj.manager==personToDelete){
                tasks.push(obj.task_id);
            }
        }
        console.log("tasks",tasks);

        const feedback=[]
        let dataFeedback=await fetchFeedback();
        for(const obj of dataFeedback){
            if(obj.sender==personToDelete || obj.receiver==personToDelete){
                feedback.push(obj.id);
            }
        }
        console.log("feedback",feedback);

        let dataMealOrders=await fetchMealOredrs();
        const orderIDs=[];
        for(const obj of dataMealOrders){
            if(obj.username==personToDelete){
                orderIDs.push(obj.order_id);
            }
        }
        console.log(orderIDs,"food orders");

        //do deleting
        //delete from time
       for(const id of timeId){
            const endpoint = '/data-api/rest/Time/id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from assignment
        for(const id of assignmentId){
            const endpoint = '/data-api/rest/Assignment/assignment_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from tasks
        for(const id of tasks){
            const endpoint = '/data-api/rest/Tasks/task_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from feedback
        for(const id of feedback){
            const endpoint = '/data-api/rest/Feedback/id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
        //delete from users
        const endpoint = '/data-api/rest/Users/username';
        const response = await fetch(`${endpoint}/${personToDelete}`, {
            method: "DELETE"
        });
        //delete from meal_order
        for(const id of orderIDs){
            const endpoint = '/data-api/rest/Meal_orders/order_id';
            const response = await fetch(`${endpoint}/${id}`, {
            method: "DELETE"
            });
        }
    }
    window.location.reload();
    
});

const usernameAndRole=[];
async function renderStaffList() {
    const data=await getStaffManager();
    staffList.innerHTML = '';
    data.forEach((staff, index) => {
        const toadd=[staff.username,staff.role];
        usernameAndRole.push(toadd);
        const staffMember = document.createElement('block');
        staffMember.classList.add('staff-card');
        staffMember.innerHTML = `
            <h2>${staff.name} ${staff.surname}</h2>
            <p><strong>Username:</strong> ${staff.username}</p>
            <p><strong>Role:</strong> ${staff.role}</p>
            <button class="btn-remove delete" data-index="${index}">Delete</button>
        `;
        staffList.appendChild(staffMember);
    });
}

async function getStaffManager(){
    const data=[]
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const result = await response.json();
    const toadd=result.value;
    toadd.forEach((person)=>{
        if(person.role=="Staff" || person.role=="Manager"){
            data.push(person);
        }
    })
    return data;
}

async function fetchFeedback() {
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchAssignment() {
    const endpoint = `/data-api/rest/Assignment`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchUsers() {
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchTasks() {
    const endpoint = `/data-api/rest/Tasks`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchTime() {
    const endpoint = `/data-api/rest/Time`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchMealOredrs() {
    const endpoint = `/data-api/rest/Meal_orders`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}


//export fucntions for testing
module.exports = {getStaffManager, renderStaffList, fetchAssignment, fetchFeedback, fetchTasks, fetchTime, fetchUsers, fetchMealOredrs};
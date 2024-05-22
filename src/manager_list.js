const staffList = document.getElementById('staffList');

let staffs = [
    {
        "name": "Jaedon",
        "surname": "Moodley",
        "username": "JMoodley",
        "password": "JM2323",
    },
    {
        "name": "Shaneel",
        "surname": "Kassen",
        "username": "SKassen",
        "password": "SK1212",
    },
    {
        "name": "Prashant",
        "surname": "Kessa",
        "username": "PKessa",
        "password": "PK3345",
    }
]

staffList.innerHTML = '';
renderStaffList();

async function renderStaffList() {
    const data=await getStaff();
    staffList.innerHTML = '';
    data.forEach((staff, index) => {
        const staffMember = document.createElement('block');
        staffMember.classList.add('staff-card');
        staffMember.innerHTML = `
            <h2>${staff.name} ${staff.surname}</h2>
            <p><strong>Username:</strong> ${staff.username}</p>
        `;
        staffList.appendChild(staffMember);
    });
}

async function getStaff(){
    const data=[]
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(`${endpoint}`);
    const result = await response.json();
    const toadd=result.value;
    toadd.forEach((person)=>{
        if(person.role=="Staff"){
            data.push(person);
        }
    })
    return data;
}

//export functions for testing
module.exports = {getStaff, renderStaffList};
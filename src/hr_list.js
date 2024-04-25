const staffList = document.getElementById('staffList');

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

staffList.innerHTML = '';
renderStaffList();

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
        <button class="btn" id="changePermissions_${index}">Change Permissions</button>
        <button class="btn" id="removeAccess_${index}">Remove Access</button>
        <button class="btn-remove delete" data-index="${index}">Delete</button>
    `;
    staffList.appendChild(staffMember);
    staffForm.reset();
});


staffList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-remove')) {
        const index = event.target.dataset.index;
        console.log("delete index"+ index);
        staffs.splice(index, 1);
        renderStaffList();
    }
});

function renderStaffList() {
    staffList.innerHTML = '';
    staffs.forEach((staff, index) => {
        const staffMember = document.createElement('block');
        staffMember.classList.add('staff-card');
        staffMember.innerHTML = `
            <h2>${staff.name} ${staff.surname}</h2>
            <p><strong>Username:</strong> ${staff.username}</p>
            <p><strong>Role:</strong> ${staff.role}</p>
            <button class="btn" id="changePermissions_${index}">Change Permissions</button>
            <button class="btn" id="removeAccess_${index}">Remove Access</button>
            <button class="btn-remove delete" data-index="${index}">Delete</button>
        `;
        staffList.appendChild(staffMember);
    });
}
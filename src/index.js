const CALLBACK_URL = 'https://jolly-ocean-04e2df210.5.azurestaticapps.net/temp.html';

async function login(){
    //calls checkLog to check if username and password is correct
    const input1Value = document.getElementById('username').value.trim();
    const input2Value = document.getElementById('password').value.trim();
    const alert=document.getElementById('alert');

    if (input1Value !== '' && input2Value !== '') {
        let check=await checkLogin(input1Value,input2Value);
        console.log(check);
        if(check==-1){
            alert.textContent="Invalid username";
        }
        else if(check==0){
            alert.textContent="Incorrect password";
        }
        else{
            alert.textContent="loging in...";
            let role=await getRole(input1Value);
            console.log(role);
            //direct to staff,manager,hr page
            // Set the data in localStorage
            localStorage.setItem('data',input1Value );
            localStorage.setItem('role',role );
            // Navigate to the second page
            window.location.href = `https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&response_mode=query&scope=openid profile email`;
        }
    } else {
    console.log("Please fill in both input fields.");
    }
}

async function checkLogin(username,password){
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const result = await response.json();
    const data=result.value;
    for (const obj of data) {
        if(obj.username==username){
            if(obj.password==password){
                return 1 //username and password valid
            }
            else{
                return 0 //username valid password invalid
            }
        }
      }

    return -1 //username not found
}

async function getRole(user){
    const endpoint = `/data-api/rest/Users/username`;
    const response = await fetch(`${endpoint}/${user}`);
    const result = await response.json();
    const data=result.value[0].role;
    return data;
}
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
        }
        //if check is 1 0 or -1
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
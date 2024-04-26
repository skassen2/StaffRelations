//Non-fetch functions from manager_task 
function getTasks(manager,json){
    const toreturn=[];
    for(const obj of json){
        if(obj.manager==manager){
            toreturn.push(obj);
        }
    }
    return toreturn;
}

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

module.exports = {existsAssignment, getManagersTasks, getTasks, taskNameValid, getStaff};
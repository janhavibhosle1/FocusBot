const Client = require('mattermost-client');
const {MongoClient, MongoGridFSChunkError} = require('mongodb');
let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "@focusbot";
const uri = "mongodb://localhost:27017";
let client = new Client(host, group, {});
let dbClient = new MongoClient(uri);
let manager_id = process.env.MANAGERID
managers = manager_id.split(",")
console.log(managers)
TOWN_CHANNEL_ID=process.env.CHANNELID

//This function listens any messages from the mattermost client.
//It calls the hears() function with data received from mattermost client
async function main()
{
   
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    await dbClient.connect();

    client.on('message',function(msg)
    {
        console.log(msg);
        if (hears(msg,/assign/i))
        {
          upload_content(msg) 
          
        } 
        if (hears(msg,/view/i))
        {
            //to parse through the content to check if the user wants to see his specific task or a the tasks
            //syntax view User:all or view User:Rob
            let user_view = parse_content_view(msg)
            //redirects to the print statement
            respond(msg,user_view);
        }     
        if (hears(msg,/completed/i))
        {
            //checks for the task name, if it exists it removes the task from the db. 
            delete_content(msg)
            //check the user name to print the remaining tasks for him
            //let user_view = parse_content_view(msg)
            //display the remaining tasks for that particular user
            //remaining_tasks(msg,user_view);
        }  
        if (hears(msg,/help/i))
        {
          respond_to_help(msg)
        }
    });
}

//function to provide the user assistance on how to perform the operations
async function respond_to_help(msg)
{
  let channel = msg.broadcast.channel_id;
  if (channel !== TOWN_CHANNEL_ID){
    let str_output = "Hello! Welcome to the Focus Bot. I can perform the following tasks:\n\
    1. Assign tasks (Format: Assign tasks to User: <username>, Task Name: <task-name>, Priority: <high or low>) \n\
    2. View all tasks or View a particular user tasks (Format: View User:<user-name/all>) \n\
    3. Mark a specific task complete (Format: Completed Task:<taskname>, User:<username>)"
    let w = client.postMessage(str_output,channel)
    return w;
  }
}

//function to delete the content of that user
// Completed Task:<taskname>, User:<username>
async function delete_content(msg)
{
  let channel=msg.broadcast.channel_id;
  if (channel !== TOWN_CHANNEL_ID){
    if (msg.data.post){
      let n = JSON.parse(msg.data.post)
      user_index = n.message.search(/user/i)
      taskname_index = n.message.search(/task/i)
      if (taskname_index < user_index)
      {
        task_name = ((n.message.slice(taskname_index,user_index)).split(":")[1].trim().toUpperCase()).replace(/[^a-zA-z0-9]/g,"")
        user = ((n.message.slice(user_index)).split(":")[1].trim().toUpperCase()).replace(/[^a-zA-z0-9]/g,"")
      }else
      {
        let w = client.postMessage("Task is not being marked complete properly, use help for assistance",channel);
        return w;
      }
    }
    console.log(user + " " + task_name)
    if (user.length == 0 || task_name.length == 0){
      let w = client.postMessage("Task is not being marked complete properly, use help for assistance",channel);
      return w;
    }
    var complete_task_in_db = await CompleteTask(user,task_name)
    if (complete_task_in_db === false){
      let w = client.postMessage("The Task being marked for completion does not exist. Please check the tasks assigned to you and then update the correct task as complete",channel);
      return w;
    }else
    {
      let str_output = "Task Name: " + task_name + ", User: " + user 
      let w = client.postMessage("The task has been marked complete. Task Details:\n" + str_output,channel);
      return w;
    }
  }
}

function parse_content_view(msg)
{
    if (msg.data.post){
      let n=JSON.parse(msg.data.post)
      temp_n =n.message.split(",")
      for (var i=0;i<temp_n.length; i++){
        if (temp_n[i].match(/user:/i)){
          user_parse = (temp_n[i]).split(/user:/i)[1].trim().toUpperCase()
      }
      }
      console.log(user_parse)
      return user_parse
    }
    return false
}
//function to string manipulate the message received from mattermost
async function upload_content(msg)
{
  //console.log(msg)
  let channel=msg.broadcast.channel_id;
  //console.log(channel)
  if (channel !== TOWN_CHANNEL_ID){
    if (managers.indexOf(msg.data.sender_name)<0){//give the managerID environment variable here
      let w = client.postMessage("Sorry, Only a manager can assign tasks!",channel);
      return w;
    }
    if (msg.data.post){
      
      let m = JSON.parse(msg.data.post)
      //console.log(m.message)
      //Assign tasks to User: Rob, Task Name: Focusbot, Priority: High//
      user_index = m.message.search(/user/i)
      taskname_index = m.message.search(/task name/i)
      priority_index = m.message.search(/priority/i)

      if ((user_index < taskname_index) && (user_index <priority_index) && (taskname_index <priority_index))
      {
        user = ((m.message.slice(user_index,taskname_index)).split(":")[1].trim().toUpperCase()).replace(/[^a-zA-z0-9]/g,"")
        //console.log(user)
        task_name = ((m.message.slice(taskname_index,priority_index)).split(":")[1].trim().toUpperCase()).replace(/[^a-zA-z0-9]/g,"")
        //console.log(task_name)
        priority = ((m.message.slice(priority_index)).split(":")[1].trim().toUpperCase()).replace(/[^a-zA-z0-9]/g,"")
        //console.log(priority)
      }else
      {
        let w = client.postMessage("Task is not being assigned properly, use help for assistance",channel);
        return w;
      }
      console.log(user + " " + task_name + " " + priority)
      if (user.length === 0 || task_name.length === 0 || priority.length === 0)
      {
        let w = client.postMessage("Task is not being assigned properly, use help for assistance",channel);
        return w;
      }

      var db_output = await insertTasks(user,task_name,priority)
      if (db_output.length > 0){
          str_output = ""
          db_output.forEach(ele =>{
          user = ele.AssignedTo
          task_name = ele.TaskName
          priority = ele.priority
        })
        str_output = "The same task is already assigned to the same user. Details:\nTask Name: " + task_name + " User: " + user
        let w = client.postMessage(str_output,channel)
        return w;
      }else
      {
        let str_output = "Employee Name: " + user + ", Task Name: " + task_name + ", Priority: " + priority
        let w = client.postMessage("The task has been assigned. \nTask details: " + str_output,channel);
        return w;
      }
          
      }
      return false
  }
}

function hears(msg,text){
    if(msg.data.sender_name == bot_name) return false;
    if (msg.data.post){
        let re = JSON.parse(msg.data.post)
        if(re.message.search(text)>=0){
            return true;
        }

    }
    return false
}

//generating a mettermost response for two cases i) user wants to view all the tasks ii) user wants to view the tasks assigned to a particular person
async function respond(msg,u){
  let channel=msg.broadcast.channel_id;
  if (channel !== TOWN_CHANNEL_ID){
    console.log(u)
    if (u === ""){
      let str_output = "Please mention either the user name or all when trying to view tasks. Please use help to view the format"
      let w = client.postMessage(str_output,channel)
      return w;
    }
    if ((u === "all") || (u==="All") || (u==="ALL"))
    {
      const result = await dbClient.db("FocusBot").collection("EmployeeTasks").find();
      re = await result.toArray();
      console.log(re)
      if (re.length > 0){
        let str_output = [];
        re.forEach(ele =>{
          tasks_data = "Employee Name: " + ele.AssignedTo + ", Task Name: " + ele.TaskName + ", Priority: " + ele.Priority + "\n"
          str_output.push(tasks_data);
        })
        console.log(str_output)
        let w = client.postMessage("Details: \n" + str_output,channel)
        return w;
      }else{
        let str_output = "There are no tasks in the database."
        let w = client.postMessage(str_output,channel)
        return w;
      }
    }else {
      const result = dbClient.db("FocusBot").collection("EmployeeTasks").find({"AssignedTo":u})
      re = await result.toArray();
      console.log(re)
      if (re.length > 0){
        let str_output = [];
        re.forEach(ele =>{
          tasks_data = "Employee Name: " + ele.AssignedTo + ", Task Name: " + ele.TaskName + ", Priority: " + ele.Priority + "\n"
          str_output.push(tasks_data);
        })
        console.log("stroutput: " + str_output)
        let w = client.postMessage("Task Details: \n" + str_output,channel)
        return w;
      }else{
        let str_output = "The current user either has no more tasks assigned to him in the database or no tasks have been assigned to him"
        let w = client.postMessage(str_output,channel)
        return w;
      }
    }
 }
}

//used for testing
(async () => 
{
    if (process.env.NODE_ENV != 'test') {
        await main();
    }
})()
//,${msg.data.sender_name}`
async function insertTasks(user,task_name,priority){
  let employeeData = {
    "TaskName":task_name,
    "AssignedTo":user,
    "Priority":priority
  }
  const result = await dbClient.db("FocusBot").collection("EmployeeTasks").find(employeeData);
  re = await result.toArray();
  if (re.length > 0){
    //console.log("Duplicate found")
    console.log(result)
    return re
    
  }else{
    const result = await dbClient.db("FocusBot").collection("EmployeeTasks").insertOne(employeeData);
    console.log(result)
    return re
  }
  
}

async function CompleteTask(user,task_name){
  let taskCompletionData ={
    "TaskName": task_name,
    "AssignedTo":user
  }
  console.log(taskCompletionData)
  const result = await dbClient.db("FocusBot").collection("EmployeeTasks").find(taskCompletionData)
  re = await result.toArray();
  console.log(re)
  if (re.length === 1){
    re.forEach(ele => {
      task_db_id = ele._id
      console.log(task_db_id)
    })
    const delete_result = await dbClient.db("FocusBot").collection("EmployeeTasks").deleteOne({"_id":task_db_id})
    console.log(delete_result)
    return delete_result
  }else{
    return false
  }
}


module.exports.hears = hears;
module.exports.main = main;
module.exports.upload_content = upload_content;
module.exports.delete_content = delete_content;
module.exports.respond = respond;
module.exports.respond_to_help = respond_to_help;
module.exports.parse_content_view = parse_content_view;
module.exports.insertTasks = insertTasks;
module.exports.CompleteTask = CompleteTask;

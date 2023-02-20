const Client = require('mattermost-client');
var mongodb = require('mongo-mock');
let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "focus-bot";
let client = new Client(host, group, {});
//This function listens any messages from the mattermost client.
//It calls the hears() function with data received from mattermost client
//console.log("test");

// Use connect method to connect to the Server


class Employer {
  constructor(name,task,priority) {
      this.name = name;
      this.task = task;
      this.priority = priority
  }
  display()
   {
    console.log(this.name,"does",this.task,"with priority",this.priority)
  }
  store()
  {
    return (`${this.name}does${this.task}with priority${this.priority}`)
  }
}

// Class that holds a collection of employers and properties and functions for the group
class Employers {
  constructor(){
    this.employers = []
  }
  // create a new employer and save it in the collection
  newEmployer(name,task,priority){
    let p = new Employer(name,task,priority)
    this.employers.push(p)
    //console.log("p contents ", p)
    return p
  }
  get EmployeeTasks(){
    return this.employers
  }
}

let project = new Employers()
let t = new Employer()

/*function create_data(msg){
    project.newEmployer("Tom","fix bugs", "Low Priority")
    project.newEmployer("Rob", 'Work on Focus Bot' , "High Priority!")
}*/

//project.newEmployer("Tom", "fix bugs" , "Low Priority")
project.newEmployer("Rob", 'Work on Focus Bot' , "High Priority!")


async function main()
{
    //database();
    console.log("test");
    let request = await client.tokenLogin(process.env.BOTTOKEN);
   
    client.on('message',function(msg)
    {
        console.log(msg);
        if (hears(msg,"Assign"))
        {
            upload_content(msg)
            respond_manager(msg,"Rob");
        } 
        if (hears(msg,"view"))
        {
            //redirects to the print statement
            respond(msg,"Rob");
        }     
        if (hears(msg,"Completed"))
        {
            //delete_content(msg,"User1")
            delete_content("Rob")
            respond_task_completion(msg,"Rob");
        }  
    });
}
//function to delete the content of that user
function database(user,task_name,priority)
{
  
  mongodb.max_delay = 0;
  var MongoClient = mongodb.MongoClient;
  MongoClient.persist="mongo.js";//persist the data to disk
  
  // Connection URL
  var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, {}, function(err, client) {
    var db = client.db();
    console.log("test1");
      // Get the documents collection
    var collection = db.collection('documents');
      // Insert some documents
      var input_db = [ { user: user}, {task_name : task_name}, {priority : priority}];
      collection.insertMany(input_db, function(err, result) {
        console.log("test1");
        console.log('inserted',result);
    
        //collection.updateOne({ a : 2 }, { $set: { b : 1 } }, function(err, result) {
         // console.log("test2");
         // console.log('updated',result);
    
          collection.findOne({a:2}, {b:1}, function(err, doc) {
            console.log("test3");
            console.log('foundOne', doc);
    
           // collection.removeOne({ a : 3 }, function(err, result) {
            //  console.log("test4");
            //  console.log('removed',result);
    
            //  collection.find({}, {_id:-1}).toArray(function(err, docs) {
            //    console.log("test5");
            //    console.log('found',docs);
                
                function cleanup(){            
                  var state = collection.toJSON();
                  // Do whatever you want. It's just an Array of Objects.
                  state.documents.push({a : 2});
                  
                  // truncate
                  state.documents.length = 0;
                  
                  // closing connection
                  db.close();
                }
                
                setTimeout(cleanup, 1000);
              //});
           // });
          });
       // });
      });
    });
}
function delete_content(user)
{
  const removeIndex = project.EmployeeTasks.findIndex(employee => employee.name == user)
  project.EmployeeTasks.splice(removeIndex,1)
}
//function to string manipulate the message received from mattermost
function upload_content(msg)
{
  if (msg.data.post){

    let m = JSON.parse(msg.data.post)
    //console.log(m.message)
  
    //Assign tasks to User: Rob, Task Name: Focusbot, Priority: High//
    temp = m.message.split(",")
    for (var i = 0; i < temp.length; i++){
        if (temp[i].match("User:")){
            user = (temp[i]).split("User:")[1]
        }
        if (temp[i].match("Task Name:")){
            task_name = (temp[i]).split("Task Name:")[1]
        }
        if (temp[i].match("Priority:")){
            priority = (temp[i]).split("Priority:")[1]
        }
    
        }
    console.log(user + " " + task_name + " " + priority)
    project.newEmployer(user,task_name,priority) 
    database(user,task_name,priority)
    return true
    }
    return false
}

function hears(msg,text){
    if(msg.data.sender_name == bot_name) return false;
    if (msg.data.post){
        let re = JSON.parse(msg.data.post)
        if(re.message.indexOf(text)>=0){
            return true;
        }

    }
    return false

//this is response statement for the manager
}

async function respond_manager(msg,u)
{
  let channel=msg.broadcast.channel_id;
  var str_output = ""
  project.EmployeeTasks.forEach(employee => {
    if(employee.name == u)
    {
       employee_name = employee.name
       employee_task = employee.task
       task_priority = employee.priority
       console.log("Manager,", employee_name,employee_task,task_priority)
       str_output += "Employee Name: " + employee_name + ", Task Name: " + employee_task + ", Priority: " + task_priority
       return str_output
    }
    return false
  });
  let w = client.postMessage("The task has been assigned. \nTask details: " + str_output,channel);
  return w;
  //temp = project.EmployeeTasks.forEach(employee => {
  //  return employee.store();
  //});
//this is the response statement for the users and manager
}

async function respond(msg,u){
   let channel=msg.broadcast.channel_id;
   var str_output = ""
   project.EmployeeTasks.forEach(employee => {
     if(employee.name == u)
     {
        employee_name = employee.name
        employee_task = employee.task
        task_priority = employee.priority
        //console.log(employee_name,employee_task,task_priority)
        str_output += "My tasks\n" + "Employee name: " + employee_name + ", Task Name: " + employee_task + ", Priority: " + task_priority
        //return true
     }
     //return false
   });
   let w = client.postMessage(str_output,channel);
   return w;  
}

async function respond_task_completion(msg,u){
    let channel = msg.broadcast.channel_id;
    let str_output = ""
    project.EmployeeTasks.forEach(employee => {
        if(employee.name == u)
        {
           employee_name = employee.name
           employee_task = employee.task
           task_priority = employee.priority
           //console.log("Manager,", employee_name,employee_task,task_priority)
           str_output += "Employee Name: " + employee_name + " has finished Task Name: " + employee_task + ". Proceeding with deleting the task. Good job!"
           //return true
        }
        //return false
      });
      let w = client.postMessage(str_output,channel);
      return w;
}

//used for testing
(async () => 
{
    if (process.env.NODE_ENV != 'test') {
        await main();
    }
})()
//,${msg.data.sender_name}`

module.exports.hears = hears;
module.exports.main = main;
module.exports.upload_content = upload_content;
module.exports.respond_manager = respond_manager;
module.exports.respond = respond;
//module.exports.respond_task_completion = respond_task_completion;
module.exports.Employers = Employers;
module.exports.Employer = Employer;

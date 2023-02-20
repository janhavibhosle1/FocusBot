
## BOT IMPLEMENTATION

There are three use-cases

1. Manager creates tasks
2. Employees can view the tasks
3. Update task progress

We were able to get our bot to operate on these use-cases. 

Firstly, when the manager assigns the task, the bot GETS the string entered and looks for keywords. Here the keywords are 'assign', 'user', 'Task Name', 'Priority'. It is essential that the manager uses these keywords so that the bot can collect the data. When the manager assigns the task, it will be displayed to the manager. 

This provides basic interation between the bot and the manager. 

Secondly, when the employee need to know about his tasks, he can go to his mattermost home and enter his/her name and the keyword 'view', The bot then replies him informing about  his tasks with priority for each. 

Finally, the third use-case updates the tasks. The employee has to enter the keywords 'completed' followed by the name of the task. The task will then get removed from the list of tasks that is assigned. Additionally, the updated task is displayed. 

The bot GETS the string entered in mattermost and parses it. In case of the manager, if the keywords match, it will store the information about the tasks and priority in the class. Multiple tasks and priority for each is stored in an array of strings. Then if an employee wants to view their tasks, the sting that they entered will be parsed and the information is posted back in mattermost. 

## USE-CASE REFINEMENT

1. We assign priority as high priority, medium priority and low priority instead of numbering the priorites - initially it was not specified. 
2. Error response when two tasks have the same priority - the bot will assign the tasks to the employee the order in which it was assigned. 



## Test Coverage Result
Santoshs-MacBook-Pro:FocusBot vignan$ npx c8 npm test

> focusbot@1.0.0 test
> mocha --reporter spec



  Focus-bot Tests
  
    ✔ ensures that hears() returns false on empty input
    ✔ ensures that hears() returns false if the sender name and bot name are the same
    ✔ ensures that hears() returns false if Rob  keyword is not present in the msg
    ✔ ensures that upload_content return true if the task assignment is done properly 
    ✔ ensures that upload_content returns false if the task assignment is not done properly 
    ✔ ensures that upload_content returns false if post is not present in the message 
    ✔ ensures that we throw a TypeError if we are trying to view the tasks of an undefined user
    ✔ ensures that the respond function is able to fetch the tasks for the respctive user
    ✔ ensures that respond_manager function provides the manager with the tasks he assigned to the respective user
    ✔ ensures that a wrong task wont be deleted
    ✔ ensures that we sent a task success message after completing the tasks


  11 passing (17ms)

----------|---------|----------|---------|---------|-----------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s     
----------|---------|----------|---------|---------|-----------------------
All files |   83.41 |    93.54 |    90.9 |   83.41 |                       
 index.js |   83.41 |    93.54 |    90.9 |   83.41 | 55-80,181-187,198-199 
----------|---------|----------|---------|---------|-----------------------


## Mocking Service Component

We used mock MariaDB to implement mock services. It simulates an actual database to be used in the Bot. We have created a function called database which gets the values of user, tasks and priority from Mattermost. We were able to get the code to update the user tasks and priorities in the database which can be fetched and updated. 

The code in the main branch does not implement a mocking service and uses class to store and update the values. We have implemented test.md for that code. 

We have added the index_mock.js file which implements the mocking service to the branch 'dev'. We were not able to write a test.js code for this file and that's why we did not add it to the main branch. 



![](https://media.github.ncsu.edu/user/24326/files/d0622fd0-dc56-4e6e-9b4b-d4033589c526)
Data being stored and fetched in the mock MariaDB

## Screencast 

1. [Demonstration of testing](https://drive.google.com/file/d/1LkvYc-IAK3EJSaruNDSe1C9qR75jyB75/view?usp=sharing)
2. [Demonstration of working of use-cases](https://drive.google.com/file/d/1-inHAPR4DwvoZEI3mgMcCpqy1CRDOKPs/view?usp=sharing)



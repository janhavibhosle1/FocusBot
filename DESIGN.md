## PROBLEM STATEMENT

When a team is responsible for developing a software or updating the existing software, tasks are divided among the members. Multiple tasks divided among team members, some specific task might be forgotten or team members may think someone else is doing the task.  


## BOT DESCRIPTION

 
The focus bot will help the users to channelize the daily tasks based on priority. The manager can assign priority to each task to the bot and the bot will prompty display it to the user. 

While completing the tasks, to maximize productivity, there needs to be someone who monitors the tasks assigned for the team members and should boost his/her performance. The FocusBot will help automate tasks so that the users don’t have to manually track them. It will be a tool that users can rely on to take care of their progress, while they can focus on the task at hand. The main way for the bot to get information would be from the manager and then it plans the user’s day accordingly. 
 
 
 ### Tagline  
 > Watch me work !

## Use Cases

### Use Case 1: Manager creates a task

1 Preconditions

Users must have Mattermost API tokens in the system.
Users must know specific keywords like “Assign”, “User” etc.

2 Main Flow

Manager will create a task and assign users for the respective tasks with priorities for each task [S1]. Bot will update database. [S2].
 
3 Subflows
- [S1] Manager will use create task command by specifying the keywork "Asssign" and use the format "User_name": , Task: "Task_name", Priority:"Priority Value(High, Low)".  
- [S2] Bot will feed and update the database.

4 Alternative Flows
- [E1] The tasks are assigned in the order given by the manager and is accessed in the same order as well.
- [E2] If the task is already assigned to the same user, an error message will be displayed indicating that the same task already exists in the database.
- 
### Use Case 2: Users view tasks

1 Preconditions

Users must have Mattermost API tokens in the system.
Users must know specific keywords like “View”, “User” etc.


2 Main Flow

After the Bot has fed the database and assigned tasks , the users can now view their tasks along with the assigned priorities S[3].
 
3 Subflows
- [S2] Users will be able to view their tasks by specifying the keyword "view" and use the format "User_name": (all,user_name).
- [S3] The users can now work on their tasks according to the priorities assigned to them.

4 Alternative Flows
- [E1] If a user has no tasks assigned or has completed all his/her tasks, the system should prompt a message conveying the same.

### Use Case 3: Update task progress

1 Preconditions

Users must have Mattermost API tokens in the system.
Users must know specific keywords like “completed”,"Task".
Users have tasks assigned to them.

2 Main Flow

Once ‘User A’ has completed the task, they message the Bot about it S[1]. The Bot then updates the database with this information [S2]. . The pending tasks for ‘User A’ are updated S[3]. 
 
3 Subflows
- [S1] User will complete a task and notify the bot by specifying the keyword "Completed" and use the format Task: "Task_name".
- [S2] The Bot will make corresponding changes to the database.

4 Alternative Flows
- [E1] If a user has no tasks assigned or has completed all his/her tasks, the system should prompt a message conveying the same.

 ## Design Sketches
 
 ### Wireframe Mockup
 
 ![focus bot](https://media.github.ncsu.edu/user/22659/files/0d6b5009-187d-4ea8-99ad-1c96af3b4b27)
 
 ![focus bot (1)](https://media.github.ncsu.edu/user/22659/files/a7bd5a12-59ec-412c-8319-f94970b87ffe)
 
 * The channels sections on the right mention the focus bots assigned to the user. For the manager, he has a channel for each user apart from the focus bot.
 * The text sent by the bot is in Italics and the user/manager uses the normal font. This is used for easier identification.

 ### Storyboard
 
 ![WhatsApp Image 2022-02-24 at 8 09 07 PM](https://media.github.ncsu.edu/user/22659/files/7ee0fdf7-6d98-4c75-8e9b-2e23fdcb0a16)
 
## Architecture Design

![focus_bot_architecture](https://media.github.ncsu.edu/user/24727/files/69936101-9a42-480a-878f-4aa28ff21ac8)

### Components of the BOT

**Mattermost Server**:
We are going to use the Open Source chat solution named Mattermost for the Human interaction part. All the users (Manager and Employees) log into their Mattermost Web Account to access the BOT. We create a channel which the Manager and Employees join and the BOT will be integrated to this channel. An access token is created for the BOT so that it can parse the information and perform the corresponding tasks. This mattermost server is deployed in a Docker container.

**BOT**: This is the brain of the system. It interacts with the users and the database to perform different functions. The manager inputs the tasks which need to be completed to the BOT. At this point, the bot will take this input and writes this to the database. The BOT is responsible for arranging the tasks in the database and will sort them based on priority. Once the tasks are entered into the database, it will fetch the tasks per individual and will send them to the respective individuals. It will keep sending daily notifications to the users about the pending tasks. Once the user completes a task, he will let the bot know which will in turn update the database and will notify the manager.
We are designing a javascript program that is used for transaction of data between the database and the mattermost server.


**Database**: The database is being used to store the information about the daily tasks of the team and the channel id's of the users. The BOT is the single point of contact with the database. Any information being written to the database or read from the database will be performed by the BOT. After the bot receives the tasks from the manager, it will write the tasks to the database and sort them accordingly. For long term data storage, we are using cloud services to implement the database. 

**Manager**: Manager is responsible for assigning the tasks to each employee based on priority. He will access the FocusBot using the mattermost web client and input the tasks. He will receive notification from the BOT once the employees/users complete their respective tasks.

**Employees/Users**: Employees are individual contributors working in a team for a project. They receive their individual tasks from the FocusBot after the manager assigns the tasks. Once they receive the tasks they will start working on them. After they finish the tasks, they will notify the bot which will in turn notify the manager about the completion of the task.

### Additional Patterns

The bot that we designed would send text notifications in the mattermost channel regarding the project. However, there comes a time where we would have to work on multiple projects with multiple tasks which means getting multiple notifications. It is easier to lose track of the assigned tasks. 

In that case, we can use mattermost boards. Mattermost Boards allow the team to manage tasks similar to a Kanban board structure. It keeps track of tasks for each project and makes sure everyone is on the same page. It can also display information like the priority for a task. The manager can still assign the priority for all the tasks and gets updated if the user finishes a task. 

![additional pattern](https://media.github.ncsu.edu/user/24326/files/0b851f50-66ed-4608-b2a1-e2c14f23d2c9)
![additional pattern 1](https://media.github.ncsu.edu/user/24326/files/3cdbf62a-8627-447c-a317-219054d6422d)





 








 



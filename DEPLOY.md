
# Deployment 

## Ansible-playbook-instructions

#### Pre-Requisites 
- Make sure you are running ubuntu version **20.04**
    ```
    lsb_release -a
    Distributor ID:	Ubuntu
    Description:	Ubuntu 20.04.4 LTS
    Release:	20.04
    Codename:	focal
    ```
- Make sure Ansible is installed on the host server. To install, please run "sudo apt-get install ansible"
- Make sure you are running ansible version 2.9.6
    ```
    ansible --version
    ansible 2.9.6
    ```
- Download the ansible playbook named "deploy-bot.yml" 
- Configure the below ENVIRONMENTAL VARIABLES provided in the .bash_profile file under the /home/\<user> directory
    ```
    export BOTTOKEN="xxxx"
    export GITHUBTOKEN="xxxx"
    export MANAGERID="@xxxx"
    ```

#### Usage

The ansible playbook **deploy-bot.yml** will help in deploying the modules and dependencies needed for starting the FocusBot. 

The playbook accomplishes the following tasks:

    - Installs nodejs 
    - Creates a ".ssh" directory if it doesn't exists
    - Generates the SSH keys
    - Deploys the SSH keys in the corresponding github repository
    - Clones the bot code from the main branch 
    - Installs the necessary packages for the bot
    - Downloads, installs and starts the database
    - After all these dependencies are installed the bot is brought online

#### Run the playbook: 
```
ansible-playbook deploy-bot.yml --extra-vars "user=<username> SSH_KEY_NAME=<ssh_key_name> PROJECT_DIRECTORY_NAME=<any_directory_name>"

Ex: ansible-playbook deploy-bot.yml --extra-vars "user=vkoppol SSH_KEY_NAME=vkoppolssh PROJECT_DIRECTORY_NAME=TEAM-13"
```

After the playbook is successfully run, the BOT should start working.

[SCRRENCAST LINK IS HERE](https://drive.google.com/file/d/13AxZm8taZAgtDaa1yNHkJubcJ_NsNd46/view?usp=sharing)

#### Playbook test run:
```
vkoppol@vclv99-127:~$ ansible-playbook deploy-bot.yml --extra-vars "user=vkoppol SSH_KEY_NAME=vkoppolssh PROJECT_DIRECTORY_NAME=TEAM-13"
[WARNING]: provided hosts list is empty, only localhost is available. Note that the
implicit localhost does not match 'all'

PLAY [Bring up FocusBot] *************************************************************

TASK [Gathering Facts] ***************************************************************
ok: [localhost]

TASK [add apt key] *******************************************************************
ok: [localhost]

TASK [Add nodejs LTS repos] **********************************************************
ok: [localhost]

TASK [Install node js] ***************************************************************
ok: [localhost]

TASK [Create ssh directory] **********************************************************
ok: [localhost]

TASK [Generate SSH key "vkoppolssh"] *************************************************
ok: [localhost]

TASK [deploy ssh_keys] ***************************************************************
ok: [localhost]

TASK [clone github] ******************************************************************
changed: [localhost]

TASK [Install packages via npm] ******************************************************
changed: [localhost]

TASK [Install forever package] *******************************************************
ok: [localhost]

TASK [add apt key] *******************************************************************
ok: [localhost]

TASK [Add repos for mongodb] *********************************************************
ok: [localhost]

TASK [Install mongodb] ***************************************************************
ok: [localhost]

TASK [Start mongodb] *****************************************************************
ok: [localhost]

TASK [Start Bot] *********************************************************************
changed: [localhost]

PLAY RECAP ***************************************************************************
localhost                  : ok=15   changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Acceptance Testing

In our bot, we have created the commands in a particular format and the bot understands these commands only when they are given in a certain format. In order to assist the users , we have created a small guide to follow the commands and by typing the below command, it will tell you the structure in the command and the keywords necessary to execute them. 

```
help
```
![image](https://media.github.ncsu.edu/user/22659/files/bd4372c0-8e28-4adb-8a2d-dccffa930dc6)

Now lets see how the bot works for Each Use case:

### Adding task for the user through the bot

When the manager assigns tasks to the bot, the command should contain the keywords Assign , User Name, Task Name and Priority in order. Even if one item is not present in the command, then it doesnt get executed and the manager needs to run the command again. If the command is successful, the bot will display the task assigned to the user,

Note: The task assignment command follows a particular order. If this is not followed, the bot is going to throw an error.

<img src="https://media.github.ncsu.edu/user/22659/files/6bb7cf1a-5694-4f2f-89b4-250e56d865cc" width="1000">

![image](https://media.github.ncsu.edu/user/22659/files/924bb336-f6b0-427a-8c17-6f03f398298b)

For example, let us see what happens if the manager assigns the task as "assign task name: task1 user:emp1 priority: high"

<img src="https://media.github.ncsu.edu/user/24727/files/535d7709-b21c-40e2-bc2f-0a1c00334c90" width="2000">

There is also a check to make sure that only a manager can assign tasks to the bot. If a different user tries to do so, we throw an error. 

![image](https://media.github.ncsu.edu/user/22659/files/ff340ed7-648f-4ad7-977c-46562610431e)

Note: We have added the professor and the TA's as managers so that they can run the assign task functionality.

In case there exists a task that has already been assigned, if the user tries to assign the same task, then the bot prints a message saying that the task has already been assigned. This process is done by matching the task name to the existing tasks so be careful while entering the task names.

![image](https://media.github.ncsu.edu/user/22659/files/fb36011a-1a77-489e-a05d-5e93ce206b2f)


### Viewing tasks assigned to the person

In order to view tasks (considering viewing all tasks and user specific tasks), we have to mention "User:" in order for succesfull execution. If we dont give the data in that particular format, an error is printed.

![image](https://media.github.ncsu.edu/user/24727/files/b8b96e82-d148-4eb9-8f39-2e256bb6a55e)

If we want to view the tasks assigned to a particular user we need to mention it as "view user:\<user-name>"
![image](https://media.github.ncsu.edu/user/24727/files/84c95d25-81b1-408c-b6bf-4605b4c1535e)

If we want to view all the tasks, then we need to give "view user:all"
![image](https://media.github.ncsu.edu/user/24727/files/671f83f1-35b2-4281-b3f0-eee204a6069b)

If there are no prior tasks assigned to the user then we get an output indicating that there ae no tasks assigned to that user.

![image](https://media.github.ncsu.edu/user/24727/files/76e81f7a-637b-4863-a938-7017df130e14)

### Notifying the bot after completing a task

For notifying the bot of task completion, we need to mention the task name and the user that has completed the task along with "Completed" keyword. In case they are not mentioned, the task still remains assigned to that person.

![image](https://media.github.ncsu.edu/user/22659/files/021b5c5f-862c-453c-9f0a-6802751b2c60)

In case the task has not been assigned previously, then we get the output messages shown below. 

![image](https://media.github.ncsu.edu/user/22659/files/643dd9b3-c7ba-4325-9877-d81923b82fa4)

When the task exists and the command gets executed, the message display the task details that has been completed. This output message is used as verification for executing the command.

![image](https://media.github.ncsu.edu/user/22659/files/9399f67f-c0db-4349-8750-99f797471147)

## Exploratory Testing and Code Inspection

For this part, we have not hard coded the data for the bots and works for all cases. The worksheet.md file has been updated regularly containing the tasks split among us and completing them.





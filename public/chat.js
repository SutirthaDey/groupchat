const token = localStorage.getItem('token');
const messageForm = document.getElementById('message-form');
const chatDiv = document.getElementById('chats');
const userId = localStorage.getItem('userId');
const groupFrom = document.querySelector('#createGroup form');
const addMembers = document.getElementById('addMembers');
const groups = document.getElementById('groups');
const groupMembers = document.getElementById('groupInfo');
let activeGroupId = localStorage.getItem('activeGroupId');
let setTimer;

async function fetchMessages(){
    try{
    let messages = JSON.parse(localStorage.getItem(activeGroupId));
    let id;
    if(!messages){
    id=0;
    messages=[];
    }
    else if(messages.length===0){
    id=0
    }
    else
    id = messages[messages.length-1].id;

    const response = await axios.get(`http://localhost:3000/chat?id=${id}&groupId=${activeGroupId}`,{headers:{'Authorization': token}});

    let localMessages = messages.concat(response.data);
    let jsonLocalMessages = JSON.stringify(localMessages);

    while(jsonLocalMessages.length>50000){
        localMessages.shift();
        jsonLocalMessages = JSON.stringify(localMessages);
    }

    localStorage.setItem(activeGroupId,jsonLocalMessages);
    showChats(localMessages);
   }
   catch(e)
   {
      console.log(e);
      window.location.href = "http://localhost:3000/login.html";
   }
}

async function sendMessage(e){
    try{
        e.preventDefault();
        const message = e.target.message.value;
        await axios.post(`http://localhost:3000/message`,
        {message: message, groupId: activeGroupId},
        {headers:{'Authorization': token}})
     }
     catch(e)
     {
        console.log(e);
     }
}

async function getGroupMembers(){
  const members = await axios.get(`http://localhost:3000/getMembers?groupId=${activeGroupId}`, {headers:{'Authorization':token}});
  groupMembers.innerHTML = `<h3 style="color:white">Group Members</h3>`;
  let isAdmin = false;

  members.data.forEach((eachMember)=>{
    if(eachMember.id == userId && eachMember.isAdmin)
     isAdmin = true;
  })

  members.data.forEach((eachMember)=>{
    const membership = eachMember.isAdmin ? 'admin': 'member';
    if(eachMember.id == userId){
        groupMembers.innerHTML += `<div>
        <p>You(${membership})</p>
        <button>Leave Group</button>
        </div>`
    }
    else{
        if(isAdmin){
            if(eachMember.isAdmin){
            groupMembers.innerHTML += `<div>
            <p>${eachMember.name}(${membership})</p>
            <button>Dismiss as admin</button><button>Remove from group</button>
            <input type="hidden" value='${eachMember.id}'/>
            </div>`
            }
            else{
                groupMembers.innerHTML += `<div>
                <p>${eachMember.name}(${membership})</p>
                <button>Make admin</button><button>Remove from group</button>
                <input type="hidden" value='${eachMember.id}'/>
                </div>`
            }
        }
        else
        {
        groupMembers.innerHTML += `<div>
        <p>${eachMember.name}(${membership})</p>
        </div>`  
        }
    }
  })
}

function globalButton(){
    activeGroupId = 0;
    localStorage.setItem('activeGroupId',0);
    fetchMessages();
    fetchGroups();
}

async function showGroup(){
    document.querySelector('#createGroup').style.display = 'block';
    const response = await axios.get(`http://localhost:3000/users?userId=${userId}`, {headers:{'Authorization': token}});

    response.data.users.forEach((user)=>{
        addMembers.innerHTML += `<li><input type="checkbox"/><input type='hidden' value='${user.id}'/>${user.name}</li>`
    })
}

async function fetchGroups(){
    const groups = await axios.get(`http://localhost:3000/groups`, {headers:{'Authorization': token}});

    showGroupList(groups.data);
    getAllGroupButtons();

    if(!activeGroupId || activeGroupId===0){
        groupMembers.innerHTML = '';
    }else{
        getGroupMembers();
    }
}

function closeGroup(){
    addMembers.innerHTML='';
    document.querySelector('#createGroup').style.display = 'none';
}

function getAllGroupButtons(){
    const gButtons = document.querySelectorAll('.groupButtons');
    gButtons.forEach((button)=>{
        if(button.classList.contains('active')){
            button.classList.remove('active');
       }
    })

    document.getElementById(activeGroupId).classList.add('active');
}

function showGroupList(groupList){
    groups.innerHTML = '';
    groups.innerHTML += `<h3 style="margin-left:10px;color:white">Your Groups</h3>`;
    groupList.forEach(({id,name})=>{
        groups.innerHTML+= `<div><Button id=${id} class="groupButton">${name}</Button></div>`
    })
}

function showChats(messages){
    chatDiv.innerHTML='';
    messages.forEach((message)=>{   
       const name = message.user.id == userId ? 'You' : message.user.name;
       chatDiv.innerHTML += `<div>${name}: ${message.message}</div>`
    })
   }

groups.addEventListener('click',async(e)=>{
    if(e.target.tagName === 'BUTTON'){
        activeGroupId = e.target.id;
        localStorage.setItem('activeGroupId',activeGroupId);
        fetchMessages();
        fetchGroups();
    }
});


// This is for getting the checkboxes and member names from the checkboxes
groupFrom.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const groups = document.getElementById('groups');
    const groupName = e.target.name.value;
    const Licheckboxes = e.target.querySelectorAll("li");
    let groupMemberList = [userId];
    Licheckboxes.forEach((eachLiBox)=>{
        const checkbox = eachLiBox.firstElementChild;
        const userId = checkbox.nextElementSibling.value;
   
        checkbox.checked? groupMemberList.push(userId): null;
    })
    const groupData = {
        groupName: groupName,
        groupMembers: groupMemberList
    }

    const response = await axios.post(`http://localhost:3000/createGroup`, groupData, {headers:{'Authorization': token}});
    const groupId = response.data.group.id;

    // add group id to button
    groups.innerHTML+= `<div><Button id=${groupId}>${groupName}</Button></div>`;
    setTimeout(() => {
        closeGroup();
    }, 500);
})

messageForm.addEventListener('submit',sendMessage)

window.addEventListener('DOMContentLoaded',async()=>{
    try{
        if(!activeGroupId){
         activeGroupId = 0;
         localStorage.setItem('activeGroupId',activeGroupId);
        }

        fetchMessages();

        setTimer = setInterval(() => fetchMessages(), 1000);

        fetchGroups();
    }
    catch(e)
    {
        window.location.href = "http://localhost:3000/login.html";
        console.log(e);
    }
})

groupMembers.addEventListener('click',async(e)=>{

    try{
        if(e.target.innerText == "Leave Group"){
            await axios.post('http://localhost:3000/removeMember',{userId:userId,groupId:activeGroupId},{headers:{'Authorization':token}});
            localStorage.removeItem(activeGroupId);
            localStorage.setItem('activeGroupId',0);
            activeGroupId=0;
        }
        else if(e.target.innerText === 'Make admin'){
            const userId = e.target.nextElementSibling.nextElementSibling.value;
            await axios.post('http://localhost:3000/adminControl',{userId:userId,groupId:activeGroupId,adminStatus:true},{headers:{'Authorization':token}});
        }
        else if(e.target.innerText === 'Dismiss as admin'){
            const userId = e.target.nextElementSibling.nextElementSibling.value;
            await axios.post('http://localhost:3000/adminControl',{userId:userId,groupId:activeGroupId,adminStatus:false},{headers:{'Authorization':token}});
        }
        else if(e.target.innerText === 'Remove from group'){
            const userId = e.target.nextElementSibling.value;
            await axios.post('http://localhost:3000/removeMember',{userId:userId,groupId:activeGroupId},{headers:{'Authorization':token}});
        }
        fetchGroups();
    }
    catch(e)
    {
        console.log(e);
    }
})


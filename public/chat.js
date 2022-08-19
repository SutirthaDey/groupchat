const token = localStorage.getItem('token');
const messageForm = document.getElementById('message-form');
const chatDiv = document.getElementById('chats');
const userId = localStorage.getItem('userId');
const groupFrom = document.querySelector('#createGroup form');
const addMembers = document.getElementById('addMembers');
const groups = document.getElementById('groups');

async function showGroup(){
    document.querySelector('#createGroup').style.display = 'block';
    const response = await axios.get(`http://localhost:3000/users?userId=${userId}`, {headers:{'Authorization': token}});

    response.data.users.forEach((user)=>{
        addMembers.innerHTML += `<li><input type="checkbox"/><input type='hidden' value='${user.id}'/>${user.name}</li>`
    })
}

function closeGroup(){
    addMembers.innerHTML='';
    document.querySelector('#createGroup').style.display = 'none';
}

function showGroupList(groupList){
    groupList.forEach(({id,name})=>{
        groups.innerHTML+= `<div><Button id=${id}>${name}</Button></div>`
    })
}

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


messageForm.addEventListener('submit',async(e)=>{
 try{
    e.preventDefault();
    const message = e.target.message.value;
    await axios.post('http://localhost:3000/message',
    {message: message},
    {headers:{'Authorization': token}})
 }
 catch(e)
 {
    console.log(e);
 }
})

function showChats(messages){
 chatDiv.innerHTML='';
 messages.forEach((message)=>{    
    const name = message.user.id == userId ? 'You' : message.user.name;
    chatDiv.innerHTML += `<div>${name}: ${message.message}</div>`
 })
}

window.addEventListener('DOMContentLoaded',async()=>{
    try{
        let messages = JSON.parse(localStorage.getItem('messages'));
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

        const response = await axios.get(`http://localhost:3000/chat?id=${id}`,{headers:{'Authorization': token}});
        const groups = await axios.get(`http://localhost:3000/groups`, {headers:{'Authorization': token}});

        showGroupList(groups.data);
        
        setInterval(async() => {
            try{
                // logic for storing the messages in localstorage and also deleting the 
                // old messages when the localstorage is full
                let messages = JSON.parse(localStorage.getItem('messages'));
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

                const response = await axios.get(`http://localhost:3000/chat?id=${id}`,{headers:{'Authorization': token}});

                let localMessages = messages.concat(response.data);
                let jsonLocalMessages = JSON.stringify(localMessages);

                while(jsonLocalMessages.length>5000000){
                    localMessages.shift();
                    jsonLocalMessages = JSON.stringify(localMessages);
                }

                localStorage.setItem('messages',jsonLocalMessages);
                showChats(localMessages);
            }
            catch(e){
                console.log(e);
                // window.location.href = "http://localhost:3000/login.html";
            }
        }, 1000);
    }
    catch(e)
    {
        // window.location.href = "http://localhost:3000/login.html";
        console.log(e);
    }
})
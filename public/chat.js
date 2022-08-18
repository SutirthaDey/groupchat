const token = localStorage.getItem('token');
const messageForm = document.getElementById('message-form');
const chatDiv = document.getElementById('chats');
const userId = localStorage.getItem('userId');
const groupFrom = document.querySelector('#createGroup form');

function showGroup(){
    document.querySelector('#createGroup').style.display = 'block';
}

function closeGroup(){
    document.querySelector('#createGroup').style.display = 'none';
}

// This is for getting the checkboxes and member names from the checkboxes
groupFrom.addEventListener('submit', async(e)=>{
    e.preventDefault();
    console.log(e.target.name.value);
    const Licheckboxes = e.target.querySelectorAll("li");
    Licheckboxes.forEach((eachLiBox)=>{
        const checkbox = eachLiBox.firstElementChild;
        checkbox.checked? console.log(eachLiBox.lastChild): null;
    })
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
        else
        id = messages[messages.length-1].id;

        const response = await axios.get(`http://localhost:3000/chat?id=${id}`,{headers:{'Authorization': token}});
        
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
                window.location.href = "http://localhost:3000/login.html";
            }
        }, 1000);
    }
    catch(e)
    {
        window.location.href = "http://localhost:3000/login.html";
        console.log(e);
    }
})
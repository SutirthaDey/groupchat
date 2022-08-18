const token = localStorage.getItem('token');
const messageForm = document.getElementById('message-form');
const chatDiv = document.getElementById('chats');
const userId = localStorage.getItem('userId');

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
const token = localStorage.getItem('token');
const messageForm = document.getElementById('message-form');

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

 }
})

window.addEventListener('DOMContentLoaded',async()=>{
    try{
        const response = await axios.get('http://localhost:3000/chat',{headers:{'Authorization': token}});
    }
    catch(e)
    {
        window.location.href = "http://localhost:3000/login.html"
        console.log(e);
    }
})
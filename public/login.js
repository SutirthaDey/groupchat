const loginForm =  document.querySelector('.login-form');
const forgotPopUp = document.querySelector('.forgot-popup');
const forgotPassword = document.querySelector('.to-forgot-password');
const closeForget = document.querySelector('.forget-close');

async function logIn(e){
    try{
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        const response = await axios.post('http://35.160.124.16:3000/login', userData);
        localStorage.clear();
        localStorage.setItem('activeGroupId',0);
        localStorage.setItem('token',response.data.token);
        localStorage.setItem('email',response.data.email);
        localStorage.setItem('userId', response.data.userId);
        alert('Successfully Logged In!');
        window.location.href="http://35.160.124.16:3000/chat.html";
        }
        catch(error)
        {   const message = error.response.data.message;
            userDoesNotExists(message);
        }      
}

function userDoesNotExists(message){
    alert(message);
}

loginForm.addEventListener('submit', logIn);

forgotPassword.addEventListener('click', (e)=>{
    forgotPopUp.classList.add('active');
})

forgotPopUp.addEventListener('submit', async(e)=>{
    try{
    e.preventDefault();
    const email = e.target.email.value;
    const response = await axios.post('http://locahost:3000/password/forgotpassword', {email:email});
    const resetLink = document.querySelector('.forgot-password a');
    resetLink.href = response.data.resetLink;
    resetLink.innerText = 'click here to reset password';
    }
    catch(e){
        console.log(e);
    }
})

closeForget.addEventListener('click', (e)=>{
    forgotPopUp.classList.remove('active');
})
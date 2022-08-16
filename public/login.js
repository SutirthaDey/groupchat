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

        const response = await axios.post('http://localhost:3000/login', userData);
        localStorage.setItem('token',response.data.token);
        localStorage.setItem('email',response.data.email);
        alert('Successfully Logged In!');
        window.location.href="http://localhost:3000/expense/expense.html";
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
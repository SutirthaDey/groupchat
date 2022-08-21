const signUpForm = document.querySelector('.signup-form');

async function signUp(e){

try{
    e.preventDefault();

    const userData = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value
    }

    await axios.post('http://35.160.124.16:3000/signup', userData);
    alert('Successfully Signed Up!');
    window.location.href = "http://35.160.124.16:3000/login.html";
    }
    catch(error)
    {
        userDoesExists();
    }    
}

function userDoesExists(){
    const errorPopUp = document.createElement('p');

    errorPopUp.innerHTML = `User Already exists!</br>`
    errorPopUp.style.color = 'red';
    const signUp = signUpForm.lastElementChild;
    signUpForm.insertBefore(errorPopUp, signUp);
    setTimeout(() => {
        errorPopUp.remove();
    }, 5000);
}

signUpForm.addEventListener('submit', signUp);
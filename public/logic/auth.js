import request from "./modules/request.js";

document.addEventListener('DOMContentLoaded', () => {
  
  const login = document.getElementById('login');
  const register = document.getElementById('register');
  const fields = ['username', 'email', 'password'];

  const hideError = (input, errMsg) => {
    input.style.borderColor = 'transparent';
    errMsg.style.visibility = 'hidden';
  }

  const showErrors = (field) => {
    const inputField = document.getElementById(field);
    const errMessage = document.querySelector(`.${field}-message`);
    inputField.style.borderColor = 'red';
    errMessage.style.visibility = 'visible';
    inputField.addEventListener('focus', () => {
      hideError(inputField, errMessage);
    });
  }

  const checkResponseStatus = async (response) => {
    if(!response.ok) {
      const data = await response.json();
      for(const field of fields) {
        const message = data.message.toLowerCase();
        if(message.includes(`${field}`)) {
          showErrors(field);
        }
      }
      throw new Error(`Network response was not ok (${response.status})`);
    }
    return response.json();
  }

  const handleDataResponse = (data) => {
    const id = data.user.id;
    console.log(data.user);
    location.href = '/';
    localStorage.setItem('id', id);
  }

  if(login) {
    login.onclick = (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      request('../api/v1/auth/login', 'POST', {
        email,
        password
      })
      .then(response => checkResponseStatus(response))
      .then(data => handleDataResponse(data))
      .catch(err => console.error('Login Error', err));
    }
  }

  if(register) {
    register.onclick = (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      request('../api/v1/auth/register', 'POST', {
        username,
        email,
        password
      })
      .then(response => checkResponseStatus(response))
      .then(data => handleDataResponse(data))
      .catch(err => console.error('Registeration Error', err));
    }
  }

});

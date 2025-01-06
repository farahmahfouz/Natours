// First, check if the map element exists before trying to access it
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSetting';
// import { displayMap } from './leaflet';

const map = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

//DELEGATION
// if (map) {
//   const locations = JSON.parse(map.dataset.locations);
//   displayMap(locations);
// }

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    console.log(name, email)
    updateSettings({name, email}, 'data');
  });
}


if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

   await updateSettings({passwordCurrent, password, confirmPassword}, 'password');

   document.querySelector('.btn--save-password').textContent = 'Save password';
   
   document.getElementById('password-current').value = ''
   document.getElementById('password').value = ''
   document.getElementById('password-confirm').value = ''
  });
}
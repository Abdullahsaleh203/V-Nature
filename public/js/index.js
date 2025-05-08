/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { updateTour } from './updateTour';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const updateTourBtn = document.querySelector('.btn--save-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (updateTourBtn)
  updateTourBtn.addEventListener('click', e => {
    e.preventDefault();
    const tourId = e.target.dataset.tourId;
    e.target.textContent = 'Updating...';

    // Gather form data
    const name = document.getElementById('name').value;
    const duration = parseInt(document.getElementById('duration').value, 10);
    const maxGroupSize = parseInt(document.getElementById('maxGroupSize').value, 10);
    const difficulty = document.getElementById('difficulty').value;
    const price = parseFloat(document.getElementById('price').value);
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const imageCover = document.getElementById('imageCover').value;
    const images = document.getElementById('images').value.split(',').map(img => img.trim());
    const startLocation = document.getElementById('startLocation').value;
    const startDates = document.getElementById('startDates').value.split(',').map(date => date.trim());
    const guides = document.getElementById('guides').value.split(',').map(guide => guide.trim());

    // Parse locations from input - format is "lat,lng; lat,lng; ..."
    const locationsInput = document.getElementById('locations').value;
    const locationPairs = locationsInput.split(';').map(loc => loc.trim());
    const locations = locationPairs.map(pair => {
      const [lat, lng] = pair.split(',').map(coord => parseFloat(coord.trim()));
      return {
        type: 'Point',
        coordinates: [lng, lat],
        description: `Day ${locationPairs.indexOf(pair) + 1}`
      };
    });

    // Create data object for API
    const tourData = {
      name,
      duration,
      maxGroupSize,
      difficulty,
      price,
      summary,
      description,
      imageCover,
      images,
      startLocation: {
        description: startLocation,
        type: 'Point',
        coordinates: [0, 0] // Default coordinates, should be updated in the backend
      },
      startDates,
      guides,
      locations
    };

    // Call updateTour function
    updateTour(tourId, tourData);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

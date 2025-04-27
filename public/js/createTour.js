import axios from 'axios';
import { showAlert } from './alerts';

const form = document.querySelector('.form--create-tour');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/tours',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Tour created successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
} 

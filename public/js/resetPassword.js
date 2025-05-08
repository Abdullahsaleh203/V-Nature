/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const resetForm = document.querySelector('.form--reset-password');

if (resetForm) {
    resetForm.addEventListener('submit', async e => {
        e.preventDefault();

        // Change button text to show loading
        const button = document.querySelector('.btn--green');
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        // Get token from URL
        const token = window.location.pathname.split('/')[2];

        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/v1/users/resetPassword/${token}`,
                data: {
                    password,
                    passwordConfirm
                }
            });

            if (res.data.status === 'success') {
                showAlert('success', 'Password reset successful!');

                // Redirect to login page after 1.5 seconds
                window.setTimeout(() => {
                    location.assign('/login');
                }, 1500);
            }
        } catch (err) {
            showAlert('error', err.response.data.message);
            button.textContent = originalText;
            button.disabled = false;
        }
    });
}

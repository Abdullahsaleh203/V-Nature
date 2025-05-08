/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const forgotPasswordForm = document.querySelector('.form--forgot-password');

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        // Change button text to show loading
        const button = document.querySelector('.btn--green');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        const email = document.getElementById('email').value;

        try {
            const res = await axios({
                method: 'POST',
                url: '/api/v1/users/forgot-Password',
                data: {
                    email
                }
            });

            if (res.data.status === 'success') {
                showAlert('success', 'Password reset link sent to your email!');
                // Reset form
                document.getElementById('email').value = '';
            }
        } catch (err) {
            showAlert('error', err.response.data.message);
        }

        // Reset button
        button.textContent = originalText;
        button.disabled = false;
    });
}

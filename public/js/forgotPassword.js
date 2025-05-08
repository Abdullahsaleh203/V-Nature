/* eslint-disable */
// Self-executing function to avoid polluting global namespace
(function () {
    // Simple alert function if showAlert is not available
    function showAlert(type, message) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert--${type}`;
        alertBox.textContent = message;
        document.querySelector('body').appendChild(alertBox);

        // Hide alert after 5 seconds
        window.setTimeout(() => {
            alertBox.remove();
        }, 5000);
    }

    // Handle form submission
    function handleForgotPassword() {
        const forgotPasswordForm = document.querySelector('.form--forgot-password');

        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Change button text to show loading
                const button = document.querySelector('.btn--green');
                const originalText = button.textContent;
                button.textContent = 'Sending...';
                button.disabled = true;

                const email = document.getElementById('email').value;

                try {
                    // Use fetch API instead of axios
                    const response = await fetch('/api/v1/users/forgotPassword', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        showAlert('success', 'Password reset link sent to your email!');
                        // Reset form
                        document.getElementById('email').value = '';
                    } else {
                        showAlert('error', data.message || 'Something went wrong!');
                    }
                } catch (err) {
                    showAlert('error', 'An error occurred. Please try again.');
                    console.error('Error:', err);
                }

                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            });
        }
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', handleForgotPassword);
})();

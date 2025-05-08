/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Wait for Stripe to be loaded
let stripe;
window.addEventListener('load', () => {
  stripe = Stripe('pk_test_51RICbiGbRQkIQI2WsnOt4fha92obqfHLjDeP3DaV0wwYD1gvvxt0Ha0ryribOnhpz0qZln9UxCbAZlGn9nQAKjRP00BrJ5ucWX');
});

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const response = await axios({
      method: 'GET',
      url: `/api/v1/booking/checkout-session/${tourId}`
    });

    if (!response.data.session || !response.data.session.id) {
      throw new Error('Could not retrieve checkout session');
    }

    // 2) Create checkout form + charge credit card
    const result = await stripe.redirectToCheckout({
      sessionId: response.data.session.id
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (err) {
    console.error('Booking error:', err);
    showAlert('error', err.message || 'Something went wrong during booking process');
  }
};

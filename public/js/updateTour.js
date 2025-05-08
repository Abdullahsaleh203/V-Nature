/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateTour = async (tourId, data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/tours/${tourId}`,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Tour updated successfully!');
            window.setTimeout(() => {
                location.assign('/manage-tours');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message || 'Error updating tour. Please try again.');
    }
};

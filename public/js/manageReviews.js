/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// DOM Elements
const reviewsTable = document.querySelector('.review-manage__table');
const filterForm = document.querySelector('.review-manage__filter-form');
const tourFilter = document.getElementById('tourFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Handle expand/collapse review text
const handleExpandText = () => {
    if (!reviewsTable) return;

    reviewsTable.addEventListener('click', e => {
        const btn = e.target.closest('.review-manage__expand-btn');
        if (!btn) return;

        const reviewText = btn.previousElementSibling;
        reviewText.classList.toggle('expanded');

        if (reviewText.classList.contains('expanded')) {
            btn.textContent = 'Show less';
        } else {
            btn.textContent = 'Show more';
        }
    });
};

// Handle review filtering
const handleFilter = () => {
    if (!filterForm) return;

    filterForm.addEventListener('submit', async e => {
        e.preventDefault();

        try {
            const tourId = tourFilter.value;
            const rating = ratingFilter.value;

            // Build query string
            const queryParams = [];
            if (tourId) queryParams.push(`tour=${tourId}`);
            if (rating) queryParams.push(`rating=${rating}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

            // Redirect to filtered URL
            window.location.href = `/manage-reviews${queryString}`;
        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    });
};

// Handle delete review
const deleteReview = async reviewId => {
    try {
        await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`
        });

        showAlert('success', 'Review deleted successfully!');

        // Refresh page after a short delay
        window.setTimeout(() => {
            location.reload();
        }, 1500);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

// Event listener for delete review buttons
const handleDeleteReview = () => {
    if (!reviewsTable) return;

    reviewsTable.addEventListener('click', e => {
        const btn = e.target.closest('.btn--delete-review');
        if (!btn) return;

        const reviewId = btn.dataset.reviewId;

        // Confirmation dialog
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            deleteReview(reviewId);
        }
    });
};

// Event listener for edit review buttons
const handleEditReview = () => {
    if (!reviewsTable) return;

    reviewsTable.addEventListener('click', e => {
        const btn = e.target.closest('.btn--edit-review');
        if (!btn) return;

        const reviewId = btn.dataset.reviewId;

        // Redirect to edit page (assumes you have an edit-review route)
        window.location.href = `/edit-review/${reviewId}`;
    });
};

// Initialize all handlers
const init = () => {
    handleExpandText();
    handleFilter();
    handleDeleteReview();
    handleEditReview();
};

// Run on page load
document.addEventListener('DOMContentLoaded', init);

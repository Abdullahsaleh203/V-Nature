import axios from 'axios';
import { showAlert } from './alerts';

// Handle tour deletion
const deleteButtons = document.querySelectorAll('.delete-tour');

if (deleteButtons.length > 0) {
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const tourId = e.target.dataset.tourId;
      
      if (confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/tours/${tourId}`
          });
          
          if (res.data.status === 'success') {
            showAlert('success', 'Tour deleted successfully!');
            // Remove the row from the table
            e.target.closest('tr').remove();
            
            // Check if there are any tours left
            const remainingTours = document.querySelectorAll('.admin-table tbody tr');
            if (remainingTours.length === 0) {
              // Reload the page to show the "No tours found" message
              window.location.reload();
            }
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
        }
      }
    });
  });
} 

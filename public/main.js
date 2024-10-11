/**
* This is about edit/delete/save button in admin page
* Inline editor 
*/
document.querySelectorAll('.edit-button').forEach(button => {
  button.addEventListener('click', function() {
      // Find the closest table row to the clicked button
      const row = this.closest('.table-row');

      // Get the spans that display the user's name and email
      const userNameSpan = row.querySelector('.user-name');
      const userEmailSpan = row.querySelector('.user-email');

      // Get the input fields for editing the user's name and email
      const editNameInput = row.querySelector('.edit-name');
      const editEmailInput = row.querySelector('.edit-email');

      // Get the "Save" button in the current row
      const saveBtn = row.querySelector('.save-button');

      // https://chatgpt.com/c/66f9b4e6-4308-800f-89c4-4d525efca4ec
      // Toggle the display of the spans and input fields
      // If the span is currently displayed, hide it and show the input field
      // If the span is hidden, show it and hide the input field
      userNameSpan.style.display = userNameSpan.style.display === 'none' ? 'inline' : 'none';
      userEmailSpan.style.display = userEmailSpan.style.display === 'none' ? 'inline' : 'none';
      editNameInput.style.display = editNameInput.style.display === 'none' ? 'inline' : 'none';
      editEmailInput.style.display = editEmailInput.style.display === 'none' ? 'inline' : 'none';

      // Hide the edit button after it's clicked
      this.style.display = 'none';
      // Show the save button
      saveBtn.style.display = 'inline';
  });
});

// Add click event listeners to all save buttons
document.querySelectorAll('.save-button').forEach(button => {
  button.addEventListener('click', function() {
      // Find the closest table row to the clicked save button
      const row = this.closest('.table-row'); // Same logic as delete 

      // Get the spans that display the user's name and email
      const userNameSpan = row.querySelector('.user-name');
      const userEmailSpan = row.querySelector('.user-email');

      // Get the input fields for editing the user's name and email
      const editNameInput = row.querySelector('.edit-name');
      const editEmailInput = row.querySelector('.edit-email');

      // Update the displayed spans with the new values from the input fields
      userNameSpan.textContent = editNameInput.value;
      userEmailSpan.textContent = editEmailInput.value;

      userNameSpan.style.display = 'inline';
      userEmailSpan.style.display = 'inline';

      editNameInput.style.display = 'none';
      editEmailInput.style.display = 'none';

      // Hide the "Save" button after saving the changes
      this.style.display = 'none';
      row.querySelector('.edit-button').style.display = 'inline';
  });
});

/**
 * https://chatgpt.com/share/6707b378-2e20-800f-a235-175a7d153139
 */
document.querySelectorAll('.delete-button').forEach(button => {
  button.addEventListener('click', function() {
      const row = this.closest('.table-row');
      const userId = row.dataset.id; // Get user id from data-id

      // Send DELETE request
      fetch(`/admin/delete-user/${userId}`, {
          method: 'DELETE', // Use delete method 
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              row.remove();
              alert('User deleted successfully!');
          } else {
              alert('Error deleting user: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error deleting user.');
      });
  });
});

/**
 * When the remove button is clicked all the input fields are cleared.
 * This function resets the form
 *  
 */
function resetForm() {
  // Select the form element
  const form = document.querySelector('.class-creating');
  form.reset();
}

/**
 * https://chatgpt.com/share/67043ebd-6690-800f-8d48-006d2f56c77d
 */
// Select all accordion items
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    // Select the accordion link (question) and answer (hidden content)
    const accordionLink = item.querySelector('.accordion-link');
    const answer = item.querySelector('.answer');
    const arrowIcons = item.querySelectorAll('.arrow-icon');

    // Initially hide the answer
    answer.style.maxHeight = null;

    // Add click event listener to each accordion link
    accordionLink.addEventListener('click', () => {
        // Check if the answer is already visible
        const isActive = answer.style.maxHeight !== '0px';

        // Toggle the max-height of the answer for animation
        answer.style.maxHeight = isActive ? '0px' : answer.scrollHeight + 'px'; // Show/Hide answer

        // Toggle the arrow icons
        arrowIcons[0].style.display = isActive ? 'block' : 'none'; // Right arrow
        arrowIcons[1].style.display = isActive ? 'none' : 'block'; // Down arrow
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Get the button and target section
    const button = document.getElementById("become-creator-btn");
    const targetSection = document.getElementById("register-creator");

    // Add click event listener to the button
    button.addEventListener("click", function() {
        // Scroll to the target section smoothly
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});
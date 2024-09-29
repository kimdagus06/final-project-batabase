/**
 * Events page
 * When the Undo button is clicked, the event form will be reset.
 */
document.addEventListener('DOMContentLoaded', () => {
    const undoButton = document.getElementById('undo-event');

    // Check if the Undo button exists in the DOM
    if (undoButton) {
        undoButton.addEventListener('click', function() {
            // Logic to reset the event form goes here
            // Example: document.getElementById('event-form').reset();
            console.log("Event form has been reset."); // Example log for debugging
        });
    } else {
        // If the Undo button is not found, show a message.
        // This is expected when on pages where the button doesn't exist.
        console.log("Element with ID 'undo-event' not found, skipping it.");
    }
});

/**
 * Pagination for grade 4
 * Cite: https://www.sitepoint.com/simple-pagination-html-css-javascript/
 * Function: 
 */
document.addEventListener('DOMContentLoaded', () => {
    const itemsPerPage = 3; // Condition: 3 elements per page
    const items = Array.from(document.querySelectorAll('#class-list li')); // Get all class list items

    // Math. ceil() function returns the smallest integer greater than or equal to a given number
    const totalPages = Math.ceil(items.length / itemsPerPage);
    // Initialize current page to 0 (first page)
    let currentPage = 0; 

    // Function to show the current page of items
    function showPage(page) {
        const startIndex = page * itemsPerPage; // 
        const endIndex = startIndex + itemsPerPage;

        items.forEach((item, index) => {
            item.style.display = (index >= startIndex && index < endIndex) ? 'list-item' : 'none';
        });

        // Update page info
        document.getElementById('page-info').textContent = `Page ${page + 1} of ${totalPages}`;
        updateButtonStates();
    }

    // Update button states
    function updateButtonStates() {
        document.getElementById('prev-page').disabled = currentPage === 0;
        document.getElementById('next-page').disabled = currentPage === totalPages - 1;
    }

    // Event listeners for pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Initialize the first page
    showPage(currentPage);
});

/**
 * When a user clicks edit/delete/save button in admin page
 * https://docs.netlify.com/visual-editor/visual-editing/inline-editor/
 * 
 * Help cite 
 * https://chatgpt.com/share/66f9b4f5-66c8-800f-a454-d6770be5e37f
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const saveButtons = document.querySelectorAll('.save-btn');
  
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const row = button.closest('tr');
        const userNameField = row.querySelector('.user-name');
        const userEmailField = row.querySelector('.user-email');
        const editNameInput = row.querySelector('.edit-name');
        const editEmailInput = row.querySelector('.edit-email');
  
        // Show the input fields and hide the text
        userNameField.style.display = 'none';
        editNameInput.style.display = 'inline';
        userEmailField.style.display = 'none';
        editEmailInput.style.display = 'inline';
  
        // Toggle buttons
        button.style.display = 'none'; // Hide edit button
        const saveButton = row.querySelector('.save-btn');
        saveButton.style.display = 'inline'; // Show save button
      });
    });
  
    saveButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission
  
        const row = button.closest('tr');
        const editNameInput = row.querySelector('.edit-name');
        const editEmailInput = row.querySelector('.edit-email');
  
        // Prepare data to be sent to the server
        const userId = row.dataset.id;
        const updatedUsername = editNameInput.value;
        const updatedEmail = editEmailInput.value;
  
        // Here you would typically make a fetch or AJAX call to your backend API
        // For example, using fetch:
        fetch(`/admin/update-user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: updatedUsername,
            email: updatedEmail
          })
        })
        .then(response => {
          if (response.ok) {
            // Update the displayed user name and email
            row.querySelector('.user-name').textContent = updatedUsername;
            row.querySelector('.user-email').textContent = updatedEmail;
          } else {
            console.error('Error updating user');
          }
        })
        .catch(err => console.error('Fetch error:', err))
        .finally(() => {
          // Hide input fields and show text again
          editNameInput.style.display = 'none';
          editEmailInput.style.display = 'none';
          row.querySelector('.user-name').style.display = 'inline';
          row.querySelector('.user-email').style.display = 'inline';
          button.style.display = 'none'; // Hide save button
          row.querySelector('.edit-btn').style.display = 'inline'; // Show edit button
        });
      });
    });
  });
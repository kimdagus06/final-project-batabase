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
 */
  document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const saveButtons = document.querySelectorAll('.save-btn');

    editButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const userNameInput = row.querySelector('.edit-name');
        const userEmailInput = row.querySelector('.edit-email');
        const userNameDisplay = row.querySelector('.user-name');
        const userEmailDisplay = row.querySelector('.user-email');

        // Toggle input visibility for editing
        userNameDisplay.style.display = 'none';
        userEmailDisplay.style.display = 'none';
        userNameInput.style.display = 'inline-block';
        userEmailInput.style.display = 'inline-block';
        
        // Show Save button and hide Edit button
        btn.style.display = 'none';
        saveButtons[index].style.display = 'inline-block';
      });
    });

    saveButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const userId = row.getAttribute('data-id');
        const newUserName = row.querySelector('.edit-name').value;
        const newUserEmail = row.querySelector('.edit-email').value;

        // Send updated data to the server using fetch
        fetch(`/admin/edit-user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: newUserName,
            emailAddress: newUserEmail,
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Update UI with new values
            row.querySelector('.user-name').textContent = newUserName;
            row.querySelector('.user-email').textContent = newUserEmail;

            // Revert display to non-editable state
            row.querySelector('.user-name').style.display = 'inline';
            row.querySelector('.user-email').style.display = 'inline';
            row.querySelector('.edit-name').style.display = 'none';
            row.querySelector('.edit-email').style.display = 'none';

            // Show Edit button and hide Save button
            btn.style.display = 'none';
            editButtons[index].style.display = 'inline-block';
            
          } else {
            alert('Editing error');
          }
        })
        .catch(err => console.error('Error:', err));
      });
    });
  });
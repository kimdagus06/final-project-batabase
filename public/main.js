/**
* When a user clicks edit/delete/save button in admin page
* https://docs.netlify.com/visual-editor/visual-editing/inline-editor/
* https://chatgpt.com/c/66f9b4e6-4308-800f-89c4-4d525efca4ec
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
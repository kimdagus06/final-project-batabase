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

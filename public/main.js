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
        });
    } else {
        // If the Undo button is not found, show a message.
        // This is expected when on pages where the button doesn't exist.
        console.log("Element with ID 'undo-event' not found, skipping it.");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Find a submenu of the clicked menu
            const submenu = this.nextElementSibling;

            // Hide all submenus 
            document.querySelectorAll('.submenu').forEach(sub => {
                if (sub !== submenu) {
                    sub.classList.remove('show');
                }
            });

            // Toggle a clicked menu's submenus 
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('show');
            }
        });
    });
});

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


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
 * events page
 * when Undo button is clicked, the event form is reset 
 */
document.getElementById('undo-button').addEventListener('click', function() {
    document.getElementById('event-creating').reset();
});

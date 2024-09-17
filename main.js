document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent page from jumping

            // Hide all other submenus
            const allSubmenus = document.querySelectorAll('.submenu');
            allSubmenus.forEach(submenu => submenu.classList.remove('show'));

            // Toggle the visibility of the submenu next to the clicked menu item
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('show');
            }
        });
    });
});
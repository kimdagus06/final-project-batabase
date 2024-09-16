

document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();

        const content = this.getAttribute('data-content'); // Get home, events, logout, etc. 
        let mainContent = document.getElementById('main-content');

        if (!mainContent) {
            mainContent = document.createElement('main');
            mainContent.id = 'main-content';
            mainContent.classList.add('content');
            document.body.appendChild(mainContent);
        }

        // TEST 
        // Organize codes into seperate functions 
        switch (content) {
            case 'home':
                sidebarHomeSection(); 
                break;
            case 'events':
                sidebarEventsSection();
                break;
            case 'logout':
                mainContent.innerHTML = '<h1>Log Out</h1><p>You have logged out.</p>';
                break;
            default:
                mainContent.innerHTML = '<p>Welcome! Select an option from the sidebar.</p>';
        }
    });
});

/**
 * Home 
 */
function sidebarHomeSection() {
    let mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = '<h1>Home</h1><p>This is the home section.</p>';
        mainContent.classList.add('home-style'); // Add class for Home section
    }
}

/**
 * Event
 */
function sidebarEventsSection() {
    let mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = '<h1>Events</h1><p>This is the events section.</p>';
        mainContent.classList.add('events-style'); // Add class for Events section
    }
}

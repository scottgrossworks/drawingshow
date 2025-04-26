//
// controls for the hamburger UI
//

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = hamburger.querySelector('.hamburger-menu');

    // Toggle menu when clicking hamburger
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation(); 
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // Close menu when clicking inside (but not on links)
    menu.addEventListener('click', function(e) {
        // Stop event from reaching hamburger click handler
        e.stopPropagation();
        
        // Only close if click wasn't on a link
        if (!e.target.matches('a') && !e.target.matches('li')) {
            menu.style.display = 'none';
        }
    });
});
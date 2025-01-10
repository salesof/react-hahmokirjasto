document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-links li a");
    const currentUrl = window.location.pathname;

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");

        // Tarkista, täsmääkö linkin href suhteelliseen polkuun
        if (linkHref === currentUrl) {
            link.classList.add("active");
            link.parentElement.classList.add("active");
        }
    });
});
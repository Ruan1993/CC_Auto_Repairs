// --- JavaScript for Mobile Menu and Smooth Scroll ---

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

function closeMobileMenu() {
  mobileMenu.classList.add("hidden");
  menuIcon.classList.remove("hidden");
  closeIcon.classList.add("hidden");
}

function openMobileMenu() {
  mobileMenu.classList.remove("hidden");
  menuIcon.classList.add("hidden");
  closeIcon.classList.remove("hidden");
}

// Toggle menu
mobileMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const isMenuOpen = !mobileMenu.classList.contains("hidden");
  isMenuOpen ? closeMobileMenu() : openMobileMenu();
});

// Smooth Scrolling and Closing Menu on Link Click
document
  .querySelectorAll('a[href^="#"], a.nav-link[href="#"]')
  .forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Only prevent default if it's an internal anchor link
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(
          targetId === "#" ? "body" : targetId
        );

        if (targetElement) {
          // Calculate position to account for sticky nav height
          const navHeight = document.querySelector("nav").offsetHeight;
          const offsetPosition = targetElement.offsetTop - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        // Close the menu if the link was clicked inside the mobile menu
        if (this.closest("#mobile-menu")) {
          setTimeout(closeMobileMenu, 300);
        }
      }
    });
  });

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  const isMenuOpen = !mobileMenu.classList.contains("hidden");
  if (
    isMenuOpen &&
    !mobileMenu.contains(e.target) &&
    !mobileMenuButton.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Initialize Feather icons
feather.replace();
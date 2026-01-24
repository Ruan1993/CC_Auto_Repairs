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

if (window.feather && typeof feather.replace === "function") {
  feather.replace();
} else {
  window.addEventListener("load", () => {
    if (window.feather && typeof feather.replace === "function") {
      feather.replace();
    }
  });
}

const fallbackReviews = [
  {
    text:
      "They explained everything clearly and finished faster than expected. The best auto service experience I've had locally!",
    author: "Michael Johnson",
    rating: 5,
    photo: null,
    relativeTime: "",
  },
  {
    text:
      "Owner Corne diagnosed my suspension issue accurately and provided excellent, honest service. Will definitely return for all my repairs.",
    author: "Sarah Williams",
    rating: 5,
    photo: null,
    relativeTime: "",
  },
  {
    text:
      "I was worried about the cost of my clutch replacement, but CC Auto gave me a fair quote and stuck to it. No hidden surprises!",
    author: "David Brown",
    rating: 5,
    photo: null,
    relativeTime: "",
  },
  {
    text:
      "Professional, friendly, and efficient. My car runs smoother than ever after the major service. Highly recommended!",
    author: "Emily Davis",
    rating: 5,
    photo: null,
    relativeTime: "",
  },
];

const reviewsContainer = document.getElementById("reviews-container");
const reviewPrevBtn = document.getElementById("review-prev");
const reviewNextBtn = document.getElementById("review-next");
let reviewIndex = 0;
let reviewTimer = null;
const ROTATE_MS = 8000;
let reviews = [...fallbackReviews]; // Default to fallback

// Function to generate Initials Avatar SVG
function getInitialsAvatar(name) {
  const names = name.split(" ");
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }
  
  // Material Design colors
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
    "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722"
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${encodeURIComponent(bgColor)}'/><text x='50' y='50' dy='.35em' fill='white' font-family='Arial' font-size='40' text-anchor='middle'>${initials}</text></svg>`;
}

// Function to render stars
function renderStars(rating) {
  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    const fillClass = i < rating ? "text-yellow-400 fill-current" : "text-gray-300";
    starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star ${fillClass}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
  return starsHtml;
}

function showReview(i) {
  reviewIndex = (i + reviews.length) % reviews.length;
  if (!reviewsContainer) return;

  const review = reviews[reviewIndex];
  const photoUrl = review.photo || getInitialsAvatar(review.author);
  const relativeTime = review.relativeTime || ""; // e.g. "2 weeks ago"

  reviewsContainer.style.opacity = 0;
  
  setTimeout(() => {
    // Google-style review card HTML
    reviewsContainer.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-100 relative">
        <!-- Google Logo Badge -->
        <div class="absolute top-6 right-6">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
        </div>

        <div class="flex items-start mb-4">
          <img 
            src="${photoUrl}" 
            alt="${review.author}" 
            class="w-10 h-10 rounded-full mr-4 object-cover border border-gray-200"
            onerror="this.src='${getInitialsAvatar(review.author)}'"
          >
          <div class="text-left">
            <h3 class="font-bold text-gray-900 text-sm">${review.author}</h3>
            <div class="flex items-center mt-0.5 text-xs text-gray-500">
               <span class="mr-2">${relativeTime}</span>
            </div>
            <div class="flex items-center mt-1">
              ${renderStars(review.rating)}
            </div>
          </div>
        </div>
        
        <p class="text-gray-700 italic text-lg leading-relaxed text-left">"${review.text}"</p>
      </div>
    `;

    reviewsContainer.style.opacity = 1;
  }, 300);
}

function startReviewTimer() {
  if (reviewTimer) clearInterval(reviewTimer);
  reviewTimer = setInterval(() => {
    showReview(reviewIndex + 1);
  }, ROTATE_MS);
}

function resetReviewTimer() {
  startReviewTimer();
}

// Attach Event Listeners for Buttons
if (reviewPrevBtn && reviewNextBtn) {
  reviewPrevBtn.addEventListener("click", () => {
    showReview(reviewIndex - 1);
    resetReviewTimer();
  });
  reviewNextBtn.addEventListener("click", () => {
    showReview(reviewIndex + 1);
    resetReviewTimer();
  });
}

// Touch Swipe Detection for Mobile
let touchStartX = 0;
let touchEndX = 0;

if (reviewsContainer) {
  reviewsContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  reviewsContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const threshold = 50; // Minimum distance for swipe
  if (touchEndX < touchStartX - threshold) {
    // Swipe Left (Next)
    showReview(reviewIndex + 1);
    resetReviewTimer();
  }
  if (touchEndX > touchStartX + threshold) {
    // Swipe Right (Prev)
    showReview(reviewIndex - 1);
    resetReviewTimer();
  }
}

// Fetch Reviews from API
async function fetchReviews() {
  const baseUrl = window.RC_REVIEW_COLLECTOR_BASE_URL;
  const widgetId = window.RC_REVIEW_WIDGET_ID;

  if (!baseUrl || !widgetId) {
    console.warn("Review Collector configuration missing. Using fallback.");
    showReview(0);
    startReviewTimer();
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/widget?id=${widgetId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    
    const data = await response.json();
    if (data.reviews && data.reviews.length > 0) {
      // Map API data to our format
      reviews = data.reviews.map(r => ({
        text: r.text,
        author: r.author_name,
        rating: r.rating,
        photo: r.profile_photo_url,
        relativeTime: r.relative_time_description
      }));
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
    // Fallback is already set
  } finally {
    showReview(0);
    startReviewTimer();
  }
}

// Initialize Reviews
document.addEventListener("DOMContentLoaded", () => {
  if (reviewsContainer) {
    fetchReviews();
  }
});

const services = [
  {
    title: "Major Service",
    desc:
      "Comprehensive vehicle check including spark plugs, filters, oil, and a 62-point safety check.",
    icon: "tool",
  },
  {
    title: "Minor Service",
    desc:
      "Essential maintenance package with oil change, fluid top-ups, and a vital safety inspection.",
    icon: "package",
  },
  {
    title: "Suspensions",
    desc:
      "Complete suspension system diagnosis, repair, and alignment for road-gripping control.",
    icon: "truck",
  },
  {
    title: "Brake & Clutch",
    desc:
      "Expert service for your vehicle's critical stopping and transmission systems. Safety first.",
    icon: "shield",
  },
];

const serviceTitleEl = document.getElementById("service-title");
const serviceDescEl = document.getElementById("service-desc");
const serviceIconEl = document.getElementById("service-icon");
const serviceCardEl = document.getElementById("service-card");
const servicePrevBtn = document.getElementById("service-prev");
const serviceNextBtn = document.getElementById("service-next");

let serviceIndex = 0;
let serviceTimer = null;
const SERVICE_ROTATE_MS = 6000;

function renderServiceIcon(name) {
  if (!window.feather || !feather.icons[name] || !serviceIconEl) return;
  serviceIconEl.innerHTML = feather.icons[name].toSvg({
    class: "text-primary w-8 h-8 stroke-2",
  });
}

function showService(i, direction = "next") {
  serviceIndex = (i + services.length) % services.length;
  if (!serviceCardEl || !serviceTitleEl || !serviceDescEl) return;
  const outOffset = direction === "next" ? 40 : -40;
  serviceCardEl.style.opacity = 0;
  serviceCardEl.style.transform = `translateX(${outOffset}px)`;
  setTimeout(() => {
    serviceTitleEl.textContent = services[serviceIndex].title;
    serviceDescEl.textContent = services[serviceIndex].desc;
    renderServiceIcon(services[serviceIndex].icon);
    const inOffset = direction === "next" ? -40 : 40;
    serviceCardEl.style.transform = `translateX(${inOffset}px)`;
    requestAnimationFrame(() => {
      serviceCardEl.style.opacity = 1;
      serviceCardEl.style.transform = "translateX(0)";
    });
  }, 150);
}

function startServiceTimer() {
  serviceTimer = setInterval(() => {
    showService(serviceIndex + 1, "next");
  }, SERVICE_ROTATE_MS);
}

function resetServiceTimer() {
  if (serviceTimer) clearInterval(serviceTimer);
  startServiceTimer();
}

if (servicePrevBtn && serviceNextBtn) {
  servicePrevBtn.addEventListener("click", () => {
    showService(serviceIndex - 1, "prev");
    resetServiceTimer();
  });
  serviceNextBtn.addEventListener("click", () => {
    showService(serviceIndex + 1, "next");
    resetServiceTimer();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (serviceCardEl) {
    showService(0, "next");
    startServiceTimer();
  }
});

const copyBtn = document.getElementById("share-copy");
const copyTip = document.getElementById("share-copy-tip");
const SHARE_URL = "https://ccautorepairs.netlify.app/";
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      if (copyTip) {
        copyTip.textContent = "Copied!";
        copyTip.style.opacity = 1;
        setTimeout(() => {
          copyTip.textContent = "Copy Link";
          copyTip.style.opacity = 0;
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  });
}

// Footer Year Update
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = new Date().getFullYear();
  const copyrightYearEl = document.getElementById("copyright-year");
  if (copyrightYearEl && currentYear > 2025) {
    copyrightYearEl.textContent = `2025-${currentYear}`;
  }
});

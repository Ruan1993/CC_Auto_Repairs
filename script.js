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
  },
  {
    text:
      "Owner Corne diagnosed my suspension issue accurately and provided excellent, honest service. Will definitely return for all my repairs.",
    author: "Sarah Williams",
  },
  {
    text:
      "My car runs smoother after their brake service and fluid change. Transparent pricing and quality service for a first-time customer.",
    author: "David Rodriguez",
  },
];

let reviews = fallbackReviews.slice();

const reviewTextEl = document.getElementById("review-text");
const reviewAuthorEl = document.getElementById("review-author");
const reviewCardEl = document.getElementById("review-card");
const reviewPrevBtn = document.getElementById("review-prev");
const reviewNextBtn = document.getElementById("review-next");

let reviewIndex = 0;
let reviewTimer = null;
const ROTATE_MS = 6000;

function showReview(i, direction = "next") {
  reviewIndex = (i + reviews.length) % reviews.length;
  if (!reviewCardEl || !reviewTextEl || !reviewAuthorEl) return;
  const outOffset = direction === "next" ? 40 : -40;
  reviewCardEl.style.opacity = 0;
  reviewCardEl.style.transform = `translateX(${outOffset}px)`;
  setTimeout(() => {
    reviewTextEl.textContent = reviews[reviewIndex].text;
    reviewAuthorEl.textContent = reviews[reviewIndex].author;
    const inOffset = direction === "next" ? -40 : 40;
    reviewCardEl.style.transform = `translateX(${inOffset}px)`;
    requestAnimationFrame(() => {
      reviewCardEl.style.opacity = 1;
      reviewCardEl.style.transform = "translateX(0)";
    });
  }, 150);
}

function startReviewTimer() {
  reviewTimer = setInterval(() => {
    showReview(reviewIndex + 1);
  }, ROTATE_MS);
}

function resetReviewTimer() {
  if (reviewTimer) clearInterval(reviewTimer);
  startReviewTimer();
}

if (reviewPrevBtn && reviewNextBtn) {
  reviewPrevBtn.addEventListener("click", () => {
    showReview(reviewIndex - 1, "prev");
    resetReviewTimer();
  });
  reviewNextBtn.addEventListener("click", () => {
    showReview(reviewIndex + 1, "next");
    resetReviewTimer();
  });
}

const DEFAULT_REVIEW_COLLECTOR_BASE_URL = "http://localhost:3000";
const DEFAULT_REVIEW_WIDGET_ID = "cc-auto";

async function loadReviewsFromCollector() {
  const baseUrl =
    window.RC_REVIEW_COLLECTOR_BASE_URL || DEFAULT_REVIEW_COLLECTOR_BASE_URL;
  const widgetId = window.RC_REVIEW_WIDGET_ID || DEFAULT_REVIEW_WIDGET_ID;
  const url = `${baseUrl.replace(
    /\/$/,
    "",
  )}/api/widget?id=${encodeURIComponent(widgetId)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) {
      return;
    }
    const mapped = data.reviews
      .filter(
        (r) => r && typeof r.text === "string" && r.text.trim().length > 0,
      )
      .map((r) => ({
        text: r.text.trim(),
        author: r.author_name || "Customer",
      }));
    if (mapped.length > 0) {
      reviews = mapped;
      reviewIndex = 0;
    }
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadReviewsFromCollector();
  showReview(0, "next");
  startReviewTimer();
});

const services = [
  {
    title: "Major Service",
    desc:
      "Comprehensive vehicle service including all fluids, filters, belts, and full system inspection.",
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

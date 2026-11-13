// Update these annual admission details here; the page reads them from this object.
const OPEN_BOARD_CONFIG = {
  admission: {
    lastDate: "Please confirm current last date",
    fees: "Fees vary by class and current board notification. Call 9798336710 for current details."
  },
  eligibility: {
    minimumAge: "Minimum age: Confirm with the latest official BBOSE notification.",
    introduction: "Open schooling may suit learners such as:",
    candidateGroups: [
      "Students who have left school",
      "Working people",
      "Private candidates, if eligible under current rules",
      "Women returning to education",
      "Adults wishing to complete their studies"
    ]
  }
};

document.querySelectorAll("[data-open-board-last-date]").forEach((element) => {
  element.textContent = OPEN_BOARD_CONFIG.admission.lastDate;
});
document.querySelector("[data-open-board-fees]").textContent = OPEN_BOARD_CONFIG.admission.fees;
document.querySelector("[data-open-board-minimum-age]").textContent = OPEN_BOARD_CONFIG.eligibility.minimumAge;
document.querySelector(".eligibility-card [data-open-board-eligibility-intro]").textContent = OPEN_BOARD_CONFIG.eligibility.introduction;
const eligibilityGroups = document.querySelector("[data-open-board-eligibility-groups]");
OPEN_BOARD_CONFIG.eligibility.candidateGroups.forEach((group) => {
  const item = document.createElement("li");
  item.textContent = group;
  eligibilityGroups.append(item);
});

// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("open", !isExpanded);
  document.body.classList.toggle("menu-open", !isExpanded);
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Reveal sections as they enter the viewport.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Animate illustrative counter values when their section becomes visible.
const counters = document.querySelectorAll(".counter");
function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const duration = 1400;
  const startTime = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.floor(target * easedProgress).toLocaleString()}${progress === 1 ? suffix : ""}`;
    if (progress < 1) requestAnimationFrame(updateCounter);
  }

  requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = `${Number(counter.dataset.target).toLocaleString()}${counter.dataset.suffix || ""}`;
  });
}

// Testimonial carousel with arrow and dot navigation.
const reviewCards = Array.from(document.querySelectorAll(".review-card"));
const reviewDots = document.querySelector(".review-dots");
let currentReview = 0;

function showReview(index) {
  currentReview = (index + reviewCards.length) % reviewCards.length;
  reviewCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === currentReview;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-hidden", String(!isActive));
  });
  reviewDots.querySelectorAll(".review-dot").forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentReview;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

reviewCards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = `review-dot${index === 0 ? " active" : ""}`;
  dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
  dot.setAttribute("aria-current", index === 0 ? "true" : "false");
  dot.addEventListener("click", () => showReview(index));
  reviewDots.append(dot);
});
document.querySelector(".prev-review").addEventListener("click", () => showReview(currentReview - 1));
document.querySelector(".next-review").addEventListener("click", () => showReview(currentReview + 1));

// Validate enquiries and open a prefilled WhatsApp message; no backend is required.
const enquiryForm = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const nameInput = enquiryForm.elements.name;
  const mobileInput = enquiryForm.elements.mobile;
  const serviceInput = enquiryForm.elements.service;
  const mobile = mobileInput.value.replace(/\s+/g, "");

  nameInput.setAttribute("aria-invalid", String(!nameInput.checkValidity()));
  mobileInput.setAttribute("aria-invalid", String(!/^[6-9]\d{9}$/.test(mobile)));
  serviceInput.setAttribute("aria-invalid", String(!serviceInput.value));

  if (!nameInput.checkValidity()) {
    nameInput.reportValidity();
    return;
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    mobileInput.setCustomValidity("Enter a valid 10-digit Indian mobile number.");
    mobileInput.reportValidity();
    mobileInput.setCustomValidity("");
    return;
  }
  if (!serviceInput.value) {
    serviceInput.reportValidity();
    return;
  }

  const message = [
    "Hello Om Sai Computer, I have an enquiry.",
    `Name: ${nameInput.value.trim()}`,
    `Mobile: ${mobile}`,
    `Service: ${serviceInput.value}`,
    enquiryForm.elements.message.value.trim() ? `Message: ${enquiryForm.elements.message.value.trim()}` : ""
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/919798336710?text=${encodeURIComponent(message)}`;
  formStatus.textContent = "Your enquiry is ready. Opening WhatsApp…";
  const whatsappLink = document.createElement("a");
  whatsappLink.href = whatsappUrl;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  document.body.append(whatsappLink);
  whatsappLink.click();
  whatsappLink.remove();
});

enquiryForm.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", () => field.removeAttribute("aria-invalid"));
  field.addEventListener("change", () => field.removeAttribute("aria-invalid"));
});

// Dedicated BBOSE enquiry form with validation and a prefilled WhatsApp handoff.
const openBoardForm = document.querySelector("#open-board-form");
const openBoardFormStatus = document.querySelector("#open-board-form-status");

openBoardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openBoardFormStatus.textContent = "";

  const nameInput = openBoardForm.elements.name;
  const mobileInput = openBoardForm.elements.mobile;
  const classInput = openBoardForm.querySelector("#open-board-class");
  const boardTypeInput = openBoardForm.querySelector("#open-board-type");
  const mobile = mobileInput.value.replace(/\s+/g, "");

  nameInput.setAttribute("aria-invalid", String(!nameInput.checkValidity()));
  mobileInput.setAttribute("aria-invalid", String(!/^[6-9]\d{9}$/.test(mobile)));
  classInput.setAttribute("aria-invalid", String(!classInput.value));
  boardTypeInput.setAttribute("aria-invalid", String(!boardTypeInput.value));

  if (!nameInput.checkValidity()) {
    nameInput.reportValidity();
    return;
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    mobileInput.setCustomValidity("Enter a valid 10-digit Indian mobile number.");
    mobileInput.reportValidity();
    mobileInput.setCustomValidity("");
    return;
  }
  if (!classInput.value || !boardTypeInput.value) {
    (classInput.value ? boardTypeInput : classInput).reportValidity();
    return;
  }

  const message = [
    "Hello Om Sai Computer, I have a Bihar Open Board enquiry.",
    `Name: ${nameInput.value.trim()}`,
    `Mobile: ${mobile}`,
    `Class: ${classInput.value}`,
    `Board / exam type: ${boardTypeInput.value}`,
    openBoardForm.elements.message.value.trim() ? `Message: ${openBoardForm.elements.message.value.trim()}` : ""
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/919798336710?text=${encodeURIComponent(message)}`;
  openBoardFormStatus.textContent = "Your enquiry is ready. Opening WhatsApp…";
  const whatsappLink = document.createElement("a");
  whatsappLink.href = whatsappUrl;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  document.body.append(whatsappLink);
  whatsappLink.click();
  whatsappLink.remove();
});

openBoardForm.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", () => field.removeAttribute("aria-invalid"));
  field.addEventListener("change", () => field.removeAttribute("aria-invalid"));
});

// Back-to-top visibility and footer year.
const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#current-year").textContent = new Date().getFullYear();

/*FOOD LOVER'S MARKET REDESIGN */

document.addEventListener("DOMContentLoaded", function () {
  try { initMobileNavigation(); } catch (e) { console.error("Nav error:", e); }
  try { initProductSearchAndFilter(); } catch (e) { console.error("Products error:", e); }
  try { initFaqAccordion(); } catch (e) { console.error("Accordion error:", e); }
  try { initScrollReveal(); } catch (e) { console.error("Scroll error:", e); }
  try { initInteractiveMap(); } catch (e) { console.error("Map error:", e); }
  try { initGalleryLightbox(); } catch (e) { console.error("Lightbox error:", e); }
  try { initEnquiryFormValidation(); } catch (e) { console.error("Enquiry error:", e); }
  try { initContactFormValidation(); } catch (e) { console.error("Contact error:", e); }
});

/* MOBILE NAVIGATION */
function initMobileNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* PRODUCT SEARCH, FILTER & PRICE SORTING */
function initProductSearchAndFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".products-catalog-section .product-card");
  const searchInput = document.getElementById("product-search");
  const sortSelect = document.getElementById("product-sort");
  const gridContainer = document.getElementById("dynamic-product-grid") || document.querySelector(".product-grid");

  if (!productCards.length) return;

  let activeCategory = "all departments";
  let searchQuery = "";

  function filterCards() {
    productCards.forEach(function (card) {
      const badge = card.querySelector(".category-badge");
      const title = card.querySelector("h3");
      const desc = card.querySelector(".product-desc");

      const categoryText = badge ? badge.textContent.trim().toLowerCase() : "";
      const titleText = title ? title.textContent.toLowerCase() : "";
      const descText = desc ? desc.textContent.toLowerCase() : "";

      const matchesCategory =
        activeCategory === "all departments" || categoryText === activeCategory;
      const matchesSearch =
        titleText.includes(searchQuery) || descText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
      button.classList.add("active");
      activeCategory = button.textContent.trim().toLowerCase();
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  if (sortSelect && gridContainer) {
    sortSelect.addEventListener("change", function () {
      const cardsArray = Array.from(productCards);
      const sortValue = sortSelect.value;

      if (sortValue === "price-low" || sortValue === "price-high") {
        cardsArray.sort(function (a, b) {
          const priceA = parseFloat(a.querySelector(".product-price")?.textContent.replace(/[^0-9.]/g, "") || 0);
          const priceB = parseFloat(b.querySelector(".product-price")?.textContent.replace(/[^0-9.]/g, "") || 0);
          return sortValue === "price-low" ? priceA - priceB : priceB - priceA;
        });
        cardsArray.forEach(function (card) { gridContainer.appendChild(card); });
      } else if (sortValue === "name-az") {
        cardsArray.sort(function (a, b) {
          const nameA = a.querySelector("h3")?.textContent || "";
          const nameB = b.querySelector("h3")?.textContent || "";
          return nameA.localeCompare(nameB);
        });
        cardsArray.forEach(function (card) { gridContainer.appendChild(card); });
      }
    });
  }

  // Cart button click animation
  document.querySelectorAll(".add-to-cart-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const original = btn.textContent;
      btn.textContent = "Added to Cart ✓";
      btn.style.backgroundColor = "#1B5E20";
      setTimeout(function () {
        btn.textContent = original;
        btn.style.backgroundColor = "";
      }, 1400);
    });
  });
}

/* FAQ ACCORDION */
function initFaqAccordion() {
  const headers = document.querySelectorAll(".accordion-header, .faq-question");

  headers.forEach(function (header) {
    header.addEventListener("click", function () {
      const panel = header.nextElementSibling;
      const isOpen = header.classList.contains("active");

      headers.forEach(function (h) {
        h.classList.remove("active");
        if (h.nextElementSibling) {
          h.nextElementSibling.style.maxHeight = null;
        }
      });

      if (!isOpen && panel) {
        header.classList.add("active");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

/* SCROLL REVEAL ANIMATIONS*/
function initScrollReveal() {
  const elements = document.querySelectorAll("section, .product-card, .store-card, .card");

  elements.forEach(function (el) { el.classList.add("js-reveal"); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) { observer.observe(el); });
  } else {
    elements.forEach(function (el) { el.classList.add("visible"); });
  }
}

/* INTERACTIVE STORE MAP (LEAFLET) */
function initInteractiveMap() {
  const mapElement = document.getElementById("store-map");
  if (!mapElement || typeof L === "undefined") return;

  const map = L.map("store-map").setView([-34.075, 18.63], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const stores = [
    {
      name: "Food Lover's Market Tokai",
      coords: [-34.0688, 18.4485],
      address: "Cnr Vans Rd & Tokai Rd, Tokai, Cape Town, 7945",
      phone: "021 712 2244",
      hours: "Mon - Fri: 08:00 - 18:00 | Sat: 08:00 - 17:00 | Sun: 09:00 - 14:00"
    },
    {
      name: "Food Lover's Market Somerset West",
      coords: [-34.0815, 18.8251],
      address: "Somerset Value Centre, Centenary Dr, Somerset West, 7130",
      phone: "021 851 2548",
      hours: "Mon - Fri: 08:00 - 18:00 | Sat: 08:00 - 17:00 | Sun: 09:00 - 13:00"
    }
  ];

  stores.forEach(function (store) {
    const marker = L.marker(store.coords).addTo(map);
    marker.bindPopup(
      '<div style="font-family: sans-serif; line-height: 1.4;">' +
      '<h4 style="color: #2E7D32; margin-bottom: 4px; font-weight: bold;">' + store.name + '</h4>' +
      '<p style="margin: 2px 0; font-size: 0.85rem;"><strong>Address:</strong> ' + store.address + '</p>' +
      '<p style="margin: 2px 0; font-size: 0.85rem;"><strong>Phone:</strong> ' + store.phone + '</p>' +
      '<p style="margin: 2px 0; font-size: 0.82rem; color: #4A5568;"><strong>Hours:</strong> ' + store.hours + '</p>' +
      '</div>'
    );
  });
}

/*  GALLERY LIGHTBOX MODAL*/
function initGalleryLightbox() {
  let lightbox = document.getElementById("image-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.className = "lightbox-modal";
    lightbox.innerHTML =
      '<div class="lightbox-overlay"></div>' +
      '<div class="lightbox-dialog">' +
      '<button type="button" class="lightbox-close" aria-label="Close Lightbox">&times;</button>' +
      '<img src="" alt="Enlarged View" class="lightbox-img">' +
      '<p class="lightbox-caption"></p>' +
      '</div>';
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const overlay = lightbox.querySelector(".lightbox-overlay");

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Product Image";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest(".lightbox-trigger");
    if (trigger) {
      const img = trigger.querySelector("img");
      if (img) {
        const caption = trigger.closest(".card")?.querySelector("h3")?.textContent || img.alt;
        openLightbox(img.src, caption);
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (overlay) overlay.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/* ENQUIRY FORM VALIDATION & DYNAMIC RESPONSE */
function initEnquiryFormValidation() {
  const form = document.getElementById("enquiry-form");
  const responseBox = document.getElementById("enquiry-response-box");
  if (!form || !responseBox) return;

  const nameInput = document.getElementById("enquiry-name");
  const emailInput = document.getElementById("enquiry-email");
  const phoneInput = document.getElementById("enquiry-phone");
  const subjectInput = document.getElementById("enquiry-subject");
  const messageInput = document.getElementById("enquiry-message");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase());
  }

  function isValidPhone(phone) {
    const clean = phone.replace(/[\s\-()]/g, "");
    return clean.length >= 10 && clean.length <= 13;
  }

  function showError(input, errorId, msg) {
    input.classList.add("input-error");
    const err = document.getElementById(errorId);
    if (err) {
      err.textContent = msg;
      err.style.display = "block";
    }
  }

  function clearError(input, errorId) {
    input.classList.remove("input-error");
    const err = document.getElementById(errorId);
    if (err) {
      err.textContent = "";
      err.style.display = "none";
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError(nameInput, "enquiry-name-error", "Please enter your full name (min 3 characters).");
      isValid = false;
    } else {
      clearError(nameInput, "enquiry-name-error");
    }

    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "enquiry-email-error", "Please provide a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput, "enquiry-email-error");
    }

    if (!isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, "enquiry-phone-error", "Please enter a valid phone number (at least 10 digits).");
      isValid = false;
    } else {
      clearError(phoneInput, "enquiry-phone-error");
    }

    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      showError(subjectInput, "enquiry-subject-error", "Please enter an enquiry subject.");
      isValid = false;
    } else {
      clearError(subjectInput, "enquiry-subject-error");
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 15) {
      showError(messageInput, "enquiry-message-error", "Please enter a detailed message (min 15 characters).");
      isValid = false;
    } else {
      clearError(messageInput, "enquiry-message-error");
    }

    if (!isValid) {
      responseBox.style.display = "none";
      return;
    }

    const refNum = "FLM-ENQ-" + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });

    responseBox.style.display = "block";
    responseBox.innerHTML =
      '<div style="background-color: #FFFFFF; border: 1.5px solid #2E7D32; border-left: 6px solid #2E7D32; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.06);">' +
      '<h3 style="color: #2E7D32; margin-bottom: 0.5rem;">Enquiry Successfully Processed!</h3>' +
      '<p style="margin-bottom: 0.75rem;">Thank you, <strong>' + nameInput.value.trim() + '</strong>. Your enquiry has been received and verified by our customer care system.</p>' +
      '<div style="background-color: #F7FAFC; padding: 1rem 1.25rem; border-radius: 6px; margin: 1rem 0; border: 1px solid #E2E8F0;">' +
      '<h4 style="color: #1A202C; margin-bottom: 0.5rem;">Enquiry Summary &amp; Lead Time:</h4>' +
      '<p style="margin: 0.25rem 0;"><strong>Reference Number:</strong> <span style="color: #2E7D32; font-weight: 700;">' + refNum + '</span></p>' +
      '<p style="margin: 0.25rem 0;"><strong>Date Submitted:</strong> ' + currentDate + '</p>' +
      '<p style="margin: 0.25rem 0;"><strong>Subject:</strong> ' + subjectInput.value.trim() + '</p>' +
      '<p style="margin: 0.25rem 0;"><strong>Contact Channel:</strong> ' + emailInput.value.trim() + ' | ' + phoneInput.value.trim() + '</p>' +
      '<hr style="margin: 0.75rem 0; border: none; border-top: 1px dashed #CBD5E0;">' +
      '<p style="font-size: 0.95rem; color: #2D3748; margin-top: 0.4rem;"><strong>Estimated Response Time:</strong> <span style="color: #2E7D32; font-weight: 700;">Within 24 Business Hours</span></p>' +
      '<p style="font-size: 0.9rem; color: #4A5568; margin-top: 0.25rem;"><strong>Stock &amp; Availability:</strong> Store inventory holds are provisioned for Tokai &amp; Somerset West bulk catering orders.</p>' +
      '</div>' +
      '<p style="font-size: 0.85rem; color: #718096; margin-bottom: 0;">A confirmation email has been logged to your inbox. Keep your reference number <strong>' + refNum + '</strong> handy for follow-ups.</p>' +
      '</div>';

    responseBox.scrollIntoView({ behavior: "smooth" });
  });

  form.addEventListener("reset", function () {
    responseBox.style.display = "none";
    form.querySelectorAll(".error-msg").forEach(function (err) { err.style.display = "none"; });
    form.querySelectorAll(".input-error").forEach(function (inp) { inp.classList.remove("input-error"); });
  });
}

/* CONTACT FORM EMAIL COMPILER*/
function initContactFormValidation() {
  const form = document.getElementById("contact-form");
  const statusBox = document.getElementById("contact-status-box");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const msgInput = document.getElementById("contact-message");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase());
  }

  function showError(input, errorId, msg) {
    input.classList.add("input-error");
    const err = document.getElementById(errorId);
    if (err) {
      err.textContent = msg;
      err.style.display = "block";
    }
  }

  function clearError(input, errorId) {
    input.classList.remove("input-error");
    const err = document.getElementById(errorId);
    if (err) {
      err.textContent = "";
      err.style.display = "none";
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, "contact-name-error", "Please enter your full name.");
      isValid = false;
    } else {
      clearError(nameInput, "contact-name-error");
    }

    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "contact-email-error", "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput, "contact-email-error");
    }

    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      showError(subjectInput, "contact-subject-error", "Please enter a subject.");
      isValid = false;
    } else {
      clearError(subjectInput, "contact-subject-error");
    }

    if (!msgInput.value.trim() || msgInput.value.trim().length < 15) {
      showError(msgInput, "contact-message-error", "Your message must be at least 15 characters long.");
      isValid = false;
    } else {
      clearError(msgInput, "contact-message-error");
    }

    if (!isValid) {
      if (statusBox) statusBox.style.display = "none";
      return;
    }

    const recipient = "customercare@foodloversmarket.co.za";
    const subject = encodeURIComponent("[" + subjectInput.value.trim() + "] Message from " + nameInput.value.trim());
    const body = encodeURIComponent(
      "Dear Food Lover's Market Customer Care,\n\n" +
      "Sender Name: " + nameInput.value.trim() + "\n" +
      "Email Address: " + emailInput.value.trim() + "\n" +
      "Subject: " + subjectInput.value.trim() + "\n\n" +
      "Message Details:\n" + msgInput.value.trim() + "\n\n" +
      "-------------------------------------------\n" +
      "Submitted via Food Lover's Market Redesign Portal"
    );

    const mailtoLink = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;

    if (statusBox) {
      statusBox.style.display = "block";
      statusBox.style.backgroundColor = "#E8F5E9";
      statusBox.style.border = "1.5px solid #2E7D32";
      statusBox.style.color = "#1B5E20";
      statusBox.innerHTML =
        '<h4 style="margin-bottom: 0.4rem;">Message Compiled Successfully!</h4>' +
        '<p style="margin: 0.25rem 0;">Your email client is opening with your formatted message to <strong>' + recipient + '</strong>.</p>' +
        '<p style="margin-top: 0.5rem; font-size: 0.9rem;">If it didn\'t open automatically, <a href="' + mailtoLink + '" style="color: #2E7D32; font-weight: 700; text-decoration: underline;">click here to launch</a>.</p>';
    }

    window.location.href = mailtoLink;
  });

  form.addEventListener("reset", function () {
    if (statusBox) statusBox.style.display = "none";
    form.querySelectorAll(".error-msg").forEach(function (err) { err.style.display = "none"; });
    form.querySelectorAll(".input-error").forEach(function (inp) { inp.classList.remove("input-error"); });
  });
}
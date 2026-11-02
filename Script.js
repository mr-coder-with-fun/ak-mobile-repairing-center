
"use strict";

/*
  AK MOBILE REPAIRING CENTER
  Shop configuration: update these values before using WhatsApp.
  WhatsApp number format: country code + number, digits only.
  Example format for India: 91XXXXXXXXXX
*/

const SHOP = {
  name: "AK Mobile Repairing Center",
  whatsapp: "9528667137", // Add your WhatsApp number here, e.g. "919876543210"
  phone: "9528667137",    // Add your public shop phone number
  address: "Main chohrah bilsanda road tilchhi",  // Add your shop address
  hours: "8 hours"     // Add actual shop timings
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
const toast = $("#toast");

let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function openWhatsApp(message) {
  const number = SHOP.whatsapp.replace(/\D/g, "");

  if (!/^[1-9]\d{7,14}$/.test(number)) {
    showToast("Pehle script.js mein shop ka WhatsApp number add karo.");
    $("#contact")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const url =
    "https://wa.me/" + number + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

// Mobile navigation
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  $$("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.textContent = "☰";
    });
  });
}

// Animated section reveals
const revealItems = $$(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Footer year
$("#year").textContent = new Date().getFullYear();

// Service enquiry links
$$("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = link.dataset.service;

    if ($("#repairType")) {
      const matchingOption = Array.from($("#repairType").options).find(
        (option) => option.textContent.trim() === service
      );

      if (matchingOption) {
        $("#repairType").value = matchingOption.value;
      } else {
        $("#repairType").value = "Other Problem";
      }
    }
  });
});

// Accessories enquiry
$$("[data-part]").forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsApp(
      "Namaste " + SHOP.name +
      ", mujhe " + button.dataset.part +
      " ki availability aur price ke baare mein jaankari chahiye."
    );
  });
});

// CSC enquiry
$$("[data-topic]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    openWhatsApp(
      "Namaste " + SHOP.name +
      ", mujhe " + link.dataset.topic +
      " ke available services ke baare mein jaankari chahiye."
    );
  });
});

// Contact information
if (SHOP.address) {
  $("#shopAddress").textContent = SHOP.address;
}

if (SHOP.phone) {
  const phoneCard = $$(".contact-card")[1];
  if (phoneCard) {
    phoneCard.querySelector("p").textContent = SHOP.phone;
  }
}

if (SHOP.hours) {
  const hoursCard = $$(".contact-card")[2];
  if (hoursCard) {
    hoursCard.querySelector("p").textContent = SHOP.hours;
  }
}

// Main WhatsApp buttons
["#contactWhatsApp", "#floatingWhatsApp"].forEach((selector) => {
  const button = $(selector);

  if (button) {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      openWhatsApp(
        "Namaste " + SHOP.name +
        ", mujhe aapki mobile repairing services ke baare mein jaankari chahiye."
      );
    });
  }
});

// Repair enquiry form
$("#bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const model = $("#deviceModel").value.trim();
  const problem = $("#repairType").value;
  const details = $("#problemDetails").value.trim();
  const messageBox = $("#bookingMessage");

  if (!name || !model || !problem || !/^\d{10}$/.test(phone)) {
    messageBox.textContent =
      "Please check your name, phone number, model and repair problem.";
    return;
  }

  const message = [
    "Repair Enquiry - " + SHOP.name,
    "",
    "Name: " + name,
    "Customer phone: " + phone,
    "Device: " + model,
    "Problem: " + problem,
    details ? "Details: " + details : "",
    "",
    "Please contact me regarding diagnosis and estimated repair cost."
  ].filter(Boolean).join("\n");

  messageBox.textContent =
    "WhatsApp will open with your enquiry. Press Send there to submit it.";

  openWhatsApp(message);
});

// Repair status enquiry (not live tracking)
$("#statusForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const jobNumber = $("#jobNumber").value.trim();

  if (!jobNumber) {
    $("#statusMessage").textContent =
      "Please enter your repair receipt or job number.";
    return;
  }

  $("#statusMessage").textContent =
    "WhatsApp will open. Send the message to ask the shop for an update.";

  openWhatsApp(
    "Namaste " + SHOP.name +
    ", mere repair job / receipt number " + jobNumber +
    " ka current status bata dijiye."
  );
});

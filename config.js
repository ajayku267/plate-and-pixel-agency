/* ============================================================
   PLATES & PIXELS — CENTRALIZED CONFIGURATION
   ============================================================ */

const CONFIG = {
  businessName: "Plates & Pixels",
  whatsappNumber: "918168246113", // Centralized WhatsApp number without + or spaces
  whatsappNumberFormatted: "+91 81682 46113",
  email: "ajaykumar374011@gmail.com",
  instagramUrl: "https://www.instagram.com/foodbizweb/",
  instagramUsername: "@foodbizweb",
  productionDomain: "https://genuine-kleicha-966907.netlify.app",
  
  // Pre-filled WhatsApp messages
  messages: {
    general: "Hi, I'd like to know more about your restaurant website services.",
    demo: "Hi, I'd like to get a free website demo for my restaurant.",
    pricing: "Hi, I'd like to know more about your restaurant website packages."
  }
};

// Auto-apply configuration to DOM elements on load
document.addEventListener("DOMContentLoaded", () => {
  // Update text values
  document.querySelectorAll("[data-config]").forEach(el => {
    const key = el.getAttribute("data-config");
    if (CONFIG[key]) {
      el.textContent = CONFIG[key];
    }
  });

  // Update link URLs
  document.querySelectorAll("[data-config-link]").forEach(el => {
    const type = el.getAttribute("data-config-link");
    if (type === "whatsapp") {
      const msgType = el.getAttribute("data-msg-type") || "general";
      const message = encodeURIComponent(CONFIG.messages[msgType]);
      el.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    } else if (type === "email") {
      el.href = `mailto:${CONFIG.email}`;
    } else if (type === "instagram") {
      el.href = CONFIG.instagramUrl;
    }
  });

  // Update dynamic canonical tags if they exist
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    const path = window.location.pathname;
    // Keep the path structure matching production
    canonical.href = `${CONFIG.productionDomain}${path.replace(/\/index\.html$/, '/')}`;
  }
});

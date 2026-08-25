/* ============================================================
   nav.js — site-wide masthead + booking modal.

   ADD ONE LINE to each page (in <head> or anywhere in <body>):
       <script src="js/nav.js"></script>

   EDIT the nav in ONE place: the NAV_LINKS array below.
   Whatever you change here updates every page at once.
============================================================ */

(function () {
  "use strict";

  /* ---- 1) EDIT THIS: the nav links (change once, updates everywhere) ---- */
  var NAV_LINKS = [
    { label: "Home",       href: "index.html" },
    { label: "About",       href: "about.html" },
    { label: "Credit List", href: "credit-list.html" },
    { label: "Book a Call",     href: "#book", book: true },   // book:true => opens the booking modal
    { label: "Message Me",  href: "#message", form: true }, // form:true => opens the message-form modal
    { label: "Gear List",   href: "gear.html" }
  ];

  var BRAND     = "Jason Brewer";
  var ROLE      = "Video Production Services";
  var HOME_HREF = "index.html";

  /* ---- booking links (pulled from 8posts) ---- */
  var CAL_IFRAME = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0qjWiIAEzrOzFrJyPog1yhmflvRvygPZNrkt3rDzJJODqFgFjuJjFt0MbrnmrnKViamDnOXc_w?gv=true";
  var CAL_LINK   = "https://calendar.app.google/YcjTkyQbm9hJv12t8";

  /* ---- Google Form (Message Me) ---- */
  var FORM_SRC   = "https://docs.google.com/forms/d/e/1FAIpQLSfPHjFPnfVxNNdRC5nDXPrLdTj5BUlFxpJpX6M7auu8n99Cgw/viewform?embedded=true";

  /* ---- current filename, for active-link highlighting ---- */
  var here = location.pathname.split("/").pop() || "index.html";

  function navLinksHTML() {
    return NAV_LINKS.map(function (l) {
      var cls = l.book ? ' class="js-book"' : (l.form ? ' class="js-form"' : "");
      var cur = (l.href === here) ? ' aria-current="page"' : "";
      return '<a href="' + l.href + '"' + cls + cur + ">" + l.label + "</a>";
    }).join("");
  }

  function headerHTML() {
    return (
      '<header class="masthead">' +
        "<div>" +
          '<a class="masthead__brand" href="' + HOME_HREF + '">' +
            '<h1 class="masthead__name">' + BRAND + "</h1>" +
            '<p class="masthead__role">' + ROLE + "</p>" +
          "</a>" +
        "</div>" +
        '<nav class="masthead__nav" aria-label="Primary">' + navLinksHTML() + "</nav>" +
      "</header>"
    );
  }

  function modalHTML() {
    return (
      '<div class="book-overlay" id="bookOverlay" role="dialog" aria-modal="true" aria-label="Book a time">' +
        '<div class="book-modal">' +
          '<div class="book-head"><h3>Book a time</h3>' +
            '<button class="book-close" id="bookClose" aria-label="Close">&times;</button></div>' +
          '<div class="book-body"><iframe id="bookFrame" title="Booking" loading="lazy" allowfullscreen></iframe></div>' +
        "</div>" +
      "</div>"
    );
  }

  function formModalHTML() {
    return (
      '<div class="book-overlay" id="formOverlay" role="dialog" aria-modal="true" aria-label="Message me">' +
        '<div class="book-modal book-modal--form">' +
          '<div class="book-head"><h3>Message me</h3>' +
            '<button class="book-close" id="formClose" aria-label="Close">&times;</button></div>' +
          '<div class="book-body"><iframe id="formFrame" title="Message form" loading="lazy"></iframe></div>' +
        "</div>" +
      "</div>"
    );
  }

  var STYLES =
    ".book-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.7);" +
    "display:none;align-items:center;justify-content:center;padding:20px;}" +
    ".book-overlay.open{display:flex;}" +
    ".book-modal{background:#fff;border:1px solid #2e2c28;border-radius:16px;width:100%;" +
    "max-width:820px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;}" +
    ".book-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;" +
    "background:#141311;border-bottom:1px solid #2e2c28;}" +
    ".book-head h3{font-family:'Archivo',sans-serif;font-weight:600;font-size:20px;margin:0;color:#e9e6df;}" +
    ".book-close{background:none;border:0;color:#c98a3c;font-size:26px;line-height:1;cursor:pointer;padding:0 4px;}" +
    ".book-close:hover{color:#e9e6df;}" +
    ".book-body{position:relative;height:78vh;}" +
    ".book-body iframe{width:100%;height:100%;border:0;display:block;}" +
    ".book-modal--form{max-width:680px;}" +
    ".book-modal--form .book-body{height:600px;max-height:78vh;}" +
    ".masthead__brand{text-decoration:none;color:inherit;display:inline-block;}";

  function boot() {
    /* inject the modal styles */
    var style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);

    /* inject header at the top of .site (fallback: top of body) */
    var mount = document.querySelector(".site") || document.body;
    mount.insertAdjacentHTML("afterbegin", headerHTML());

    /* inject the booking + message-form modals at the end of body */
    document.body.insertAdjacentHTML("beforeend", modalHTML());
    document.body.insertAdjacentHTML("beforeend", formModalHTML());

    /* booking behaviour: desktop = modal, mobile = new tab */
    var overlay = document.getElementById("bookOverlay");
    var frame   = document.getElementById("bookFrame");
    var loaded  = false;
    function isMobile() { return window.matchMedia("(max-width:767px)").matches; }
    function openBook() {
      if (isMobile()) { window.open(CAL_LINK, "_blank", "noopener"); return; }
      if (!loaded) { frame.src = CAL_IFRAME; loaded = true; }
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeBook() { overlay.classList.remove("open"); document.body.style.overflow = ""; }

    /* message form: modal on all screen sizes */
    var formOverlay = document.getElementById("formOverlay");
    var formFrame   = document.getElementById("formFrame");
    var formLoaded  = false;
    function openForm() {
      if (!formLoaded) { formFrame.src = FORM_SRC; formLoaded = true; }
      formOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeForm() { formOverlay.classList.remove("open"); document.body.style.overflow = ""; }

    document.addEventListener("click", function (e) {
      var b = e.target.closest(".js-book");
      if (b) { e.preventDefault(); openBook(); return; }
      var f = e.target.closest(".js-form");
      if (f) { e.preventDefault(); openForm(); }
    });
    document.getElementById("bookClose").addEventListener("click", closeBook);
    document.getElementById("formClose").addEventListener("click", closeForm);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeBook(); });
    formOverlay.addEventListener("click", function (e) { if (e.target === formOverlay) closeForm(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeBook(); closeForm(); } });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
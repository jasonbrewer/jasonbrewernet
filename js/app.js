/* ============================================================
   app.js  —  builds the home grid, collection grids, and
   project pages from js/data.js. You shouldn't need to edit
   this to add work.
============================================================ */

(function () {
  "use strict";

  var HOME        = window.HOME || [];
  var COLLECTIONS = window.COLLECTIONS || {};
  var PROJECTS    = window.PROJECTS || [];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function placeholder(title) {
    var t = String(title || "").toUpperCase();
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#1b1a18"/>' +
      '<rect x="1" y="1" width="798" height="598" fill="none" stroke="#2e2c28" stroke-width="2"/>' +
      '<g stroke="#c98a3c" stroke-width="3" fill="none" opacity="0.55">' +
      '<path d="M40 70 H70 M40 70 V100"/><path d="M760 70 H730 M760 70 V100"/>' +
      '<path d="M40 530 H70 M40 530 V500"/><path d="M760 530 H730 M760 530 V500"/></g>' +
      '<text x="400" y="305" fill="#e9e6df" font-family="Arial,sans-serif" font-size="34" ' +
      'font-weight="700" letter-spacing="2" text-anchor="middle">' + esc(t) + '</text>' +
      '</svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /* ---- one tile (shared by home + collections) ---- */
  function tileHTML(t) {
    var fallback = "this.onerror=null;this.src='" + placeholder(t.title) + "'";
    var sub  = t.subtitle ? '<span class="tile__sub">' + esc(t.subtitle) + "</span>" : "";
    var lock = t.locked ? '<span class="tile__lock">Password protected</span>' : "";
    return (
      '<a class="tile" href="' + esc(t.href || "#") + '">' +
        '<div class="tile__frame">' +
          '<img class="tile__img" loading="lazy" alt="" src="' + esc(t.thumb || "") +
          '" onerror="' + fallback + '"></div>' +
        '<div class="tile__label">' +
          '<span class="tile__title">' + esc(t.title) + "</span>" + sub + lock +
        "</div>" +
      "</a>"
    );
  }

  function renderTiles(mount, tiles) {
    if (!tiles || !tiles.length) {
      mount.innerHTML = '<p class="empty">Nothing here yet. Add tiles in js/data.js.</p>';
      return;
    }
    mount.innerHTML = tiles.map(tileHTML).join("");
  }

  /* ---- collection page (collection.html?c=NAME) ---- */
  function renderCollection(mount) {
    var key = param("c");
    var col = COLLECTIONS[key];
    var head = document.getElementById("collection-head");

    if (!col) {
      if (head) head.innerHTML = "";
      mount.innerHTML = '<p class="empty">That collection doesn\'t exist. ' +
        '<a href="index.html">Back home</a>.</p>';
      return;
    }
    document.title = col.title;
    if (head) {
      head.innerHTML =
        '<a class="backlink" href="index.html">&larr; All work</a>' +
        '<h1 class="section__title">' + esc(col.title) + "</h1>" +
        (col.intro ? '<p class="section__intro">' + esc(col.intro) + "</p>" : "");
    }
    renderTiles(mount, col.tiles);
  }

   /* ---- video + stills for a project ---- */
  function videoBlock(v) {
    if (!v || !v.type) return "";
    var inner = "";
    if (v.type === "youtube") {
      var yt = esc(v.id) + "?rel=0&modestbranding=1&playsinline=1" +
        (v.autoplay ? "&autoplay=1&mute=1" : "") +
        (v.params ? "&" + esc(v.params) : "");
      inner = '<iframe src="https://www.youtube.com/embed/' + yt +
        '" title="Video" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';
    } else if (v.type === "vimeo") {
      var vm = v.autoplay ? "?autoplay=1&muted=1" : "";
      inner = '<iframe src="https://player.vimeo.com/video/' + esc(v.id) + vm +
        '" title="Video" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>';
    } else if (v.type === "embed") {
      inner = '<iframe src="' + esc(v.src) + '" title="Video" allowfullscreen></iframe>';
    } else if (v.type === "file") {
      var poster = v.poster ? ' poster="' + esc(v.poster) + '"' : "";
      return '<div class="media"><video class="media__native" controls preload="none"' +
        poster + ' src="' + esc(v.src) + '"></video></div>';
    }
    var vert = v.vertical ? " media__frame--vertical" : "";
    return '<div class="media"><div class="media__frame' + vert + '">' + inner + "</div></div>";
  }

  function videosBlock(list) {
    if (!list || !list.length) return "";
    return list.map(videoBlock).join("");
  }

  function galleryBlock(list) {
    if (!list || !list.length) return "";
    return '<div class="shots">' + list.map(function (src) {
      return '<img class="shots__img" loading="lazy" alt="" src="' + esc(src) + '">';
    }).join("") + "</div>";
  }

  function bodyHTML(text) {
    if (!text) return "";
    var out = String(text).split(/\n\s*\n/).map(function (block) {
      block = block.replace(/^\s+|\s+$/g, "");
      if (!block) return "";
      if (block.indexOf("![") === 0 && block.slice(-1) === "]") {
        var src = block.slice(2, -1).trim();
        return '<img class="detail__inline-img" loading="lazy" alt="" src="' + esc(src) + '">';
      }
      if (block.indexOf("## ") === 0) {
        var nl = block.indexOf("\n");
        if (nl === -1) {
          return '<h3 class="detail__subhead">' + esc(block.slice(3).trim()) + "</h3>";
        }
        var head = block.slice(3, nl).trim();
        var rest = block.slice(nl + 1).trim();
        return '<h3 class="detail__subhead">' + esc(head) + "</h3>" +
               (rest ? "<p>" + esc(rest) + "</p>" : "");
      }
      return "<p>" + esc(block) + "</p>";
    }).join("");
    return '<div class="detail__body">' + out + "</div>";
  }
  
  /* ---- project page (project.html?p=SLUG) ---- */
  function renderProject(mount) {
    var slug = param("p");
    var p = PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    if (!p) {
      document.title = "Not found";
      mount.innerHTML = '<p class="empty">That project doesn\'t exist yet. ' +
        '<a href="index.html">Back to the gallery</a>.</p>';
      return;
    }
    document.title = p.title;
    var eyebrow = p.category ? '<p class="detail__eyebrow">' + esc(p.category) + "</p>" : "";
    var desc = bodyHTML(p.description);

    var head =
      '<a class="backlink" href="index.html">&larr; All work</a>' +
      '<header class="detail__head">' + eyebrow +
        '<h1 class="detail__title">' + esc(p.title) + "</h1></header>";

    var content = videoBlock(p.video) + videosBlock(p.videos) + galleryBlock(p.gallery) + desc;

    if (p.locked && p.password) {
      mount.innerHTML = head +
        '<div class="gate">' +
          '<p class="gate__msg">This project is password protected.</p>' +
          '<input class="gate__input" type="password" placeholder="Enter password" autocomplete="off">' +
          '<button class="gate__btn" type="button">View</button>' +
          '<p class="gate__error" hidden>Incorrect password.</p>' +
        "</div>";

      var input = mount.querySelector(".gate__input");
      var btn   = mount.querySelector(".gate__btn");
      var err   = mount.querySelector(".gate__error");

      var tryUnlock = function () {
        if (input.value === p.password) {
          mount.innerHTML = head + content;
        } else {
          err.hidden = false;
          input.value = "";
          input.focus();
        }
      };
      btn.addEventListener("click", tryUnlock);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") tryUnlock();
      });
      return;
    }

    mount.innerHTML = head + content;
  }

  /* ---- boot: pick behaviour from whichever mount exists ---- */
  document.addEventListener("DOMContentLoaded", function () {
    var home = document.getElementById("gallery");
    if (home) renderTiles(home, HOME);

    var col = document.getElementById("collection");
    if (col) renderCollection(col);

    var proj = document.getElementById("project");
    if (proj) renderProject(proj);

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();

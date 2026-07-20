// Tiny, dependency-free. Everything degrades gracefully with JS off:
// the form posts natively to Formspree, the theme follows prefers-color-scheme,
// dialogs simply never open, navigation is plain links.
(function () {
  "use strict";
  var root = document.documentElement;
  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // ---- theme ----------------------------------------------------
  var themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    if (persist) localStorage.setItem("theme", theme);
  }

  // Re-read the persisted theme. Needed because prerendered pages and
  // bfcache-restored pages run/keep JS from *before* the latest toggle.
  function syncTheme() {
    var t = localStorage.getItem("theme");
    if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(t, false);
  }
  syncTheme();

  themeBtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  // ---- sound (off by default; synthesized, no audio files) ------
  // Note: intentionally NOT gated on prefers-reduced-motion. That setting is
  // about motion, and gating audio on it made the toggle show "on" while
  // tone() silently refused to play.
  var soundBtn = document.getElementById("sound-toggle");
  var soundOn = false;
  var audioCtx = null;

  function renderSound() {
    soundBtn.setAttribute("aria-pressed", String(soundOn));
  }

  // Re-read persisted sound state (see syncTheme for why).
  function syncSound() {
    soundOn = localStorage.getItem("sound") === "on";
    renderSound();
  }
  syncSound();

  function ctx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  // One short tone: freq (optionally gliding to freq2), duration, volume.
  function tone(freq, dur, vol, freq2) {
    if (!soundOn) return;
    var ac = ctx();
    var play = function () {
      var t = ac.currentTime;
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    };
    // resume() is async; play only once the context is actually running,
    // otherwise the first tone after idle/navigation can be swallowed.
    if (ac.state === "suspended") {
      ac.resume().then(play).catch(function () {});
    } else {
      play();
    }
  }

  var clickSound = function () { tone(1800, 0.05, 0.06); };
  var hoverSound = function () { tone(2600, 0.03, 0.018); };
  var switchSound = function () { tone(900, 0.09, 0.05, 1500); };
  var errorSound = function () { tone(420, 0.14, 0.06, 260); };

  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    localStorage.setItem("sound", soundOn ? "on" : "off");
    renderSound();
    if (soundOn) tone(2200, 0.05, 0.06); // audible confirmation when turning on
  });

  // click feedback on buttons; page-switch whoosh on nav links
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav-item")) return switchSound();
    var btn = e.target.closest("button");
    if (btn && btn !== soundBtn) clickSound();
  });

  // subtle hover blip on interactive elements
  document.addEventListener("pointerover", function (e) {
    var el = e.target.closest("button, .nav-item");
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) hoverSound();
  });

  // ---- SPA routing (real paths + History API + View Transitions) -
  var BASE = "/portfolio"; // repo name; update if the repo is renamed
  var navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));

  var pathToName = {
    "/": "about",
    "/principles": "principles",
    "/experience": "experience",
    "/projects": "projects",
    "/media": "media",
    "/contact": "contact"
  };
  var nameToPath = {
    about: BASE + "/",
    principles: BASE + "/principles",
    experience: BASE + "/experience",
    projects: BASE + "/projects",
    media: BASE + "/media",
    contact: BASE + "/contact"
  };
  var titles = {
    about: "Justin M. Ramirez — Senior Front-end Developer",
    principles: "Principles — Justin M. Ramirez",
    experience: "Experience — Justin M. Ramirez",
    projects: "Projects — Justin M. Ramirez",
    media: "Media — Justin M. Ramirez",
    contact: "Contact — Justin M. Ramirez"
  };

  function nameFromLocation() {
    var path = location.pathname.replace(/\/+$/, ""); // drop trailing slash
    var rel = path.slice(BASE.length) || "/";         // strip the base
    return pathToName[rel] || "about";
  }

  function render(name) {
    sections.forEach(function (s) { s.hidden = s.dataset.section !== name; });
    navItems.forEach(function (item) {
      var active = item.dataset.route === name;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    document.title = titles[name];
  }

  function navigate(name) {
    var run = function () { render(name); };
    if (document.startViewTransition && !reducedMotion.matches) {
      document.startViewTransition(run);
    } else {
      run();
    }
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest(".nav-item");
    if (!link) return;
    // let modified clicks / new-tab / non-primary buttons behave natively
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var name = link.dataset.route;
    if (name === nameFromLocation()) return;
    history.pushState({ section: name }, "", nameToPath[name]);
    navigate(name);
  });

  addEventListener("popstate", function () { navigate(nameFromLocation()); });

  // initial paint (after the 404 restore in <head> has run)
  render(nameFromLocation());

  // ---- dialogs ---------------------------------------------------
  document.querySelectorAll("[data-dialog]").forEach(function (btn) {
    var dialog = document.getElementById(btn.getAttribute("data-dialog"));
    if (!dialog || !dialog.showModal) return;
    btn.addEventListener("click", function () {
      dialog.showModal();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close(); // click on backdrop
    });
  });

  // ---- contact form (contact page only) --------------------------
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");

    var setError = function (input, show) {
      var error = document.getElementById(input.getAttribute("aria-describedby"));
      error.hidden = !show;
      input.setAttribute("aria-invalid", String(show));
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll(".form-input").forEach(function (input) {
        var bad = !input.checkValidity();
        setError(input, bad);
        if (bad && valid) {
          input.focus();
          valid = false;
        }
      });
      if (!valid) {
        errorSound();
        return;
      }

      status.classList.remove("is-error", "is-success", "is-hiding");
      status.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Formspree responded " + res.status);
          status.classList.add("is-success");
          status.textContent = "Thanks — message sent.";
          form.reset();
          setTimeout(function () {
            status.classList.add("is-hiding");
            setTimeout(function () {
              status.textContent = "";
              status.classList.remove("is-success", "is-hiding");
            }, 400);
          }, 3000);
        })
        .catch(function () {
          errorSound();
          status.classList.add("is-error");
          status.textContent = "Something went wrong. Email me directly instead.";
        });
    });
  }

  // ---- keep state fresh across prerender / bfcache / tabs --------
  function syncAll() {
    syncTheme();
    syncSound();
  }

  // Prerendered pages (via our speculation rules) execute this script long
  // before the user navigates; re-sync at the moment they become visible.
  if ("prerendering" in document) {
    document.addEventListener("prerenderingchange", syncAll);
  }

  // Pages restored from the back/forward cache keep their old JS state;
  // pageshow with persisted=true fires on restore.
  addEventListener("pageshow", function (e) {
    if (e.persisted) syncAll();
  });

  // Another tab (or window) changed the setting.
  addEventListener("storage", function (e) {
    if (e.key === "theme" || e.key === "sound") syncAll();
  });

  // ---- enable transitions after first paint ----------------------
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.remove("no-transitions");
    });
  });
})();
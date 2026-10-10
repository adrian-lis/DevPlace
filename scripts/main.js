"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-button");
  const menu = document.querySelector(".menu");

  if (!menuButton || !menu) {
    return;
  }

  function openMenu() {
    menu.classList.add("open");

    menuButton.setAttribute("aria-expanded", "true");

    menuButton.setAttribute("aria-label", "Close menu");
  }

  function closeMenu() {
    menu.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.setAttribute("aria-label", "Open menu");
  }

  function toggleMenu() {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("open") &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /*
   * Accessibility settings
   */

  const STORAGE_KEY = "devplace-settings";

  const defaultSettings = {
    theme: "dark",
    fontScale: 1,
    contrast: false,
    motion: false,
  };

  let settings = {
    ...defaultSettings,
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (!saved || typeof saved !== "object") {
        return;
      }

      if (saved.theme === "dark" || saved.theme === "light") {
        settings.theme = saved.theme;
      }

      if (
        typeof saved.fontScale === "number" &&
        saved.fontScale >= 0.9 &&
        saved.fontScale <= 1.2
      ) {
        settings.fontScale = saved.fontScale;
      }

      if (typeof saved.contrast === "boolean") {
        settings.contrast = saved.contrast;
      }

      if (typeof saved.motion === "boolean") {
        settings.motion = saved.motion;
      }
    } catch {
      settings = {
        ...defaultSettings,
      };
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function applySettings() {
    const root = document.documentElement;

    root.dataset.theme = settings.theme;

    root.style.setProperty("--font-scale", settings.fontScale);

    root.classList.toggle("high-contrast", settings.contrast);

    root.classList.toggle("reduce-motion", settings.motion);

    document.querySelectorAll("[data-theme-setting]").forEach((button) => {
      const active = button.dataset.themeSetting === settings.theme;

      button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-toggle-setting]").forEach((button) => {
      const setting = button.dataset.toggleSetting;

      if (Object.prototype.hasOwnProperty.call(settings, setting)) {
        button.setAttribute("aria-pressed", String(settings[setting]));
      }
    });
  }

  document.querySelectorAll("[data-theme-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeSetting;

      if (theme !== "dark" && theme !== "light") {
        return;
      }

      settings.theme = theme;

      saveSettings();
      applySettings();
    });
  });

  document.querySelectorAll("[data-font-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.fontAction;

      if (action === "increase") {
        settings.fontScale = Math.min(1.2, settings.fontScale + 0.1);
      }

      if (action === "decrease") {
        settings.fontScale = Math.max(0.9, settings.fontScale - 0.1);
      }

      saveSettings();
      applySettings();
    });
  });

  document.querySelectorAll("[data-toggle-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      const setting = button.dataset.toggleSetting;

      if (!Object.prototype.hasOwnProperty.call(settings, setting)) {
        return;
      }

      settings[setting] = !settings[setting];

      saveSettings();
      applySettings();
    });
  });

  document.querySelectorAll("[data-reset-settings]").forEach((button) => {
    button.addEventListener("click", () => {
      settings = {
        ...defaultSettings,
      };

      saveSettings();
      applySettings();
    });
  });

  loadSettings();
  applySettings();
});

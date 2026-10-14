"use strict";

(() => {
  function formatSize(bytes) {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value < 0) return "Not provided";
    if (value < 1024) return `${value} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let size = value / 1024;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
  }

  function formatDate(value) {
    if (!value) return "Not provided";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not provided";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  async function updateCard(card) {
    const link = card.querySelector("a.download-card-link[href]");
    if (!link) return;

    const size = card.querySelector('[data-file-meta="size"]');
    const updated = card.querySelector('[data-file-meta="updated"]');
    const fileUrl = new URL(link.getAttribute("href"), window.location.href);

    try {
      const response = await fetch(fileUrl, { method: "HEAD", cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = response.headers.get("content-length");
      const lastModified = response.headers.get("last-modified");

      if (size) size.textContent = contentLength ? formatSize(contentLength) : "Not provided";
      if (updated) updated.textContent = lastModified ? formatDate(lastModified) : "Not provided";
      card.dataset.fileAvailable = "true";
    } catch {
      if (size) size.textContent = "Unavailable";
      if (updated) updated.textContent = "Unavailable";
      card.dataset.fileAvailable = "false";
    }
  }

  function initialize() {
    document.querySelectorAll(".download-card").forEach(updateCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

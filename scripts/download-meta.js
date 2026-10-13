(() => {
  "use strict";

  const UNKNOWN = "Unknown";

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) {
      return UNKNOWN;
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const units = ["KB", "MB", "GB", "TB"];
    let size = bytes / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  function formatDate(value) {
    if (!value) {
      return UNKNOWN;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return UNKNOWN;
    }

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  async function updateDownloadCard(card) {
    const link = card.querySelector("a[download][href]");
    const sizeElement = card.querySelector('[data-file-meta="size"]');
    const updatedElement = card.querySelector('[data-file-meta="updated"]');

    if (!link || (!sizeElement && !updatedElement)) {
      return;
    }

    try {
      const response = await fetch(link.href, {
        method: "HEAD",
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentLength = response.headers.get("Content-Length");
      const lastModified = response.headers.get("Last-Modified");

      if (sizeElement) {
        const bytes = contentLength === null ? NaN : Number(contentLength);

        sizeElement.textContent = formatFileSize(bytes);
      }

      if (updatedElement) {
        updatedElement.textContent = formatDate(lastModified);
      }
    } catch (error) {
      console.warn("Could not retrieve download metadata:", link.href, error);

      if (sizeElement) {
        sizeElement.textContent = UNKNOWN;
      }

      if (updatedElement) {
        updatedElement.textContent = UNKNOWN;
      }
    }
  }

  function initDownloadMetadata() {
    document.querySelectorAll(".download-card").forEach((card) => {
      updateDownloadCard(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDownloadMetadata);
  } else {
    initDownloadMetadata();
  }
})();

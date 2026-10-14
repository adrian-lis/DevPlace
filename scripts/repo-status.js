"use strict";

(() => {
  const API = "https://api.github.com/repos/";
  const CACHE_KEY = "devplace-repository-status-v1";
  const CACHE_TTL = 5 * 60 * 1000;
  const cache = new Map();

  function readCache(repository) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}")[repository];
      if (saved && Date.now() - saved.time < CACHE_TTL) return saved.result;
    } catch {
      // Storage may be disabled; continue without persistent caching.
    }
    return undefined;
  }

  function writeCache(repository, result) {
    try {
      const all = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
      all[repository] = { time: Date.now(), result };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(all));
    } catch {
      // Storage may be disabled; in-memory caching still works.
    }
  }

  async function getRepositoryStatus(repository) {
    if (!repository) return { state: "unknown", reason: "Missing data-repository attribute" };
    if (cache.has(repository)) return cache.get(repository);

    const cached = readCache(repository);
    if (cached !== undefined) {
      const value = Promise.resolve(cached);
      cache.set(repository, value);
      return value;
    }

    const request = (async () => {
      try {
        let response;
        let lastError;

        // Retry one time for temporary network failures and transient GitHub errors.
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          try {
            response = await fetch(`${API}${repository}`, {
              headers: { Accept: "application/vnd.github+json" },
              signal: controller.signal,
              cache: "no-store",
            });

            if (attempt < 2 && (response.status === 429 || response.status >= 500)) {
              await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
              continue;
            }
            break;
          } catch (error) {
            lastError = error;
            if (attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
              continue;
            }
            throw error;
          } finally {
            clearTimeout(timeout);
          }
        }

        if (!response) throw lastError || new Error("No response received from GitHub API");

        if (response.status === 404) {
          const result = { state: "bad", reason: "GitHub returned 404 Not Found" };
          writeCache(repository, result);
          return result;
        }
        if (response.status === 403 || response.status === 429) {
          const remaining = response.headers.get("X-RateLimit-Remaining");
          const result = {
            state: "unknown",
            reason: remaining === "0" || response.status === 429
              ? "GitHub API rate limit exceeded"
              : "GitHub API returned 403 Forbidden",
          };
          console.warn(`[Dev Place] ${repository}: ${result.reason}`);
          return result;
        }
        if (!response.ok) {
          const result = { state: "unknown", reason: `GitHub API returned HTTP ${response.status}` };
          console.warn(`[Dev Place] ${repository}: ${result.reason}`);
          return result;
        }

        const data = await response.json();
        const result = data && data.full_name
          ? { state: "ok", reason: "" }
          : { state: "unknown", reason: "GitHub API response did not contain a repository name" };
        if (result.state !== "unknown") writeCache(repository, result);
        return result;
      } catch (error) {
        const reason = error && error.name === "AbortError"
          ? "GitHub API request timed out after three attempts"
          : "GitHub API request failed after three attempts (network, CORS, or browser extension)";
        console.warn(`[Dev Place] ${repository}: ${reason}`, error);
        return { state: "unknown", reason };
      }
    })();

    cache.set(repository, request);
    return request;
  }

  function showStatus(element, result) {
    if (!element) return;
    const labels = {
      ok: "Repository available",
      bad: "Repository unavailable",
      unknown: "Repository status unavailable",
    };
    element.textContent = labels[result.state] || labels.unknown;
    element.dataset.state = result.state || "unknown";
    // Keep generic browser/network failures out of the hover tooltip; the status label
    // already communicates that the result could not be verified.
    if (result.reason && !/network, CORS, or browser extension/i.test(result.reason)
        && !/timed out after three attempts/i.test(result.reason)) {
      element.title = result.reason;
    } else {
      element.removeAttribute("title");
    }
  }

  async function fileExists(url) {
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (response.ok) return true;
      if (response.status === 404 || response.status === 410) return false;
      return null;
    } catch (error) {
      console.warn(`[Dev Place] Could not check download file ${url}`, error);
      return null;
    }
  }

  function getRepository(card) {
    return (card.dataset.repository || "").trim();
  }

  function ensureStatus(card) {
    let status = card.querySelector("[data-repository-status]");
    if (!status) {
      const heading = card.querySelector(".project-card-title-row, .download-card-heading") || card;
      status = document.createElement("span");
      status.className = "project-status";
      status.dataset.repositoryStatus = "";
      status.setAttribute("aria-live", "polite");
      status.textContent = "Checking repository…";
      heading.append(status);
    }
    return status;
  }

  async function updateRepositoryStatuses(cards) {
    await Promise.all(cards.map(async (card) => {
      const status = ensureStatus(card);
      const result = await getRepositoryStatus(getRepository(card));
      showStatus(status, result);
    }));
  }

  async function updateProjectDownloads(projectCards) {
    let downloadsDocument;
    let downloadsUrl;

    try {
      const response = await fetch("../downloads/", { cache: "no-store" });
      if (!response.ok) {
        console.warn(`[Dev Place] Could not load Downloads page: HTTP ${response.status}`);
        return;
      }
      downloadsDocument = new DOMParser().parseFromString(await response.text(), "text/html");
      downloadsUrl = response.url || new URL("../downloads/", window.location.href).href;
    } catch (error) {
      console.warn("[Dev Place] Could not load Downloads page for project buttons.", error);
      return;
    }

    await Promise.all(projectCards.map(async (project) => {
      const repository = getRepository(project).toLowerCase();
      const matchingCard = Array.from(
        downloadsDocument.querySelectorAll(".download-card[data-repository]")
      ).find((item) => getRepository(item).toLowerCase() === repository);
      const link = matchingCard?.querySelector("a.download-card-link[href][download]");
      const footer = project.querySelector(".project-card-footer");
      if (!link || !footer) return;

      const fileUrl = new URL(link.getAttribute("href"), downloadsUrl).href;
      if (await fileExists(fileUrl) !== true) return;

      let button = footer.querySelector(".project-download-link");
      if (!button) {
        button = document.createElement("a");
        button.className = "project-action project-action-primary project-download-link";
        button.textContent = "Downloads ↓";
        footer.append(button);
      }

      const title = matchingCard.querySelector(".download-card-title")?.textContent.trim();
      button.href = `../downloads/?search=${encodeURIComponent(title || "")}`;
      button.setAttribute("aria-label", `Find ${title || "download"} on the Downloads page`);
    }));
  }

  async function initialize() {
    const projects = Array.from(document.querySelectorAll(".projects-grid .project-card[data-repository]"));
    const downloads = Array.from(document.querySelectorAll(".download-card[data-repository]"));

    if (projects.length) {
      await Promise.all([
        updateRepositoryStatuses(projects),
        updateProjectDownloads(projects),
      ]);
    }
    if (downloads.length) await updateRepositoryStatuses(downloads);

    if (!projects.length && !downloads.length) {
      console.warn("[Dev Place] No repository cards found. Check data-repository attributes and page markup.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

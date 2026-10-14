"use strict";

(() => {
  const searchInput = document.querySelector(".search-input");
  const projectGrid = document.querySelector(".projects-grid");
  const filterButtons = document.querySelectorAll(".project-filter");
  const resultCount = document.querySelector("#projects-results");
  const emptyState = document.querySelector("#projects-empty");
  const resetButton = document.querySelector("#reset-project-filters");

  if (!searchInput || !projectGrid) return;

  const cards = Array.from(projectGrid.querySelectorAll(":scope > .project-card"));
  let activeCategory = "all";

  function updateProjects() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
      const searchableText = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
      const categories = (card.dataset.categories || "").split(/\s+/);
      const matchesQuery = query === "" || searchableText.includes(query);
      const matchesCategory = activeCategory === "all" || categories.includes(activeCategory);
      const visible = matchesQuery && matchesCategory;

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    if (resultCount) {
      resultCount.textContent = `Showing ${visibleCount} of ${cards.length} projects`;
    }

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      for (const filterButton of filterButtons) {
        const selected = filterButton === button;
        filterButton.classList.toggle("active", selected);
        filterButton.setAttribute("aria-pressed", String(selected));
      }
      updateProjects();
    });
  }

  searchInput.addEventListener("input", updateProjects);

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      activeCategory = "all";
      for (const button of filterButtons) {
        const selected = button.dataset.category === "all";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      }
      updateProjects();
      searchInput.focus();
    });
  }

  updateProjects();
})();

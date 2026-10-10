"use strict";

const searchInput = document.querySelector(".search-input");

const searchList = document.querySelector(".search-list");

function filterSearchResults() {
  if (!searchInput || !searchList) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();

  const items = searchList.querySelectorAll(":scope > li");

  for (const item of items) {
    const text = item.textContent.trim().toLowerCase();

    const matches = query === "" || text.includes(query);

    item.hidden = !matches;
  }
}

if (searchInput && searchList) {
  searchInput.addEventListener("input", filterSearchResults);

  filterSearchResults();
}

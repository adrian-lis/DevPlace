"use strict";

(() => {
  const input = document.querySelector(".search-input");
  const list = document.querySelector(".search-list");
  if (!input || !list) return;

  function filterItems() {
    const query = input.value.trim().toLowerCase();
    for (const item of list.querySelectorAll(":scope > li")) {
      item.hidden = query !== "" && !item.textContent.toLowerCase().includes(query);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("search") || params.get("q") || "";
  if (initialQuery) input.value = initialQuery;

  input.addEventListener("input", filterItems);
  filterItems();
})();

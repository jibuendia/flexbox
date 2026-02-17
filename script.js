const gallery = document.querySelector("#gallery");
const cards = Array.from(document.querySelectorAll(".card"));

const STORAGE_KEYS = {
  liked: "murcia-liked-cards",
  visited: "murcia-visited-cards"
};

const likedIds = new Set(readArray(STORAGE_KEYS.liked));
const visitedIds = new Set(readArray(STORAGE_KEYS.visited));

hydrateStates();
bindEvents();
reorderCards();

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeArray(key, values) {
  localStorage.setItem(key, JSON.stringify([...values]));
}

function hydrateStates() {
  cards.forEach((card) => {
    const id = card.dataset.id;
    const likeBtn = card.querySelector(".like-btn");
    const likeIcon = likeBtn?.querySelector("span");
    const visitBtn = card.querySelector(".visit-btn");

    if (likedIds.has(id) && likeBtn && likeIcon) {
      likeBtn.classList.add("is-liked");
      likeIcon.textContent = "♥";
    }

    if (visitedIds.has(id) && visitBtn) {
      card.classList.add("is-visited");
      visitBtn.textContent = "Visitado";
    }
  });
}

function bindEvents() {
  gallery?.addEventListener("click", (event) => {
    const likeBtn = event.target.closest(".like-btn");
    if (likeBtn) {
      handleLikeToggle(likeBtn);
      return;
    }

    const visitBtn = event.target.closest(".visit-btn");
    if (visitBtn) {
      handleVisitToggle(visitBtn);
    }
  });
}

function handleLikeToggle(button) {
  const card = button.closest(".card");
  if (!card) return;

  const id = card.dataset.id;
  const icon = button.querySelector("span");
  const isLiked = button.classList.toggle("is-liked");

  if (icon) {
    icon.textContent = isLiked ? "♥" : "♡";
  }

  if (isLiked) {
    likedIds.add(id);
  } else {
    likedIds.delete(id);
  }

  writeArray(STORAGE_KEYS.liked, likedIds);
  reorderCards();
}

function handleVisitToggle(button) {
  const card = button.closest(".card");
  if (!card) return;

  const id = card.dataset.id;
  const isVisited = card.classList.toggle("is-visited");
  button.textContent = isVisited ? "Visitado" : "Marcar visita";

  if (isVisited) {
    visitedIds.add(id);
  } else {
    visitedIds.delete(id);
  }

  writeArray(STORAGE_KEYS.visited, visitedIds);
}

function reorderCards() {
  const ordered = [...cards].sort((a, b) => {
    const aLiked = likedIds.has(a.dataset.id) ? 1 : 0;
    const bLiked = likedIds.has(b.dataset.id) ? 1 : 0;

    if (aLiked !== bLiked) return bLiked - aLiked;
    return Number(a.dataset.order) - Number(b.dataset.order);
  });

  ordered.forEach((card) => gallery?.appendChild(card));
}

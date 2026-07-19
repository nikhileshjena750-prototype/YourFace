const loginForm = document.getElementById("loginForm");
const successModal = document.getElementById("successModal");
const errorModal = document.getElementById("errorModal");
const closeError = document.getElementById("closeError");
const holdButton = document.getElementById("holdButton");
const progressText = document.getElementById("progressText");
const mainExperience = document.getElementById("mainExperience");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const photoCards = document.querySelectorAll(".photo-card");

const goddessAddressInput = document.getElementById("goddessAddress");
const addressHint = document.getElementById("addressHint");

function updateAddressHint() {
  const hasText = goddessAddressInput.value.length > 0;
  addressHint.classList.toggle("show", hasText);
}

goddessAddressInput.addEventListener("input", updateAddressHint);

const expected = {
  goddessName: "APSARA",
  goddessAddress: "PURI",
  relationship: "HISWORLD"
};

function normalize(value) {
  return value.trim().toUpperCase();
}

function showModal(modal) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal(modal) {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    goddessName: normalize(document.getElementById("goddessName").value),
    goddessAddress: normalize(document.getElementById("goddessAddress").value),
    relationship: normalize(document.getElementById("relationship").value)
  };

  const valid =
    values.goddessName === expected.goddessName &&
    values.goddessAddress === expected.goddessAddress &&
    values.relationship === expected.relationship;

  if (valid) {
    showModal(successModal);
  } else {
    showModal(errorModal);
  }
});

closeError.addEventListener("click", () => {
  hideModal(errorModal);
});

errorModal.addEventListener("click", (event) => {
  if (event.target === errorModal) {
    hideModal(errorModal);
  }
});

let holdStart = null;
let rafId = null;
let holding = false;
const holdDuration = 3000;

function resetHold() {
  holding = false;
  holdStart = null;
  cancelAnimationFrame(rafId);
  holdButton.style.setProperty("--progress", 0);
  progressText.textContent = "0%";
}

function completeHold() {
  holding = false;
  cancelAnimationFrame(rafId);
  holdButton.style.setProperty("--progress", 100);
  progressText.textContent = "100%";

  setTimeout(() => {
    hideModal(successModal);
    mainExperience.classList.add("show");
    mainExperience.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    mainExperience.scrollTop = 0;
  }, 350);
}

function animateHold(timestamp) {
  if (!holding) return;

  if (!holdStart) holdStart = timestamp;

  const elapsed = timestamp - holdStart;
  const progress = Math.min((elapsed / holdDuration) * 100, 100);

  holdButton.style.setProperty("--progress", progress);
  progressText.textContent = `${Math.floor(progress)}%`;

  if (progress >= 100) {
    completeHold();
    return;
  }

  rafId = requestAnimationFrame(animateHold);
}

function startHold(event) {
  event.preventDefault();
  if (holding) return;
  holding = true;
  holdStart = null;
  rafId = requestAnimationFrame(animateHold);
}

function stopHold(event) {
  if (event) event.preventDefault();
  if (!holding) return;
  resetHold();
}

holdButton.addEventListener("pointerdown", startHold);
holdButton.addEventListener("pointerup", stopHold);
holdButton.addEventListener("pointerleave", stopHold);
holdButton.addEventListener("pointercancel", stopHold);
holdButton.addEventListener("contextmenu", (event) => event.preventDefault());

const chapters = Array.from(document.querySelectorAll(".chapter"));
let currentChapter = 0;
let chapterTransitioning = false;

function showChapter(targetIndex, direction) {
  if (
    chapterTransitioning ||
    targetIndex < 0 ||
    targetIndex >= chapters.length ||
    targetIndex === currentChapter
  ) {
    return;
  }

  chapterTransitioning = true;

  const current = chapters[currentChapter];
  const target = chapters[targetIndex];

  current.classList.remove("active");
  current.classList.add(
    direction === "next" ? "leaving-left" : "leaving-right"
  );

  setTimeout(() => {
    current.classList.remove("leaving-left", "leaving-right");
    current.setAttribute("aria-hidden", "true");

    target.classList.add("active");
    target.setAttribute("aria-hidden", "false");

    currentChapter = targetIndex;

    mainExperience.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      chapterTransitioning = false;
    }, 760);
  }, 420);
}

document.querySelectorAll(".next-chapter").forEach((button) => {
  button.addEventListener("click", () => {
    showChapter(currentChapter + 1, "next");
  });
});

document.querySelectorAll(".previous-chapter").forEach((button) => {
  button.addEventListener("click", () => {
    showChapter(currentChapter - 1, "previous");
  });
});

photoCards.forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");

    lightboxImage.src = image.src;

    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    lightboxImage.src = "";
  }, 300);
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    lightbox.classList.contains("show")
  ) {
    closeLightbox();
  }
});
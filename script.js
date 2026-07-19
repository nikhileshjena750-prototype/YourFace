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
    goddessName: normalize(
      document.getElementById("goddessName").value
    ),
    goddessAddress: normalize(
      document.getElementById("goddessAddress").value
    ),
    relationship: normalize(
      document.getElementById("relationship").value
    )
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

  // Begin the soundtrack only after the heart reaches 100%.
  startMusicExperience();

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

  if (!holdStart) {
    holdStart = timestamp;
  }

  const elapsed = timestamp - holdStart;
  const progress = Math.min(
    (elapsed / holdDuration) * 100,
    100
  );

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
  if (event) {
    event.preventDefault();
  }

  if (!holding) return;

  resetHold();
}

holdButton.addEventListener("pointerdown", startHold);
holdButton.addEventListener("pointerup", stopHold);
holdButton.addEventListener("pointerleave", stopHold);
holdButton.addEventListener("pointercancel", stopHold);

holdButton.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const chapters = Array.from(
  document.querySelectorAll(".chapter")
);

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
    direction === "next"
      ? "leaving-left"
      : "leaving-right"
  );

  setTimeout(() => {
    current.classList.remove(
      "leaving-left",
      "leaving-right"
    );

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

document
  .querySelectorAll(".next-chapter")
  .forEach((button) => {
    button.addEventListener("click", () => {
      showChapter(currentChapter + 1, "next");
    });
  });

document
  .querySelectorAll(".previous-chapter")
  .forEach((button) => {
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

lightboxClose.addEventListener(
  "click",
  closeLightbox
);

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

const loveEnvelope =
  document.getElementById("loveEnvelope");

const specialNoteContent =
  document.getElementById("specialNoteContent");

const specialNoteClose =
  document.getElementById("specialNoteClose");

function openSpecialNote() {
  loveEnvelope.classList.add("is-open");

  loveEnvelope.setAttribute(
    "aria-expanded",
    "true"
  );

  loveEnvelope.setAttribute(
    "aria-label",
    "Close SPECIAL NOTE"
  );

  specialNoteContent.classList.add("show");

  specialNoteContent.setAttribute(
    "aria-hidden",
    "false"
  );
}

function closeSpecialNote() {
  loveEnvelope.classList.remove("is-open");

  loveEnvelope.setAttribute(
    "aria-expanded",
    "false"
  );

  loveEnvelope.setAttribute(
    "aria-label",
    "Open SPECIAL NOTE"
  );

  specialNoteContent.classList.remove("show");

  specialNoteContent.setAttribute(
    "aria-hidden",
    "true"
  );
}

loveEnvelope.addEventListener("click", () => {
  const isOpen =
    loveEnvelope.getAttribute("aria-expanded") ===
    "true";

  if (isOpen) {
    closeSpecialNote();
  } else {
    openSpecialNote();
  }
});

specialNoteClose.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    closeSpecialNote();
    loveEnvelope.focus();
  }
);


/*====================================================
MUSIC PLAYER
Version: 1.0
====================================================*/

const bgMusic = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const restartMusicButton =
  document.getElementById("restartMusic");
const playPauseMusicButton =
  document.getElementById("playPauseMusic");
const musicProgress =
  document.getElementById("musicProgress");

const MUSIC_FADE_DURATION = 3000;
const MUSIC_PLAYER_SHOW_DELAY = 2200;
const MUSIC_IDLE_DELAY = 5000;

let musicFadeAnimation = null;
let musicIdleTimer = null;
let musicHasStarted = false;
let musicIsSeeking = false;
let audioUnlocked = false;

bgMusic.loop = true;
bgMusic.volume = 0;

musicProgress.min = "0";
musicProgress.max = "1000";
musicProgress.value = "0";

restartMusicButton.setAttribute(
  "aria-label",
  "Restart music"
);

playPauseMusicButton.setAttribute(
  "aria-label",
  "Pause music"
);

/*
Unlock the audio during the initial heart interaction.

Some browsers restrict audio unless it has first been activated
through a direct click or touch. This prepares the audio without
allowing the song to become audible before the heart reaches 100%.
*/
async function unlockBackgroundMusic() {
  if (audioUnlocked) {
    return;
  }

  try {
    bgMusic.volume = 0;

    await bgMusic.play();

    bgMusic.pause();
    bgMusic.currentTime = 0;

    audioUnlocked = true;
  } catch (error) {
    /*
    Playback will be attempted again when the heart reaches 100%.
    No visible error is needed because browser behaviour differs.
    */
  }
}

holdButton.addEventListener(
  "pointerdown",
  unlockBackgroundMusic,
  { once: true }
);

/*
Smoothly increase the music from silence to its full media volume.

The final loudness is still controlled by the device's own volume.
*/
function fadeInBackgroundMusic() {
  cancelAnimationFrame(musicFadeAnimation);

  const fadeStartTime = performance.now();
  const initialVolume = bgMusic.volume;

  function updateMusicVolume(timestamp) {
    const elapsed = timestamp - fadeStartTime;

    const fadeProgress = Math.min(
      elapsed / MUSIC_FADE_DURATION,
      1
    );

    bgMusic.volume =
      initialVolume +
      (1 - initialVolume) * fadeProgress;

    if (fadeProgress < 1) {
      musicFadeAnimation =
        requestAnimationFrame(updateMusicVolume);
    } else {
      bgMusic.volume = 1;
      musicFadeAnimation = null;
    }
  }

  musicFadeAnimation =
    requestAnimationFrame(updateMusicVolume);
}

/*
Start the soundtrack after the completed heart hold.
*/
async function startMusicExperience() {
  if (musicHasStarted) {
    return;
  }

  musicHasStarted = true;
  bgMusic.currentTime = 0;
  bgMusic.volume = 0;

  try {
    await bgMusic.play();

    setPlayPauseState(true);
    fadeInBackgroundMusic();

    setTimeout(() => {
      musicPlayer.classList.add("show");
      wakeMusicPlayer();
    }, MUSIC_PLAYER_SHOW_DELAY);
  } catch (error) {
    /*
    If a browser still blocks playback, show the controller.
    Pressing Play will begin the music through a direct interaction.
    */
    setPlayPauseState(false);

    setTimeout(() => {
      musicPlayer.classList.add("show");
      wakeMusicPlayer();
    }, MUSIC_PLAYER_SHOW_DELAY);
  }
}

/*
Keep the Play/Pause icon and accessibility label accurate.
*/
function setPlayPauseState(isPlaying) {
  if (isPlaying) {
    playPauseMusicButton.textContent = "❚❚";
    playPauseMusicButton.title = "Pause";
    playPauseMusicButton.setAttribute(
      "aria-label",
      "Pause music"
    );
  } else {
    playPauseMusicButton.textContent = "▶";
    playPauseMusicButton.title = "Play";
    playPauseMusicButton.setAttribute(
      "aria-label",
      "Play music"
    );
  }
}

/*
Play or pause without resetting the current position.
*/
async function toggleMusicPlayback() {
  wakeMusicPlayer();

  if (bgMusic.paused) {
    try {
      await bgMusic.play();

      setPlayPauseState(true);

      /*
      Only use the long fade when playback has not yet become audible.
      Resuming an ordinary pause should feel immediate.
      */
      if (bgMusic.volume === 0) {
        fadeInBackgroundMusic();
      }
    } catch (error) {
      setPlayPauseState(false);
    }
  } else {
    cancelAnimationFrame(musicFadeAnimation);
    musicFadeAnimation = null;

    bgMusic.pause();
    setPlayPauseState(false);
  }
}

/*
Restart the single soundtrack from 0:00.

Restarting also begins playback when the song was paused.
*/
async function restartBackgroundMusic() {
  wakeMusicPlayer();

  cancelAnimationFrame(musicFadeAnimation);
  musicFadeAnimation = null;

  bgMusic.currentTime = 0;
  musicProgress.value = "0";

  try {
    await bgMusic.play();
    setPlayPauseState(true);
  } catch (error) {
    setPlayPauseState(false);
  }
}

/*
Update the progress bar while the soundtrack plays.
*/
function updateMusicProgress() {
  if (
    musicIsSeeking ||
    !Number.isFinite(bgMusic.duration) ||
    bgMusic.duration <= 0
  ) {
    return;
  }

  const progress =
    (bgMusic.currentTime / bgMusic.duration) * 1000;

  musicProgress.value = String(progress);
}

/*
Move forward or backward when the progress bar is used.
*/
function seekBackgroundMusic() {
  if (
    !Number.isFinite(bgMusic.duration) ||
    bgMusic.duration <= 0
  ) {
    return;
  }

  const requestedProgress =
    Number(musicProgress.value) / 1000;

  bgMusic.currentTime =
    requestedProgress * bgMusic.duration;
}

/*
Restore full controller visibility during interaction,
then soften it again after inactivity.
*/
function wakeMusicPlayer() {
  if (!musicPlayer.classList.contains("show")) {
    return;
  }

  musicPlayer.classList.remove("idle");

  clearTimeout(musicIdleTimer);

  musicIdleTimer = setTimeout(() => {
    musicPlayer.classList.add("idle");
  }, MUSIC_IDLE_DELAY);
}

playPauseMusicButton.addEventListener(
  "click",
  toggleMusicPlayback
);

restartMusicButton.addEventListener(
  "click",
  restartBackgroundMusic
);

bgMusic.addEventListener(
  "timeupdate",
  updateMusicProgress
);

bgMusic.addEventListener("play", () => {
  setPlayPauseState(true);
});

bgMusic.addEventListener("pause", () => {
  setPlayPauseState(false);
});

bgMusic.addEventListener("loadedmetadata", () => {
  updateMusicProgress();
});

bgMusic.addEventListener("ended", () => {
  /*
  The audio is already configured to loop, but this provides
  a safe fallback for browsers with inconsistent loop behaviour.
  */
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {
    setPlayPauseState(false);
  });
});

musicProgress.addEventListener(
  "pointerdown",
  () => {
    musicIsSeeking = true;
    wakeMusicPlayer();
  }
);

musicProgress.addEventListener(
  "input",
  () => {
    seekBackgroundMusic();
    wakeMusicPlayer();
  }
);

musicProgress.addEventListener(
  "change",
  () => {
    seekBackgroundMusic();
    musicIsSeeking = false;
    wakeMusicPlayer();
  }
);

musicProgress.addEventListener(
  "pointerup",
  () => {
    seekBackgroundMusic();
    musicIsSeeking = false;
    wakeMusicPlayer();
  }
);

musicProgress.addEventListener(
  "pointercancel",
  () => {
    musicIsSeeking = false;
  }
);

/*
Wake the controller whenever the visitor interacts with the story.
*/
document.addEventListener(
  "pointerdown",
  wakeMusicPlayer,
  { passive: true }
);

document.addEventListener(
  "mousemove",
  wakeMusicPlayer,
  { passive: true }
);

document.addEventListener(
  "keydown",
  wakeMusicPlayer
);
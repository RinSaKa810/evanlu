const envelope = document.querySelector('.envelope');
const overlay = document.querySelector('.letter-overlay');
const letterCard = document.querySelector('.letter-card');
const musicToggle = document.querySelector('.music-toggle');
const volumeSlider = document.querySelector('.volume-slider');
const musicAudio = document.querySelector('#music-audio');
const MUSIC = 'bgmm.mp3'; 
const OPEN_SOUND_URL = 'open-sound.mp3';
const openSound = new Audio(OPEN_SOUND_URL);
openSound.preload = 'auto';
openSound.volume = 0.8;

function playOpenSound() {
  openSound.currentTime = 0;
  openSound.play().catch(() => {});
}

// Detect if device supports hover (non-touch)
const isTouchDevice = () => {
  return (
    (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
  );
};

const supportsHover = !isTouchDevice();

function openLetter() {
  overlay.classList.add('open');
  envelope.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  envelope.setAttribute('aria-expanded', 'true');
  document.body.classList.add('letter-open');
  setMusicState(true);
}

function closeLetter() {
  overlay.classList.remove('open');
  envelope.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  envelope.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('letter-open');
}

function toggleLetter() {
  const isOpen = overlay.classList.contains('open');
  if (isOpen) {
    closeLetter();
  } else {
    openLetter();
  }
}

function handlePointerMove(event) {
  if (!supportsHover || !envelope || overlay.classList.contains('open')) {
    envelope?.classList.remove('proximity-hover');
    envelope && (envelope.style.transform = '');
    return;
  }

  const rect = envelope.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
  const proximity = Math.max(0, 1 - distance / 220);

  if (proximity > 0.18) {
    envelope.classList.add('proximity-hover');
    envelope.style.transform = `translate(${(event.clientX - centerX) * 0.02}px, ${(event.clientY - centerY) * 0.02}px) scale(1.035)`;
  } else {
    envelope.classList.remove('proximity-hover');
    envelope.style.transform = '';
  }
}

function setMusicState(enabled) {
  if (!musicToggle || !musicAudio) return;

  musicToggle.classList.toggle('active', enabled);
  musicToggle.setAttribute('aria-pressed', String(enabled));
  musicToggle.setAttribute('aria-label', enabled ? 'Turn off background music' : 'Turn on background music');

  if (enabled) {
    musicAudio.src = MUSIC;
    musicAudio.play().catch(err => console.log('Autoplay prevented:', err));
  } else {
    musicAudio.pause();
  }
}

envelope?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleLetter();
});

letterCard?.addEventListener('click', (event) => {
  event.stopPropagation();
});

overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closeLetter();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLetter();
  }
});

musicToggle?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  const isEnabled = musicToggle.classList.contains('active');
  setMusicState(!isEnabled);
});

// Only add pointer move listener on devices with hover support
if (supportsHover) {
  document.addEventListener('pointermove', handlePointerMove);
}

volumeSlider?.addEventListener('input', (event) => {
  const volume = Number(event.target.value);
  if (musicAudio) {
    musicAudio.volume = volume / 100;
  }
});

document.addEventListener('mousemove', handlePointerMove);
setMusicState(false);

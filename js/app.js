/**
 * BlackHole Music Player - Core Application Logic & Real Versions Database
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initVersionTabs();
  initFAQAccordion();
  initDownloadModal();
  initCopyHash();
  initCounters();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect & ScrollSpy
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Real Versions & Architecture Database
   -------------------------------------------------------------------------- */
const VERSION_DATA = {
  "v1.15.10": {
    name: "blackhole-1-15-10.apk",
    version: "v1.15.10 (Latest Stable)",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "12.0 MB",
    hash: "03192285eac5e106d3e10d1b20b67f45c431b9f4ff94ee7683698c862f6d386a",
    desc: "Latest stable production release with all core bug fixes, 320kbps audio streaming, synced lyrics, and universal compatibility.",
    downloadUrl: "assets/downloads/blackhole-1-15-10.apk",
    badge: "Latest Release"
  },
  "v1.15.9": {
    name: "blackhole-1-15-9.apk",
    version: "v1.15.9",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "11.6 MB",
    hash: "c0cc5ba4648bd4882415252fa9fb756cf78831e7c167214ce4a6b974715eae2b",
    desc: "Stable build featuring enhanced Spotify playlist parser and memory optimizations.",
    downloadUrl: "assets/downloads/blackhole-1-15-9.apk",
    badge: "Stable"
  },
  "v1.15.8": {
    name: "blackhole-1-15-8.apk",
    version: "v1.15.8",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "11.4 MB",
    hash: "f657935ef0dc7e08b7307d71f7cc25d027d81b89ebc22af76e9fc6515d7a4c57",
    desc: "Improved audio buffer management and battery optimization for long playback sessions.",
    downloadUrl: "assets/downloads/blackhole-1-15-8.apk",
    badge: "Stable"
  },
  "v1.15.7": {
    name: "blackhole-1-15-7.apk",
    version: "v1.15.7",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "10.8 MB",
    hash: "a28e7488c20127284f181180d59c49af09fa8f1224ca88c1fa258d776c7079a5",
    desc: "Lightweight build with fast startup time and refined Material You player themes.",
    downloadUrl: "assets/downloads/blackhole-1-15-7.apk",
    badge: "Archive"
  },
  "v1.15.6": {
    name: "blackhole-1-15-6.apk",
    version: "v1.15.6",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "10.5 MB",
    hash: "88576f83eb11b72bfbc350eb751ce669a5049fb02e10f978db3d8a964bb2cd9c",
    desc: "Legacy version with stable YouTube Music endpoint compatibility.",
    downloadUrl: "assets/downloads/blackhole-1-15-6.apk",
    badge: "Archive"
  },
  "v1.15.5": {
    name: "blackhole-1-15-5.apk",
    version: "v1.15.5",
    minAndroid: "Android 5.0 (Lollipop) or newer",
    size: "10.5 MB",
    hash: "0b4158a3dd5c76aa03eee1c892410bb8aafa89432fde737a2e7ef43f189e804a",
    desc: "Initial stable v1.15 series release with full equalizer and offline storage.",
    downloadUrl: "assets/downloads/blackhole-1-15-5.apk",
    badge: "Archive"
  }
};

let currentSelectedVersion = 'v1.15.10';

function initVersionTabs() {
  const tabButtons = document.querySelectorAll('.arch-tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const verKey = btn.getAttribute('data-ver');
      currentSelectedVersion = verKey;
      updateDownloadInfo(verKey);
    });
  });
}

function updateDownloadInfo(key) {
  const data = VERSION_DATA[key] || VERSION_DATA['v1.15.10'];

  const fileNameEl = document.getElementById('infoFileName');
  const fileVerEl = document.getElementById('infoFileArch');
  const fileMinEl = document.getElementById('infoFileMin');
  const fileSizeEl = document.getElementById('infoFileSize');
  const fileHashEl = document.getElementById('infoFileHash');
  const fileDescEl = document.getElementById('infoFileDesc');
  const targetBadgeEl = document.getElementById('infoTargetBadge');

  if (fileNameEl) fileNameEl.textContent = data.name;
  if (fileVerEl) fileVerEl.textContent = data.version;
  if (fileMinEl) fileMinEl.textContent = data.minAndroid;
  if (fileSizeEl) fileSizeEl.textContent = data.size;
  if (fileHashEl) fileHashEl.textContent = data.hash;
  if (fileDescEl) fileDescEl.textContent = data.desc;
  if (targetBadgeEl) targetBadgeEl.textContent = data.badge;
}

/* --------------------------------------------------------------------------
   4. Copy Hash to Clipboard
   -------------------------------------------------------------------------- */
function initCopyHash() {
  const copyBtn = document.getElementById('copyHashBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const hashEl = document.getElementById('infoFileHash');
    if (!hashEl) return;

    navigator.clipboard.writeText(hashEl.textContent.trim()).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span>Copied! ✓</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Download Modal with Countdown
   -------------------------------------------------------------------------- */
function initDownloadModal() {
  const modalBackdrop = document.getElementById('downloadModal');
  const triggerBtns = document.querySelectorAll('.trigger-download-modal');
  const closeBtn = document.getElementById('closeModalBtn');
  const countdownEl = document.getElementById('modalCountdown');
  const modalFileNameEl = document.getElementById('modalFileName');
  const modalDirectLink = document.getElementById('modalDirectLink');

  if (!modalBackdrop) return;

  let countdownInterval = null;

  function openModal(specificVer) {
    const verKey = specificVer || currentSelectedVersion;
    const data = VERSION_DATA[verKey] || VERSION_DATA['v1.15.10'];

    if (modalFileNameEl) modalFileNameEl.textContent = data.name;
    if (modalDirectLink) {
      modalDirectLink.setAttribute('href', data.downloadUrl);
      modalDirectLink.setAttribute('download', data.name);
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    let count = 3;
    if (countdownEl) countdownEl.textContent = count;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      count--;
      if (countdownEl) countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(countdownInterval);
        if (countdownEl) countdownEl.textContent = "Ready!";
        if (modalDirectLink) {
          modalDirectLink.click();
        }
      }
    }, 1000);
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    clearInterval(countdownInterval);
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const specificVer = btn.getAttribute('data-ver');
      openModal(specificVer);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Animated Stats Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-val[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1800;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const counter = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(counter);
          } else {
            el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

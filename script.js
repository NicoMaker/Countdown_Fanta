// Carica la configurazione dal file JSON
async function loadConfig() {
  try {
    const response = await fetch("config.json");
    const config = await response.json();
    initializeCountdown(config);
  } catch (error) {
    console.error("Errore nel caricamento della configurazione:", error);
    // Fallback configuration in caso di errore
    const fallbackConfig = {
      auctionTitle: "Asta di Riparazione",
      auctionSubtitle: "Fantacalcio Fantamaster",
      auctionDate: "2024-12-30",
      auctionTime: "15:00",
      celebrationTitle: "Buon Asta a Tutti!",
      celebrationText: "L'asta è iniziata!",
      celebrationEmoji: "Che vinca il migliore! 🏆⚽",
      footerText: "Fantamaster - Asta di Riparazione",
    };
    initializeCountdown(fallbackConfig);
  }
}

function initializeCountdown(config) {
  // Imposta i testi dalla configurazione
  document.getElementById("auction-title").textContent = config.auctionTitle;
  document.getElementById("auction-subtitle").textContent =
    config.auctionSubtitle;
  document.getElementById("celebration-title").textContent =
    config.celebrationTitle;
  document.getElementById("celebration-text").textContent =
    config.celebrationText;
  document.getElementById("celebration-emoji").textContent =
    config.celebrationEmoji;
  document.getElementById("footer-text").textContent = config.footerText;

  // Set current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  document.getElementById("current-year").textContent = currentYear;

  // Parse auction date and time from config
  const [year, month, day] = config.auctionDate.split("-").map(Number);
  const [hours, minutes] = config.auctionTime.split(":").map(Number);

  // Create auction date object
  let auctionDate = new Date(year, month - 1, day, hours, minutes, 0);

  // If auction date has passed, set it for next year
  if (currentDate > auctionDate) {
    auctionDate = new Date(year + 1, month - 1, day, hours, minutes, 0);
  }

  // Format and display date
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = auctionDate.toLocaleDateString("it-IT", dateOptions);
  document.getElementById("auction-date").textContent = formattedDate;
  document.getElementById("auction-time").textContent = config.auctionTime;

  const auctionTimestamp = auctionDate.getTime();

  // Update countdown every second
  const timerInterval = setInterval(
    () => updateCountdown(auctionTimestamp, timerInterval),
    1000
  );
  updateCountdown(auctionTimestamp, timerInterval); // Initial call
}

function updateCountdown(auctionTimestamp, timerInterval) {
  const now = new Date().getTime();
  const distance = auctionTimestamp - now;

  // If countdown is finished
  if (distance < 0) {
    clearInterval(timerInterval);
    document.querySelector(".countdown-wrapper").style.display = "none";
    document.querySelector(".celebration-message").style.display = "block";
    return;
  }

  // Calculate time units
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update DOM
  document.getElementById("days").textContent = formatTime(days);
  document.getElementById("hours").textContent = formatTime(hours);
  document.getElementById("minutes").textContent = formatTime(minutes);
  document.getElementById("seconds").textContent = formatTime(seconds);

  // Pulse animation on seconds
  const secondsElement = document.getElementById("seconds");
  secondsElement.classList.add("pulse");
  setTimeout(() => {
    secondsElement.classList.remove("pulse");
  }, 900);
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

function createBackground() {
  const container = document.getElementById("background-animation");
  const ballCount = Math.floor(window.innerWidth / 50);

  for (let i = 0; i < ballCount; i++) {
    createBall(container);
  }
}

function createBall(container) {
  const ball = document.createElement("div");
  ball.className = "ball";

  const left = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 10;
  const size = Math.random() * 30 + 20;

  ball.style.cssText = `
          left: ${left}%;
          width: ${size}px;
          height: ${size}px;
          animation-duration: ${duration}s;
          animation-delay: -${delay}s;
        `;

  container.appendChild(ball);

  setTimeout(() => {
    ball.remove();
    createBall(container);
  }, duration * 1000);
}

// Inizializza l'applicazione
document.addEventListener("DOMContentLoaded", () => {
  // Carica la configurazione
  loadConfig();

  // Create animated background
  createBackground();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", toggleTheme);

  // Check for saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
});

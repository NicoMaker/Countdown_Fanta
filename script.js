document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  document.getElementById("current-year").textContent = currentYear;

  // Set auction date: December 30 at 15:00
  let auctionYear = currentYear;
  const testDate = new Date(`Dec 30, ${currentYear} 15:00:00`);

  // If auction date has passed this year, set it for next year
  if (currentDate > testDate) {
    auctionYear = currentYear + 1;
  }

  // Update auction year in the info box
  document.getElementById("auction-year").textContent = auctionYear;

  const auctionDate = new Date(`Dec 30, ${auctionYear} 15:00:00`).getTime();

  // Update countdown every second
  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call

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

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = auctionDate - now;

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
});
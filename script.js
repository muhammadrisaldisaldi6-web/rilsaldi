const cardGrid = document.querySelector('.card-grid');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

let score = 0;
let time = 60;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = null;
let gameStarted = false;
let level = 1;

// daftar gambar (tetap urut)
const allImages = [
  'DriftMaster.jpg', 'MuscleOutlaw.jpg', 'StreetKing.jpg', 'TorqueLegend.jpg', 'AmericanClassic.jpg', 'BlueLighting.jpg',
  'GreenMachine.jpg', 'HyperDrift.jpg', 'PinkFlaminggo.jpg', 'RallyLegend.jpg', 'SpeedDemon.jpg', 'SupraKing.jpg'
];

// overlay elemen
const overlay = document.createElement('div');
overlay.classList.add('overlay');
overlay.innerHTML = `
  <div class="overlay-content">
    <h1 id="overlayText"></h1>
    <button id="playAgainBtn">Main Lagi</button>
  </div>
`;
document.body.appendChild(overlay);

const overlayText = document.getElementById('overlayText');
const playAgainBtn = document.getElementById('playAgainBtn');

// mulai level
function startLevel() {
  resetGame();

  // jumlah pasangan kartu sesuai level (level1:4, level2:5, ... max 12)
  const pairs = Math.min(4 + (level - 1), 12);

  // ambil gambar dari daftar (URUT, bukan random)
  const selectedImages = allImages.slice(0, pairs);

  // atur waktu
  time = Math.max(60 - (level - 1) * 10, 30);
  timeElement.textContent = `Waktu: ${time} detik`;

  // buat semua kartu (dua kartu per gambar), push ke array cards
  selectedImages.forEach((img, index) => {
    for (let i = 0; i < 2; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.pair = index;

      const front = document.createElement('div');
      front.classList.add('front');

      const back = document.createElement('div');
      back.classList.add('back');
      back.style.backgroundImage = `url('Card/${img}')`;

      card.appendChild(front);
      card.appendChild(back);

      cards.push(card); // <-- belum di-append ke DOM
    }
  });

  // **acak posisi kartu** agar pasangan tidak selalu bersebelahan
  cards = shuffle(cards);

  // lalu append kartu yang sudah diacak ke grid
  cards.forEach(card => {
    cardGrid.appendChild(card);
    card.addEventListener('click', flipCard);
  });

  gameStarted = false;
}

// reset game
function resetGame() {
  clearInterval(timer);
  cardGrid.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  gameStarted = false;
  overlay.style.display = 'none';
}

// flip kartu
function flipCard() {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 800);
    }
  }
}

// cek kecocokan
function checkMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  if (card1.dataset.pair === card2.dataset.pair) {
    score++;
    matchedPairs++;
    scoreElement.textContent = `Skor: ${score}`;

    setTimeout(() => {
      card1.style.visibility = 'hidden';
      card2.style.visibility = 'hidden';
    }, 400);

    if (matchedPairs === cards.length / 2) {
      clearInterval(timer);
      if (level === 5) {
        showOverlay("🎉 YOU WIN! 🎉");
      } else {
        setTimeout(() => {
          alert(`🎉 Level ${level} Selesai! 🎉`);
          level++;
          startLevel();
        }, 500);
      }
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

// acak array (Fisher–Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeElement.textContent = `Waktu: ${time} detik`;

    if (time === 0) {
      clearInterval(timer);
      showOverlay("⏰ GAME OVER ⏰");
    }
  }, 1000);
}

// tampilkan overlay
function showOverlay(message) {
  overlayText.textContent = message;
  overlay.style.display = 'flex';
  scoreElement.textContent = `Skor: ${score}`;
}

// tombol main lagi
playAgainBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  score = 0;
  level = 1;
  scoreElement.textContent = `Skor: ${score}`;
  startLevel();
});

// tombol reset (jika ada elemen #resetBtn di HTML)
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    score = 0;
    level = 1;
    scoreElement.textContent = `Skor: ${score}`;
    startLevel();
  });
}

window.addEventListener("load", () => {
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = 0.4;

    // Baru main setelah user klik/tap di halaman
    document.body.addEventListener("click", () => {
      bgMusic.play();
      console.log("Musik dimulai setelah interaksi pengguna");
    }, { once: true });
  });
// mulai game
startLevel();

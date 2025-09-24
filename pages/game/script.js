const icons = [
  "./../../image/game/bus-01.png",
  "./../../image/game/CO2-01.png",
  "./../../image/game/daun-01.png",
  "./../../image/game/kereta2-01.png",
  "./../../image/game/lampu3-01.png",
  "./../../image/game/mobil2-01.png",
  "./../../image/game/motor2-01.png",
  "./../../image/game/pohon-01.png",
  "./../../image/game/sayuran3-01.png",
  "./../../image/game/sepeda2-01.png"
];

let cardIcons = [...icons, ...icons];
cardIcons = cardIcons.sort(() => Math.random() - 0.5);

const grid = document.querySelector('.grid');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timeoutId;

const winner = document.querySelector('.winner')
const timerStop = document.getElementById('timer-stop')
cardIcons.forEach(icon => {
  const card = document.createElement('div');
  card.className = "bg-green-100 border border-[#55C500] rounded-lg h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center cursor-pointer select-none shadow-inner";
  card.dataset.icon = icon;
  card.innerHTML = `
    <img src="./../../image/game/ask_.png" class="back h-12 lg:h-16">
    <img src="${icon}" class="front h-12 w-12 lg:h-16 lg:w-16 hidden">
  `;


  card.addEventListener('click', () => {
    if (lockBoard || card.classList.contains('matched') || card === firstCard) return;

    card.querySelector('.back').classList.add('hidden');
    card.querySelector('.front').classList.remove('hidden');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.icon === secondCard.dataset.icon) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      resetBoard();

      if (document.querySelectorAll('.matched').length == cardIcons.length) {
        setTimeout(() => {
          clearTimeout(timeoutId);
          const usedTime = totalTime - time;
          
          const minutes = String(Math.floor(usedTime / 60)).padStart(2, '0');
          const seconds = String(usedTime % 60).padStart(2, '0');
          winner.classList.remove('opacity-0', "-z-10");
          winner.classList.add('opacity-100', "z-20");
          timerStop.textContent = `${minutes}:${seconds}`;
        }, 500);
      }
    } else {
      setTimeout(() => {
        firstCard.querySelector('.back').classList.remove('hidden');
        firstCard.querySelector('.front').classList.add('hidden');

        secondCard.querySelector('.back').classList.remove('hidden');
        secondCard.querySelector('.front').classList.add('hidden');

        resetBoard();
      }, 800);
    }
  });

  grid.appendChild(card);
});

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

console.log(firstCard);

let time = 180;
const totalTime = time;
const loser = document.querySelector('.loser')

const timerDisplay = document.getElementById('timer');

function updateTimer() {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  if (time > 0) {
    time--;
    timeoutId = setTimeout(updateTimer, 1000);
  } else {
    loser.classList.remove('opacity-0', "-z-10");
    loser.classList.add('opacity-100', "z-20");
  }
}
updateTimer();

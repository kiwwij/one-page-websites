const lyrics = [
    { time: 5, text: "I wanna da-" }, 
    { time: 6.4, text: "I wanna dance in the lights" }, 
    { time: 9.2, text: "I wanna ro-" }, 
    { time: 10.4, text: "I wanna rock your body" }, 
    { time: 13.1, text: "I wanna go" }, 
    { time: 14.1, text: "I wanna go for a ride" }, 
    { time: 17, text: "Hop in the music and Rock your body" }, 
    { time: 20.5, text: "V rot ebali" }, 
    { time: 21.5, text: "Come on, come on v rot ebali" }, 
    { time: 23.4, text: "(Rock your body)" }, 
    { time: 24.4, text: "V rot ebali" }, 
    { time: 25.4, text: "Come on, come on" }, 
    { time: 26.3, text: "V rot-" }, 
    { time: 26.9, text: "e-" }, 
    { time: 27.4, text: "ba-" }, 
    { time: 27.77, text: "li" },
];

const song = document.getElementById('song');
const currentLineElement = document.getElementById('current-line');
let currentIndex = -1;

song.addEventListener('timeupdate', () => {
  const currentTime = song.currentTime;

  for (let i = 0; i < lyrics.length; i++) {
    const nextLine = lyrics[i + 1];
    if (
      currentTime >= lyrics[i].time &&
      (!nextLine || currentTime < nextLine.time)
    ) {
      if (currentIndex !== i) {
        currentIndex = i;
        showLine(lyrics[i].text);
      }
      break;
    }
  }
});

function showLine(text) {
  currentLineElement.classList.remove('show');
  setTimeout(() => {
    currentLineElement.textContent = text;
    currentLineElement.classList.add('show');
  }, 300);
}


const starsContainer = document.querySelector('.stars');
const numStars = 70; // кол-во звёзд

for (let i = 0; i < numStars; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 3}s`;
  starsContainer.appendChild(star);
}

function generateShortIcon() {
  const canvas = document.getElementById('iconCanvas');
  const ctx = canvas.getContext('2d');

  const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<3;i++){
    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height;
    const r = Math.random()*15 + 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  }

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = canvas.toDataURL('image/png');
  document.head.appendChild(link);
}
generateShortIcon();

function generateAvatar() {
  const canvas = document.getElementById('avatar');
  const ctx = canvas.getContext('2d');
  const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'];

  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<5;i++){
    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height;
    const r = Math.random()*20 + 10;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  }
}
generateAvatar();
// App logic with swipe gestures, Vercel API proxy, favorites
const API_ENDPOINT = '/api/games';
const card = document.getElementById('card');
const surpriseBtns = [document.getElementById('surprise'), document.getElementById('surpriseBottom')].filter(Boolean);
const favListEl = document.getElementById('favList');
const favoritesPanel = document.getElementById('favoritesPanel');
const menuBtn = document.getElementById('menuBtn');
const closeFav = document.getElementById('closeFav') || document.getElementById('menuBtn');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// render favorites
function renderFavorites(){
  favListEl.innerHTML = '';
  if(favorites.length === 0){
    document.querySelector('.fav-empty').style.display = 'block';
  } else {
    document.querySelector('.fav-empty').style.display = 'none';
  }
  favorites.forEach(g=>{
    const li = document.createElement('li');
    li.className = 'fav-item';
    li.innerHTML = `<img src="${g.thumbnail}" alt=""><div class="info"><div style="font-weight:600">${g.title}</div><div style="font-size:12px;color:#546">${g.platform}</div></div><button class="small-btn" data-id="${g.id}">Remove</button>`;
    favListEl.appendChild(li);
  });
  // attach remove handlers
  favListEl.querySelectorAll('button.small-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      const id = Number(b.getAttribute('data-id'));
      favorites = favorites.filter(x=>x.id !== id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
    });
  });
}
renderFavorites();

// fetch games via serverless api
async function fetchGames(){
  const res = await fetch(API_ENDPOINT);
  if(!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return data;
}

// render game card
function renderGame(g){
  card.innerHTML = '';
  const img = document.createElement('img');
  img.className = 'thumb';
  img.src = g.thumbnail;
  img.alt = g.title;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<div class="title">${g.title}</div><div class="desc">${g.short_description}</div><div class="platform">Platform: ${g.platform}</div>`;

  const controls = document.createElement('div');
  controls.style= 'display:flex;gap:8px;margin-top:8px';
  const play = document.createElement('a');
  play.href = g.game_url;
  play.target = '_blank';
  play.rel = 'noopener';
  play.className = 'surprise';
  play.textContent = '▶ Play';
  const fav = document.createElement('button');
  fav.className = 'surprise';
  fav.style.background = '#ffd166';
  fav.style.color = '#0b132b';
  fav.textContent = '⭐ Add';
  fav.addEventListener('click', ()=>{
    if(!favorites.some(x=>x.id===g.id)){
      favorites.unshift({id:g.id,title:g.title,thumbnail:g.thumbnail,platform:g.platform});
      favorites = favorites.slice(0,30);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
      openFavorites();
    }
  });

  controls.appendChild(play);
  controls.appendChild(fav);

  card.appendChild(img);
  card.appendChild(meta);
  card.appendChild(controls);
}

// show loading or error
function showMessage(msg){
  card.innerHTML = `<div class="placeholder"><div style="font-size:16px">${msg}</div></div>`;
}

// get random game and display
async function surprise(){
  try{
    showMessage('Loading…');
    const games = await fetchGames();
    const choice = games[Math.floor(Math.random()*games.length)];
    renderGame(choice);
  }catch(e){
    console.error(e);
    showMessage('Error loading game. Pull to retry or tap Surprise Me.');
  }
}

// swipe detection
let startX=0,startY=0;
card.addEventListener('touchstart', (e)=>{
  const t = e.touches[0];
  startX = t.clientX; startY = t.clientY;
});
card.addEventListener('touchend', (e)=>{
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  const absX = Math.abs(dx), absY=Math.abs(dy);
  const threshold = 50;
  if(absX > absY && absX > threshold){
    // left or right -> new surprise
    surprise();
  } else if(absY > absX && dy > threshold){
    // swipe down -> open favorites
    openFavorites();
  }
});

// open/close favorites
function openFavorites(){ favoritesPanel.classList.add('open'); favoritesPanel.setAttribute('aria-hidden','false') }
function closeFavorites(){ favoritesPanel.classList.remove('open'); favoritesPanel.setAttribute('aria-hidden','true') }

menuBtn.addEventListener('click', ()=>{ openFavorites(); });
document.getElementById('closeFav').addEventListener('click', ()=>{ closeFavorites(); });

// wire surprise buttons
surpriseBtns.forEach(b=>b.addEventListener('click', surprise));

// initial call
showMessage('Tap Surprise Me or swipe ← / → to begin');

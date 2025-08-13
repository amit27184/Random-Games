const gameArea = document.getElementById("gameArea");
const favoritesList = document.getElementById("favoritesList");
const API_URL = "https://www.freetogame.com/api/games";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Render Favorites
function renderFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach(game => {
    const li = document.createElement("li");
    li.textContent = game.title;
    favoritesList.appendChild(li);
  });
}
renderFavorites();

// Fetch Random Game
async function getRandomGame() {
  gameArea.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(API_URL);
    const games = await res.json();
    const randomGame = games[Math.floor(Math.random() * games.length)];
    renderGame(randomGame);
  } catch (err) {
    gameArea.innerHTML = "<p>Error loading game.</p>";
  }
}

// Render Game Card
function renderGame(game) {
  gameArea.innerHTML = `
    <div class="game-card">
      <img src="${game.thumbnail}" alt="${game.title}" />
      <h3>${game.title}</h3>
      <p>${game.short_description}</p>
      <p><small>Platform: ${game.platform}</small></p>
      <a href="${game.game_url}" target="_blank" class="play-btn">▶ Play Now</a>
      <button class="fav-btn">⭐ Add to Favorites</button>
    </div>
  `;

  document.querySelector(".fav-btn").addEventListener("click", () => {
    if (!favorites.some(fav => fav.id === game.id)) {
      favorites.push({ id: game.id, title: game.title });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    }
  });
}

// Button Event
document.getElementById("randomBtn").addEventListener("click", getRandomGame);
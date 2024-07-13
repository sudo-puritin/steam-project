var requestOptions = {
  method: "GET",
  redirect: "follow",
};

const rightWrapper = document.querySelector(".rightWrapper");
const bestGameWrapper = document.querySelector(".bestGameWrapper");
const genresList = document.querySelector(".genresList");
const listBestGame = document.querySelector(".listBestGame");
const trendingTitle = document.querySelector(".trendingTitle");
const contentRightSider = document.querySelector(".contentRightSider");
const inputSearch = document.querySelector(".inputSearch");
const btnSearch = document.querySelector(".btnSearch");

let keywords = "";
let genres = "";

inputSearch.addEventListener("change", (event) => {
  keywords = event.target.value;
});

const getGames = async (query) => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games?${query}`; // =>BASE URL
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.data };
    }
  } catch (error) {
    console.log("Error from Game List data", error);
    return { success: false, data: null };
  }
};

const getPopularGenres = async () => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres`;
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error from Genres Data", error);
    return [];
  }
};

const getDetailedGame = async (appid) => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/${appid}`;
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.data };
    }
  } catch (error) {
    console.log("Error from Genres Data", error);
    return { success: false, data: null };
  }
};

const onClickGame = async (appId) => {
  const response = await getDetailedGame(appId);
  if (response.success) {
    renderDetailGame(response.data);
  }
};

const getBestGame = async () => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features`;
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error from High Rating data", error);
    return [];
  }
};

const renderGenres = async () => {
  try {
    const response = await getPopularGenres();
    response.data.forEach((genres) => {
      const btnCategory = document.createElement("button");
      btnCategory.className = "btnGenres";
      btnCategory.addEventListener("click", () => {
        bestGameWrapper.className = "hiddenSection";
        filterGame(genres.name);
      });
      btnCategory.innerText = genres.name;
      genresList.appendChild(btnCategory);
    });
  } catch (error) {
    console.log("Error from render genres", error);
  }
};

const renderBestGame = async () => {
  try {
    const response = await getBestGame();
    console.log("response getBestGame", response);
    response.data.forEach((bestgame) => {
      const bestGameBox = document.createElement("div");
      bestGameBox.className = "gameBox";
      bestGameBox.addEventListener("click", () => onClickGame(bestgame?.appid));

      if (`${bestgame.price}` !== "0") {
        bestGameBox.innerHTML = `
      <img src="${bestgame["header_image"]}" alt="${bestgame.name}" class="imgBox"/>
      <div class="infoGame">
        <div class="titleGame">${bestgame.name}</div>
        <div class="gameCost">$ ${bestgame.price}</div>
      </div>
      `;
      } else {
        bestGameBox.innerHTML = `
        <img src="${bestgame["header_image"]}" alt="${bestgame.name}" class="imgBox"/>
        <div class="infoGame">
          <div class="titleGame">${bestgame.name}</div>
          <div class="gameCost" style="background-color:#B3BF5A; text-align: center;">FREE NOW</div>
        </div>
        `;
      }
      listBestGame.appendChild(bestGameBox);
    });
  } catch (error) {
    console.log("Error from render best game", error);
  }
};

const renderAllGame = async () => {
  const response = await getGames();
  if (response.success) {
    const trendingList = document.querySelector(".trendingList");
    const newTrendingList = renderUIListGame(response.data);
    newTrendingList.className = "trendingList";

    trendingList.replaceWith(newTrendingList);
  }
};

const renderUIListGame = (listGame) => {
  const trendingList = document.createElement("div");

  listGame.forEach((game) => {
    const gameBox = document.createElement("div");
    gameBox.className = "gameBox";
    gameBox.addEventListener("click", () => onClickGame(game?.appid));

    if (`${game.price}` !== "0") {
      gameBox.innerHTML = `
      <img src="${game["header_image"]}" alt="${game.name}" class="imgBox"/>
      <div class="infoGame">
        <div class="titleGame">${game.name}</div>
        <div class="gameCost">$ ${game.price}</div>
      </div>
      `;
    } else {
      gameBox.innerHTML = `
        <img src="${game["header_image"]}" alt="${game.name}" class="imgBox"/>
        <div class="infoGame">
          <div class="titleGame">${game.name}</div>
          <div class="gameCost" style="background-color:#B3BF5A; letter-spacing: 2px;">FREE</div>
        </div>
        `;
    }
    trendingList.appendChild(gameBox);
  });
  return trendingList;
};

const renderDetailGame = (detail) => {
  const contentRightSider = document.querySelector(".contentRightSider");
  const gamedetail = document.createElement("div");
  gamedetail.className = "contentRightSider";
  gamedetail.innerHTML = `
      <div class="singleGameWrapper">
      <h2 class="singleGameTitle">${detail.name}</h2>
      <div class="singleGameBox" style="background-image:url(${
        detail.background
      })">
        <div class="singleImgGame">
          <img src="${detail?.header_image}" alt="${detail.name}">
        </div>
        <div class="gameInformation">
          <div class="gameDecription">${detail.description}</div>
          <div class="gamePreview">
            <ul>
              <li>Recent Positive Review: ${Math.round(
                positiveReview(detail.positive_ratings, detail.negative_ratings)
              )}%</li>
              <li>Release Date: ${formatDateTime(detail.release_date)}</li>
              <li>Developer: ${detail.developer}</li>
              <li>Publisher: ${detail.developer}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="gameTags">
        <div class="genresOfGame">
          <h3>Genres</h3>
          <div class="smallGenresWrapper" > 
          ${detail.genres.map(
            (tagGenres) =>
              `<div><a href="https://store.steampowered.com/genres/en/${tagGenres}" target="_blank">${capitalizeFirstLetter(
                tagGenres
              )}</a></div>`
          )}  
          </div>
        </div>
        <div class="tagsOfGame">
          <h3>Tags</h3>
          <div class="smallTagWrapper">
          ${detail.steamspy_tags
            .map((tag) => {
              return `<div>
                <a href="https://store.steampowered.com/tags/en/${tag}" target="_blank">
                  ${tag}
                </a>
              </div>`;
            })
            .join("")} 
          </div>
        </div>
        </div>
      </div>`;

  contentRightSider.replaceWith(gamedetail);
};

const filterGame = async (newGenres) => {
  const querryGenres = newGenres ? newGenres : genres;

  let query = "";
  if (querryGenres) {
    query += `genres=${querryGenres}`;
  }
  if (!querryGenres && keywords) {
    query += `q=${keywords}`;
    trendingTitle.textContent = "RESULT";
    bestGameWrapper.className = "hiddenSection";
  }
  if (querryGenres && keywords) {
    query += `&q=${keywords}`;
    trendingTitle.textContent = "RESULT";
    bestGameWrapper.className = "hiddenSection";
  }

  const response = await getGames(query);
  if (response.success) {
    const contentRightSider = document.querySelector(".contentRightSider");
    const listUIGame = renderUIListGame(response.data);

    listUIGame.className = "contentRightSider";
    listUIGame.setAttribute(
      "style",
      "margin-bottom: 50px;padding-left: 15px; padding-right:15px; width:100%;display:flex;flex-wrap:wrap;justify-content: space-around;gap: 20px;"
    );

    contentRightSider.replaceWith(listUIGame);
  }
  if (newGenres) {
    genres = newGenres;
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDateTime(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatter.format(date);
}

function positiveReview(positiveVotes, negativeVotes) {
  const positivePercentage =
    (positiveVotes / (positiveVotes + negativeVotes)) * 100;
  return positivePercentage;
}

renderGenres();
renderBestGame();
renderAllGame();

btnSearch.addEventListener("click", () => {
  filterGame();
});

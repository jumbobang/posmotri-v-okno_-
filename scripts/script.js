const cardsOnPage = 5;
const cardsList = document.querySelector('.content__list');
const cardsContainer = document.querySelector('.content__list-container');
const videoContainer = document.querySelector('.result__video-container');
const videoElement = document.querySelector('.result__video');
const form = document.querySelector('form');
const cardTmp = document.querySelector('.cards-list-item-template');
const preloaderTmp = document.querySelector('.preloader-template');
const errorTmp = document.querySelector('.error-template');
const moreTmp = document.querySelector('.more-button-template');

const MOCK_VIDEOS = [
  { id: 1, city: "Санкт-Петербург", description: "Утренний вид на Неву и Дворцовую площадь.", time: "morning",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster1.jpg" } },
  { id: 2, city: "Москва", description: "Дневной вид на Красную площадь.", time: "afternoon",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster2.jpg" } },
  { id: 3, city: "Казань", description: "Ночной вид на Казанский кремль.", time: "night",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster3.jpg" } },
  { id: 4, city: "Сочи", description: "Утренний вид на Чёрное море.", time: "morning",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster1.jpg" } },
  { id: 5, city: "Екатеринбург", description: "Дневной вид на городской пруд.", time: "afternoon",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster2.jpg" } },
  { id: 6, city: "Новосибирск", description: "Ночной вид на Обь.", time: "night",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster3.jpg" } },
  { id: 7, city: "Владивосток", description: "Утренний вид на Золотой мост.", time: "morning",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster1.jpg" } },
  { id: 8, city: "Калининград", description: "Дневной вид на Рыбную деревню.", time: "afternoon",
    video: { url: "./media/video1.mp4" }, poster: { url: "./media/poster2.jpg" } }
];

let filtered = [...MOCK_VIDEOS];
let page = 0;

function showPreloader(parent) {
  if (!parent.querySelector('.preloader')) parent.append(preloaderTmp.content.cloneNode(true));
}
function removePreloader(parent) {
  parent.querySelector('.preloader')?.remove();
}
function showError(msg) {
  const node = errorTmp.content.cloneNode(true);
  node.querySelector('.error__title').textContent = msg;
  videoContainer.append(node);
}

function appendCards(items) {
  items.forEach(el => {
    const node = cardTmp.content.cloneNode(true);
    const a = node.querySelector('a');
    a.id = el.id;
    node.querySelector('.content__video-card-title').textContent = el.city;
    node.querySelector('.content__video-card-description').textContent = el.description;
    const img = node.querySelector('img');
    img.src = el.poster.url;
    img.alt = el.city;
    cardsList.append(node);
  });
}

function setVideo(data) {
  videoElement.src = data.video.url;
  videoElement.poster = data.poster.url;
  videoElement.load();
}

function bindClicks() {
  document.querySelectorAll('.content__card-link').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      document.querySelectorAll('.content__card-link').forEach(l => l.classList.remove('content__card-link_current'));
      link.classList.add('content__card-link_current');
      const data = MOCK_VIDEOS.find(v => String(v.id) === link.id);
      if (data) {
        showPreloader(videoContainer);
        setTimeout(() => {
          setVideo(data);
          removePreloader(videoContainer);
        }, 300);
      }
    };
  });
}

function load() {
  const start = page * cardsOnPage;
  const chunk = filtered.slice(start, start + cardsOnPage);
  removePreloader(videoContainer);
  removePreloader(cardsContainer);
  if (!chunk.length) {
    showError('Нет подходящих видео =(');
    return;
  }
  appendCards(chunk);
  setVideo(chunk[0]);
  document.querySelector('.content__card-link')?.classList.add('content__card-link_current');
  cardsContainer.classList.add('custom-scrollbar');
  bindClicks();
  if (start + cardsOnPage < filtered.length && !cardsContainer.querySelector('.more-button')) {
    const btn = moreTmp.content.cloneNode(true).querySelector('button');
    cardsContainer.append(btn);
    btn.onclick = () => {
      page++;
      showPreloader(cardsContainer);
      setTimeout(() => { btn.remove(); load(); }, 300);
    };
  }
}

showPreloader(videoContainer);
showPreloader(cardsContainer);
setTimeout(load, 400);

form.onsubmit = e => {
  e.preventDefault();
  cardsList.innerHTML = '';
  cardsContainer.querySelector('.more-button')?.remove();
  videoContainer.querySelector('.error')?.remove();
  const city = (new FormData(form).get('city') || '').trim().toLowerCase();
  const times = [...form.querySelectorAll('input[name="time"]:checked')].map(i => i.value);
  filtered = MOCK_VIDEOS.filter(v =>
    (!city || v.city.toLowerCase().includes(city)) &&
    (times.length === 0 || times.includes(v.time))
  );
  page = 0;
  showPreloader(videoContainer);
  showPreloader(cardsContainer);
  setTimeout(load, 300);
};

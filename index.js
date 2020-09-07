import {API_KEY, YOUTUBE_PLAYLIST_ITEMS_API, PLAYLIST_ID} from './constants'

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let fetch_playlist = function (pageToken, wrapper, template, button) {
  return fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}`+
      `?part=snippet&maxResults=50` +
      `&playlistId=${PLAYLIST_ID}` +
      `&pageToken=${pageToken}` +
      `&key=${API_KEY}`)
  .then(response => response.json())
  .then(res => {
    console.log(res)
    let randomized = shuffle(res.items)
    randomized.map((item, index) => {
      let clone = template.content.cloneNode(true);
      let preview = clone.querySelectorAll(".preview");
      let link = clone.querySelectorAll(".card_link");
      preview[0].setAttribute("style", "background-image: url(" + item.snippet.thumbnails.medium.url + ")");
      link[0].setAttribute("href", "https://youtube.com/watch?v=" + item.snippet.resourceId.videoId + "&list=" + PLAYLIST_ID)
      link[0].setAttribute("target", "blank")
      if(res.nextPageToken) {
        button.setAttribute("data-pagination", res.nextPageToken)
      } else {
        button.setAttribute("class", "hidden")
      }
      return wrapper.appendChild(clone)
    })
  })
}

window.onload = function () {
  let wrapper = document.querySelector("#braccio");
  let template = document.querySelector('#card');
  let button = document.querySelector('#pagination');
  fetch_playlist('', wrapper, template, button)
  button.addEventListener('click', function() {
    fetch_playlist(button.dataset.pagination, wrapper, template, button)
  });
}


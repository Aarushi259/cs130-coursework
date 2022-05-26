const baseURL = "https://www.apitutor.org/spotify/simple/v1/search";

// Note: AudioPlayer is defined in audio-player.js
const audioFile =
  "https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c";
const audioPlayer = AudioPlayer(".player", audioFile);

const search = (ev) => {
  const term = document.querySelector("#search").value;
  console.log("search for:", term);
  // issue three Spotify queries at once...
  getTracks(term);
  getAlbums(term);
  getArtist(term);
  if (ev) {
    ev.preventDefault();
  }
};

const getTracks = (term) => {
  let url = `https://www.apitutor.org/spotify/simple/v1/search?type=track&q=${term}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let firstFive = data.splice(0, 5);

        console.log(firstFive[0]);

        //   convert to html
        let html = firstFive.map(track2Html);

        //  plug it back to the index.html file
        document.querySelector("#tracks").innerHTML = html;

      } else {
        let html = "<p>No tracks found that match your search criteria. </p>";
        document.querySelector("#tracks").innerHTML = html;
      }
    }
    )
    .then(() =>  playTrack());
    
};

const track2Html = (track) => {
  return `
    <button class="track-item preview" data-preview-track=${track.preview_url} onclick="handleTrackClick(event);">
            <img src=${track.album.image_url} alt = "Album cover for ${track.album.name}">
            <i class="fas play-track fa-play" aria-label="Play track ${track.name}"></i>
            <div class="label">
                <h2>${track.name}</h2>
                <p>
                 ${track.artist.name}
                </p>
            </div>
    </button>
    `;
};

const getAlbums = (term) => {
  let url = `https://www.apitutor.org/spotify/simple/v1/search?type=album&q=${term}`;
  console.log('Fetching albums now');
  fetch(url)
    .then((response) => response.json())
    .then((albums) => {
      console.log(albums);
      document.querySelector("#albums").innerHTML = "";
      if (albums.length > 0) {
        for (const album of albums) {
          document.querySelector("#albums").innerHTML += `
          <section class="album-card" id=${album.id}>
          <div>
              <img src=${album.image_url} alt = "Album cover for ${album.name}">
              <h2>${album.name}</h2>
              <div class="footer">
                  <a href=${album.spotify_url} target="_blank">
                      view on spotify
                  </a>
              </div>
          </div>
        </section>
          `;
        }

      } else {
        let html = "<p>No albums found that match your search criteria. </p>";
        document.querySelector("#albums").innerHTML = html;
      }
    });
  
};


const getArtist = (term) => {
  let url = `https://www.apitutor.org/spotify/simple/v1/search?type=artist&q=${term}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let firstArtist = data[0];

        //   create a function that converts this data to html

        let html = artist2Html(firstArtist);

        // plug that html into the index.html file
        document.querySelector("#artist").innerHTML = html;
      } else {
        let html = "<p> No artists have been found </p>";
        document.querySelector("#artist").innerHTML = html;
      }
    });
};

const artist2Html = (artist) => {
  return `
    <section class="artist-card" id=${artist.id}>
        <div>
            <img src=${artist.image_url} alt = "Picture of ${artist.name}">
            <h2>${artist.name}</h2>
            <div class="footer">
                <a href=${artist.spotify_url} target="_blank">
                    view on spotify
                </a>
            </div>
        </div>
    </section>  `;
};


const handleTrackClick = (ev) => {
  const previewUrl = ev.currentTarget.getAttribute("data-preview-track");
  console.log(previewUrl);
};

const playTrack = () => {
  const tracks = document
    .getElementById("tracks")
    .querySelectorAll(".track-item");
  console.log(tracks.length);
  tracks.forEach((track) => {
    track.addEventListener("click", (event) => {
      const trackPreviewContainer = document
        .querySelector("footer")
        .getElementsByClassName("track-item")[0];
      trackPreviewContainer.innerHTML = `${event.currentTarget.innerHTML}`;

      const songUrl = event.currentTarget.getAttribute("data-preview-track");
      audioPlayer.setAudioFile(songUrl);

      audioPlayer.play();
    });
  });
};

document.querySelector("#search").onkeyup = (ev) => {
  // Number 13 is the "Enter" key on the keyboard
  console.log(ev.keyCode);
  if (ev.keyCode === 13) {
    ev.preventDefault();
    search();
  }
};

getTracks("Harry Styles");
getAlbums("Harry Styles");
getArtist("Harry Styles");

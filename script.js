let submitBtu = document.getElementById("submit-btn");
let currentOffset = 0;
const fragment = document.createDocumentFragment();


let generateGif = async (offset = 0) => {
  let loader = document.querySelector(".loader");
  loader.style.display = "block";

  if (offset === 0) {
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".wrapper").innerHTML = "";
  }

  let q = document.getElementById("search-box").value;
  let gifCount = 20;
  let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=${offset}&rating=g&lang=en`;

  let response = await fetch(finalURL);
  if (!response.ok) {
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "block";
    document.querySelector(".wrapper").innerHTML =`
      <p>Error fetching GIFs: HTTP status ${response.status}</p>
      <p>Please try again later</p>`;
    return; 
  }

  let info = await response.json();
  let gifData = info.data;

  loader.style.display = "none";
  document.querySelector(".wrapper").style.display = "grid";

  gifData.forEach((gif) => {
    let container = document.createElement("div");
    container.classList.add("container");
    let iframe = document.createElement("img");

    iframe.setAttribute("src", gif.images.downsized_medium.url);
    iframe.setAttribute("alt", gif.title);

    fragment.appendChild(iframe);
    container.appendChild(fragment);

    let copyBtu = document.createElement("button");
    copyBtu.innerText = "Copy Link";
    copyBtu.onclick = async () => {
      let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
      try {
        await navigator.clipboard.writeText(copyLink);
        alert("Link copied to clipboard");
      } catch {
        alert("Link copied to clipboard");
        let hiddenInput = document.createElement("input");
        hiddenInput.setAttribute("type", "text");
        hiddenInput.value = copyLink;
        fragment.appendChild(hiddenInput);
        document.body.appendChild(fragment);
        hiddenInput.select(); //select input
        document.execCommand("copy"); //copy the value
        document.body.removeChild(hiddenInput); //remove the input
      }
    };

    fragment.appendChild(copyBtu);
    container.appendChild(fragment);
    document.querySelector(".wrapper").append(container);

    let fullScreen = document.createElement("div");
    fullScreen.classList.add("full-screen");

    iframe.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        fullScreen.innerHTML = "";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        fragment.appendChild(iframe.cloneNode(true));
        fullScreen.appendChild(fragment);
        fragment.appendChild(fullScreen);
        document.body.appendChild(fragment);
        if (fullScreen.requestFullscreen) {
          fullScreen.requestFullscreen();
        }
      }
    });
    fragment.appendChild(fullScreen);
    document.body.appendChild(fragment);

  });
};

submitBtu.addEventListener("click", () => {
  currentOffset = 0;
  generateGif();
});

window.addEventListener("load", generateGif);

window.addEventListener("scroll", () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    currentOffset += 20;
    generateGif(currentOffset);
  }
});


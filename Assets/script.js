const backgroundImage = document.getElementById('backgroundImage');

function backgroundImageCycle () {
  backgroundImage.classList.remove("visable");
  backgroundImage.classList.add("hidden");
  console.log("flip");
}

// setInterval (backgroundImageCycle, 1000)
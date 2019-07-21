window.addEventListener("load", () => {
  let long;
  let lat;

  getLocation();
});

function getLocation() {
  const location = "https://ipapi.co/json/";

  fetch(location)
    .then(localeResponse => {
      return localeResponse.json();
    })
    .then(localeData => {
      // console.log(localeData.latitude);
      lat = localeData.latitude;
      long = localeData.longitude;
    })
    .then(weather => {
      getWeather(lat, long);
    });
}

function getWeather(lat, long) {
  const timezone = document.querySelector(".location-local");
  const temp = document.querySelector(".temperature-degree");
  const tempDescription = document.querySelector(".temperature-description");
  const tempSection = document.querySelector(".degree-container");

  tempSection.addEventListener("click", changeDegree);

  // Bypass CORS errors
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = `${proxy}https://api.darksky.net/forecast/996e512a82a9af7349e7eb6f50ea3b22/${lat},${long}`;

  fetch(api)
  .then(response => {
    return response.json();
  })
  .then(data => {
    const {temperature, summary, icon} = data.currently; 
    const city = data.timezone.split("/");

    temp.textContent = Math.round((temperature - 32) / 1.8);
    tempDescription.textContent = summary;
    timezone.textContent = `${city[1]}, ${city[0]}`;
    //Set icon
    setIcons(icon, document.querySelector(".icon"));
  });
}

function setIcons(icon, iconID) {
  const skycons = new Skycons({ color: "white" });
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}

function changeDegree() {
  const temp = document.querySelector(".temperature-degree");
  const tempSpan = document.querySelector(".degree-container span");

  if (tempSpan.textContent === "C") {
    temp.textContent = Math.round((temp.textContent * 1.8) + 32);
    tempSpan.textContent = "F";
  } else {
    temp.textContent = Math.round((temp.textContent - 32) / 1.8);
    tempSpan.textContent = "C";
  }
}
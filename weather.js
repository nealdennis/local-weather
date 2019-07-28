window.addEventListener("load", () => {
  let long;
  let lat;

  getLocation();
});

const convertTime = ( time ) => {
  let theDate = new Date(time * 1000);
  let hour = theDate.getHours();
  let mins = "0" + theDate.getMinutes();
  return(`${ hour }:${ mins }`);
}

const convertToC = ( temp ) => {
  return Math.round((temp - 32) / 1.8);
}

const convertToF = ( temp ) => {
  return Math.round((temp * 1.8) + 32);
}

const getLocation = () => {
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

const displayHourlyTemp = (hourly) => {
  hourly.data.forEach(hour => {
    let time = convertTime(hour.time);
    console.log(`${ time } - ${ convertToC(hour.temperature) }`);
  });
}

const setIcons = (icon, iconID) => {
  const skycons = new Skycons({ color: "white" });
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}

const changeDegree = () => {
  const temp = document.querySelector(".temperature-degree");
  const tempSpan = document.querySelector(".degree-container span");

  if (tempSpan.textContent === "C") {
    temp.textContent = convertToF(temp.textContent);
    tempSpan.textContent = "F";
  } else {
    temp.textContent = convertToC(temp.textContent);
    tempSpan.textContent = "C";
  }
}

const getWeather = (lat, long) => {
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
    const { temperature, icon } = data.currently; 
    const { summary } = data.hourly;
    const city = data.timezone.split("/");

    temp.textContent = convertToC(temperature);
    tempDescription.textContent = summary;
    timezone.textContent = `${city[1]}, ${city[0]}`;
    //Set icon
    setIcons(icon, document.querySelector(".icon"));

    //Show next 24hrs
    displayHourlyTemp(data.hourly)
  });
}


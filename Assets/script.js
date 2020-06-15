const userSearch = document.getElementById('userSearch');
const searchButton = document.querySelector("#searchButton");

let userSearchInput = $("#userSearchInput");

// Temp Convert
function convertK2F(temperature) {
  temperature = Math.floor((((temperature) - 273.15) * (9 / 5) + 32));
  return temperature;
};

// Show Hidden Element
function revealElement(element) {
  element = element.removeClass("hideElement");
  element = element.addClass("showElement");
  return element;
};

// Hide Element
function hideElement(element) {
  $(element).removeClass("showElement");
  $(element).addClass("hideElement");
  return element
};

// Load Local Storage Into Search History
function addToHistory(cityName) {
  let searchHistory = JSON.parse(localStorage.getItem("Weather Search History")) || [];
  searchHistory.unshift(cityName);
  localStorage.setItem("Weather Search History", JSON.stringify(searchHistory));
};
function updateHistory() {
  let searchHistory = JSON.parse(localStorage.getItem("Weather Search History")) || [];
  $("#searchHistory").html(searchHistory
    .map(searchHistoryList => {
      return (`<li><button class="btn btn-link historyList"> ` + searchHistoryList + `</button></li>`);
    })
    .join(""));
};

// No Results
function noResults() {
  revealElement($("#noResults"));
};
 
function searchFunction() {
  // Builds URLs
  let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput.val() + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput.val() + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

  // Loading Icon for Weather Results Element
  $("#searchResultsLoadingIcon").remove();
  $("#searchResults").append('<div id="searchResultsLoadingIcon" class="spinner-border text-light" role="status"><span class="sr-only"></span></div>'); // Loading Icon

  // Current Weather Call
  $.ajax({
    url: currentQueryURL,
    method: "GET",
    // If a typo, or not a city, abort search
    error: function () {
      hideElement($("#searchResults"));
      hideElement($("#currentDateParent"));
      hideElement($("#userSearchHeader"));
      $("#weatherHeader").parent().addClass("firstVisit");
      $("#weatherHeader").text("Weather Dashboard");
      noResults();
    }
  })
    .then(function (response) {
      // Hide No Results if Present
      hideElement($("#noResults"));

      // Show Date
      revealElement($("#currentDateParent"));
      // Adding header to search input box
      revealElement($("#userSearchHeader"));
      // Revealing Weather Results Element
      revealElement($("#searchResults"));
      // Header CSS 
      $("#weatherHeader").parent().removeClass("firstVisit");
      // Changing Header to Match Search Results
      $("#weatherHeader").text(response.name + " Weather");
      // Removing Loading Icon
      $("#searchResultsLoadingIcon").remove();

      // Matching Weather Icon
      let weatherIconID = response.weather[0].icon;
      $("#weatherIcon").empty(); // Protection from overflowing element
      $("#weatherIcon").append('<img src="http://openweathermap.org/img/wn/' + weatherIconID + '@2x.png" alt="weatherIcon">')

      // City Name and Brief Description
      $("#weatherCityName").empty(); // Protection from overflowing element
      $("#weatherCityName").append("<h2>" + response.name + "</h2>");
      $("#weatherCityName").append("<h5>" + (response.weather[0].description).toUpperCase() + "</h5>");

      // Temperatures - current, high, low
      let temperatureCurrent = convertK2F(response.main.temp);
      let temperatureHigh = convertK2F(response.main.temp_max);
      let temperatureLow = convertK2F(response.main.temp_min);

      $("#weatherTemperature").empty(); // Protection from overflowing element
      $("#weatherTemperature").append("<h4>Temp: " + temperatureCurrent + " \xB0F</h4>");
      $("#weatherTemperature").append("<h5>High: " + temperatureHigh + " \xB0F</h5>");
      $("#weatherTemperature").append("<h5>Low: " + temperatureLow + " \xB0F</h5>");

      // Humidity
      $("#weatherInformation").empty(); // Protection from overflowing element
      $("#weatherInformation").append("<h5>Humidity: " + response.main.humidity + " %</h5>");

      // Wind Speed
      $("#weatherInformation").append("<h5>Wind Speed: " + response.wind.speed + " mph</h5>");

      // Pressure
      $("#weatherInformation").append("<h5>Pressure: " + response.main.pressure + " hpa</h5>");

      // UV Index
      $("#weatherUVIndex").empty(); // Protection from overflowing element
      $("#weatherUVIndex").append('<div class="spinner-border text-light" role="status"><span class="sr-only"></span></div>'); // Loading Icon

      let uviLat = response.coord.lat;
      let uviLon = response.coord.lon;

      let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + uviLat + "&lon=" + uviLon + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

      // UV Index Get
      $.ajax({
        url: uvIndexURL,
        method: "GET"
      })
        .then(function (response) {
          $("#weatherUVIndex").empty(); // Remove Loading Icon
          $("#weatherUVIndex").append("<h5>UV Index: " + response.value + "</h5>");

          if (response.value < 3) {
            $("#weatherUVIndex").append("<h5 class='green'>Low</h5>");
          }
          if (response.value < 6 && response.value >= 3) {
            $("#weatherUVIndex").append("<h5 class='yellow'>Moderate</h5>");
          }
          if (response.value < 8 && response.value >= 6) {
            $("#weatherUVIndex").append("<h5 class='orange'>High</h5>");
          }
          if (response.value < 11 && response.value >= 8) {
            $("#weatherUVIndex").append("<h5 class='red'>Very High</h5>");
          }
          if (response.value > 11) {
            $("#weatherUVIndex").append("<h5 class='violet'>Extreme</h5>");
          }
        });
      // Add Search to Search History
      addToHistory(response.name);
      updateHistory();
    });

  // Forecasted time
  for (i = 1; i <= 5; i++) {
    let forecastDay = document.querySelector("#forecastResults > div:nth-child(" + (i) + ") > div > div > h4")
    $(forecastDay).text(moment().add(i, 'days').format("dddd"))
  }

  // Forecast Weather Call
  $.ajax({
    url: forecastQueryURL,
    method: "GET"
  })
    .then(function (response) {

      for (i = 0; i <= 5; i++) {
        let forecastWeatherDescription = document.querySelector("#forecastResults > div:nth-child(" + (i + 1) + ") > div > div > h6");
        let forecastIcon = document.querySelector("#forecastResults > div:nth-child(" + (i + 1) + ") > div > div > div");
        let forecastIconID = response.list[i].weather[0].icon;
        let forecastInformation = document.querySelector("#forecastResults > div:nth-child(" + (i + 1) + ") > div > div > div.card-text");
        let forecastTemp = convertK2F(response.list[i].main.temp);
        let forecastTempHigh = convertK2F(response.list[i].main.temp_max);
        let forecastTempLow = convertK2F(response.list[i].main.temp_min);
        let forecastHumidity = response.list[i].main.humidity;

        // Weather Description
        $(forecastWeatherDescription).text((response.list[i].weather[0].description).toUpperCase());

        // Forecast Icon
        $(forecastIcon).empty();
        $(forecastIcon).prepend('<img src="https://openweathermap.org/img/wn/' + forecastIconID + '.png" alt="weatherIcon">');

        // Remove Loading Icon
        $(forecastInformation).empty();

        // Temperatures
        $(forecastInformation).append("Temp: " + forecastTemp + " \xB0F");
        $(forecastInformation).append("<br>High: " + forecastTempHigh + " \xB0F");
        $(forecastInformation).append("<br>Low: " + forecastTempLow + " \xB0F");

        // Humidity
        $(forecastInformation).append("<br>Humidity: " + forecastHumidity + "%");
      };
    });
};


// On Page Load
$(document).ready(function () {
  // Current time
  $("#currentDate").text(moment().format("MMMM Do, YYYY"));

  // Enabling Search Button after text has been input
  $(userSearchInput).keyup(function () {
    searchButton.disabled = (!userSearchInput.val());
  });

  // Button to toggle Sidebar
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });

  updateHistory();

  // When A User Types In A City And Submits
  $(userSearch).submit(function(){
    event.preventDefault();
    searchFunction();
  });

  // When user clicks city in history, it searches for it
  $('.historyList').on('click', function () {
    userSearchInput.val($(this).text());
    searchFunction();
  });
});  
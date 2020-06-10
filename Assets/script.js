const userSearch = document.getElementById('userSearch');

$(document).ready(function () {
  // Current time
  $("#currentDate").text(moment().format("MMMM Do, YYYY"));
});

// When A User Types In A City And Submits
$(userSearch).submit(function(){
  event.preventDefault();
  let userSearchInput = $("#userSearchInput").val();

  // Show Date
  $("#currentDateParent").removeClass("hideElement");
  $("#currentDateParent").addClass("showElement");

  // Builds URLs
  let currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
  let forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

  // Current Weather Call
  $.ajax({
    url: currentQueryURL,
    method: "GET"  
  })
    .then(function(response){

      // Changing Header to Match Search Results
      $("#weatherHeader").text(response.name + " Weather");
      
      // Revealing Weather Search Results
      $("#searchResults").removeClass("hideElement");
      $("#searchResults").addClass("showElement");

      // Matching Weather Icon
      let weatherIconID = response.weather[0].icon;
      $("#weatherIcon").empty(); // Protection from overflowing element
      $("#weatherIcon").append('<img src="http://openweathermap.org/img/wn/' + weatherIconID + '@2x.png" alt="weatherIcon">')

      // City Name and Brief Description
      $("#weatherCityName").empty(); // Protection from overflowing element
      $("#weatherCityName").append("<h2>"+response.name+"</h2>");
      $("#weatherCityName").append("<h5>"+(response.weather[0].description).toUpperCase()+"</h5>");

      // Temperatures
      let temperatureCurrent = Math.floor((((response.main.temp)-273.15) * (9 / 5) + 32));
      let temperatureHigh = Math.floor((((response.main.temp_max)-273.15) * (9 / 5) + 32));
      let temperatureLow = Math.floor((((response.main.temp_min)-273.15) * (9 / 5) + 32));

      $("#weatherTemperature").empty(); // Protection from overflowing element
      $("#weatherTemperature").append("<h4>Temp: " + temperatureCurrent + " \xB0F</h4>");
      $("#weatherTemperature").append("<h5>High: " + temperatureHigh + " \xB0F</h5>");
      $("#weatherTemperature").append("<h5>Low: " + temperatureLow + " \xB0F</h5>");

      // Loading Icon for Weather Element
      // $("#weatherInformation").empty();
      $("#weatherInformation").append('<div class="spinner-border text-light" role="status"><span class="sr-only"></span></div>'); // Loading Icon

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

      let uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + uviLat + "&lon=" + uviLon + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
      console.log(uvIndexURL);

      // UV Index Get
      $.ajax({
        url: uvIndexURL,
        method: "GET"
      })
        .then(function(response){
          $("#weatherUVIndex").empty(); // Remove Loading Icon
          $("#weatherUVIndex").append("<h5>UV Index: " + response.value + "</h5>");

          if (response.value < 3){
            $("#weatherUVIndex").append("<h5 class='green'>Low</h5>");
          }
          if (response.value < 6 && response.value >= 3){
            $("#weatherUVIndex").append("<h5 class='yellow'>Moderate</h5>");
          }
          if (response.value < 8 && response.value >= 6){
            $("#weatherUVIndex").append("<h5 class='orange'>High</h5>");
          }
          if (response.value < 11 && response.value >= 8){
            $("#weatherUVIndex").append("<h5 class='red'>Very High</h5>");
          }
          if (response.value > 11){
            $("#weatherUVIndex").append("<h5 class='violet'>Extreme</h5>");
          }
        });
    });
})

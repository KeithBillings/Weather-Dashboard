const userSearch = document.getElementById('userSearch');


// When A User Types In A City And Submits
$(userSearch).submit(function(){
  event.preventDefault();
  let userSearchInput = $("#userSearchInput").val();

  // Builds URLs
  let currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
  let forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

  // Current Weather Call
  $.ajax({
    url: currentQueryURL,
    method: "GET"  
  })
    .then(function(response){
      console.log(response);

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

      $("#weatherInformation").empty(); // Protection from overflowing element
      $("#weatherInformation").append("<h4>Temp: " + temperatureCurrent + " \xB0F</h4>");
      $("#weatherInformation").append("<h5>High: " + temperatureHigh + " \xB0F</h5>");
      $("#weatherInformation").append("<h5>Low: " + temperatureLow + " \xB0F</h5>");

      // Humidity
      $("#weatherInformation2").empty();
      $("#weatherInformation2").append("<h5>Humidity: " + response.main.humidity + " %</h5>");

      // Wind Speed
      $("#weatherInformation2").append("<h5>Wind Speed: " + response.wind.speed + " mph</h5>");

      // test
      $("#weatherInformation3").empty();
      // $("#weatherInformation3").append();

    });
})

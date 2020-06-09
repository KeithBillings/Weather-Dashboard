const userSearch = document.getElementById('userSearch');

$(userSearch).submit(function(){
  event.preventDefault();

  let userSearchInput = $("#userSearchInput").val();

  let currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
  let forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

  console.log("current weather URL " + currentQueryURL);
  console.log("forecast URL " + forecastQueryURL);

  // Current Weather
  $.ajax({
    url: currentQueryURL,
    method: "GET"  
  })
    .then(function(response){
      console.log(response);
      $("#weatherHeader").text(response.name + " Weather");
    });

})

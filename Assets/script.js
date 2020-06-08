const userSearch = document.getElementById('userSearch');


$(userSearch).submit(function(){
  event.preventDefault();

  let userSearchInput = $("#userSearchInput").val();

  let forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";
  let currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userSearchInput + "&APPID=cebdb9193e7fdb67dd3b7d1aa04be4ca";

  console.log("forecast URL " + forecastQueryURL);
  console.log("current weather URL" + currentQueryURL);
})

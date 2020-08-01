// API Id
appid= "2d18e1751398e211355e317a4dc2e526";

// City Array
var cityArr =[];

// Getting data from local storage
// Using data for previous search
function initialize() {
  storedCity = localStorage.getItem("City");
  storedCities = localStorage.getItem("Cities");
  currentDayWeather(storedCity);
  dailyWeather(storedCity);
//   displayCities(storedCities);
}

// Appending previous search
initialize();

// Daily Weather 
function dailyWeather(city) {

// API Call
  fiveDayQueryURL="https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=imperial&appid=" + appid;

// Ajax GET request
  $.ajax({
      url: fiveDayQueryURL,
      method: "GET"
    
    // Response data  
    }).then(function(response) {
      var today = new Date();
      var date = today.toJSON().slice(0,10);
      var days =0;
      $("#five-day").empty();



      var forecastTitle = $("<p>").addClass("h5").text("Daily Forecasts");
      $("#five-day").append(forecastTitle);

      var forecasts = $("<div>").addClass("row");


      for (var i = 0; i < response.list.length; i++) {

        if (date !== response.list[i].dt_txt.split(" ")[0]){

          var hour = response.list[i].dt_txt.split(" ")[1].split(":")[0];
          
          if (parseInt(hour) === 3) {
            days++;

            column = $("<div>").addClass("col");;

            card = $("<div>").addClass("card text-light fiveDay");
        
            cardBody = $("<div>").addClass("card-body");
        
            cardTitle = $("<h5>").addClass("card-title");
        
            cardBody = $("<div>").addClass("card-body");
        
            cardTitle.text(JSON.parse(JSON.stringify(response.list[i].dt_txt.split(" ")[0])));
 
            weatherImg = $("<img>");
            weatherImg.attr("src","https://openweathermap.org/img/wn/" + JSON.parse(JSON.stringify(response.list[i].weather[0].icon)) + "@2x.png");
            
            cardTemp = $("<p>");
            cardTemp.addClass("card-text");
            cardTemp.text("Temp: " + JSON.parse(JSON.stringify(response.list[i].main.temp)) +" \xB0F");
        
            cardHumidity = $("<p>");
            cardHumidity.addClass("card-text");
            cardHumidity.text("Humidity: " + JSON.parse(JSON.stringify(response.list[i].main.humidity)) +" %");
        
            cardBody.append(cardTitle);        
            cardBody.append(weatherImg);
            cardBody.append(cardTemp);
            cardBody.append(cardHumidity);
        
            card.append(cardBody);
            column.append(card);
            column.append($("<br>"));

            forecasts.append(column);
            $("#five-day").append(forecasts);
            if (days>5){                
              return; 
            }
          }
        }
      }
    });

}

function currentDayWeather(city) {
  
  currentDayQueryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + appid;
  $.ajax({
    url: currentDayQueryURL,
    method: "GET"
  }).then(function(response) {

    lon = JSON.parse(JSON.stringify(response.coord.lon));
    lat = JSON.parse(JSON.stringify(response.coord.lat));

    city = JSON.parse(JSON.stringify(response.name));
    if (!cityArr.includes(city)) {
    addCity(city);
    displayCities();
    }

    var today = new Date();
    
    $("#current-day").empty();

    card = $("<div>");
    card.addClass("card text-light");
    card.attr("id","current-card");

    cardBody = $("<div>");
    cardBody.addClass("card-body");
    cardBody.attr("id","current-card-body");
    
    cardTitle = $("<h5>");
    cardTitle.addClass("card-title");

    weatherImg = $("<img>");
    weatherImg.attr("src","https://openweathermap.org/img/wn/" + JSON.parse(JSON.stringify(response.weather[0].icon)) + "@2x.png");

    cardTitle.text(JSON.parse(JSON.stringify(response.name)) + " (" + today.toLocaleDateString() +")");
    cardTitle.append(weatherImg);
    
    cardTemp = $("<p>");
    cardTemp.addClass("card-text");
    cardTemp.text("Temperature: " + JSON.parse(JSON.stringify(response.main.temp)) +" \xB0F");

    cardHumidity = $("<p>");
    cardHumidity.addClass("card-text");
    cardHumidity.text("Humidity: " + JSON.parse(JSON.stringify(response.main.humidity)) +" %");

    cardWind = $("<p>");
    cardWind.addClass("card-text");
    cardWind.text("Wind Speed: " + JSON.parse(JSON.stringify(response.wind.speed)) +" MPH");
    
    cardBody.append(cardTitle);
    cardBody.append(cardTemp);
    cardBody.append(cardHumidity);
    cardBody.append(cardWind);
    card.append(cardBody);

    $("#current-day").append(card);

    uvQueryURL ="https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +"&appid=" +appid;
    $.ajax({
      url: uvQueryURL,
      method: "GET"
    }).then(function(response) {
      uvIndex = JSON.parse(JSON.stringify(response.value))
      cardUVIndex = $("<p>");
      cardUVIndex.addClass("card-text");
      cardUVIndex.text("UV Index: ");
      span = $("<span>");
      span.text(uvIndex);
      if (uvIndex <=2){
        span.addClass("bg-success p-2 rounded");
      }
      else if (uvIndex>2 & uvIndex <=5) {
        span.addClass("bg-warning p-2 rounded");
      }
      else {
        span.addClass("bg-danger p-2 rounded");
      }

      cardUVIndex.append(span);
      currentCardBody = $("#current-card-body");
      currentCardBody.append(cardUVIndex);
      currentCard = $("#current-card");
      currentCard.append(currentCardBody);
      $("#current-day").append(currentCard);
  
    });

  });
}


// Displaying Array of cities searched for
function displayCities() {
  $("#cities-list").empty();  
  for (i=0;i<cityArr.length;i++) {
    button = $("<button>");
    button.addClass("city-name btn btn-outline-secondary btn-block");
    button.text(cityArr[i]);
    $("#cities-list").append(button);
  }
}

// Search input functions
document.addEventListener('click', function(event) {
  if (event.target.id === "submit-city") {
    city = $("#city-input").val();
    currentDayWeather(city);
    dailyWeather(city);
  }
  eraseText();
});

document.addEventListener('keypress', function(event) {
  if (event.target.id === "city-input" & event.keyCode===13) {
    city = $("#city-input").val();
    currentDayWeather(city);
    dailyWeather(city);
    eraseText();
  }

});


document.addEventListener('click', function(event) {
  if (event.target.className.split(" ")[0] === "city-name") {
    currentDayWeather(event.target.innerText);
    dailyWeather(event.target.innerText);

  }
  eraseText();
});

// Erase input text
function eraseText() {
    $("#city-input").val("");
}
// Adding locations to local Storage and City Array
function addCity(city) {
    cityArr.push(city);
    localStorage.setItem('City',city);
    localStorage.setItem('Cities',cityArr);
  }

//   Potential Additional functionality

// function addCities(){
//     // for( var i = 0; i < cityArr.length, i++)
//     localStorage.setItem('Cities',cityArr);
// }
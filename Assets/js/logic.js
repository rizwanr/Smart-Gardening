//On-click event handler (clear-button)
$(document).ready(function() {
  $('#clear-all').on('click', clear);

  //Clear function
  function clear() {
    $('#map-container-google-1').empty();
  }
  console.log('hi');
  //-------------------------------------------------------------------------

  //Geting data from the weather api
  $('#run-search').on('click', function(event) {
    console.log('clicked');
    event.preventDefault();
    var state = 'Ontario';

    var country = 'Canada';
    console.log(country);
    var queryURL = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=6967235c37d54f578f004147190807&q=${state},%20${country}&format=json&num_of_days=14`;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);

      var weather = response.data.weather;
      var arrayOfWeatherChances = [];

      console.log(weather);
      for (var i = 0; i < weather.length; i++) {
        var hourly = weather[i].hourly;
        var date = response.data.weather[i].date;
        console.log(hourly, date);
        var totalChancesOfRainPerDay = 0;
        for (var k = 0; k < hourly.length; k++) {
          var chanceOfRain = hourly[k].chanceofrain;
          totalChancesOfRainPerDay += parseInt(chanceOfRain);
          // totalChancesOfRain += parseInt(chanceOfRain)
          // var averageTotalChancesOfRain = totalChancesOfRain / 8
          // console.log(averageTotalChancesOfRain)
        }
        arrayOfWeatherChances.push(totalChancesOfRainPerDay / hourly.length);
        console.log(arrayOfWeatherChances);
      }
      // Calculate average for th
    });
  });
  //-------------------------------------------------------------------------
});

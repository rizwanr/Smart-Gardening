//On-click event handler (clear-button)
// $(document).ready(function() {
// $('#clear-all').on('click', clear);

// //Clear function
// function clear() {
//   $('#map-container-google-1').empty();
// }

//-------------------------------------------------------------------------
// variables for google map- intitialize varabiles to Toronto coordinates-100 queen st, toronto, canada
var latp = 43.6534;
var lngp = -79.384;
//---------------------------------------------------

//Geting data from the weather api
$('#run-search').on('click', function(event) {
  console.log('clicked');
  event.preventDefault();

  // get the user input
  var address = $('#address')
    .val()
    .trim();
  var city = $('#city')
    .val()
    .trim();
  var country = $('#country')
    .val()
    .trim();

  // url for the weather api
  var queryURL = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=6967235c37d54f578f004147190807&q=${city},%20${country}&format=json&num_of_days=14`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response);

    var weather = response.data.weather;
    var arrayOfWeatherChances = [];
    var arrayOfDate = [];

    console.log(weather);
    for (var i = 0; i < weather.length; i++) {
      var hourly = weather[i].hourly;
      var date = response.data.weather[i].date;
      arrayOfDate.push(date);
      console.log(arrayOfDate);
      console.log(hourly, date);
      var totalChancesOfRainPerDay = 0;
      for (var k = 0; k < hourly.length; k++) {
        var chanceOfRain = hourly[k].chanceofrain;
        totalChancesOfRainPerDay += parseInt(chanceOfRain);
      }
      arrayOfWeatherChances.push(totalChancesOfRainPerDay / hourly.length);
      console.log(arrayOfWeatherChances);

      chancesOfRainChart(arrayOfDate, arrayOfWeatherChances);
    }
  });

  //Charjs implementation

  function chancesOfRainChart(arrayOfDate, arrayOfWeatherChances) {
    var canvas = document.getElementById('myChart');
    var data = {
      labels: [...arrayOfDate],
      datasets: [
        {
          label: '% Chances of Rain',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
          data: [...arrayOfWeatherChances]
        }
      ]
    };

    function adddata() {
      myLineChart.data.datasets[0].data[7] = 60;
      myLineChart.update();
    }

    var option = {
      showLines: true
    };
    var myLineChart = Chart.Line(canvas, {
      data: data,
      options: {
        // This chart will not respond to mousemove, etc
        events: ['click']
      }
    });
  }

  //----------------------------------------
  //Geocoding api-when the user clicks the submit button,
  // the api gets the address and then returns lat and lng coordinate

  // var country = "Canada";
  // var city="toronto";
  // var address="80 Wellesley street East"

  var queryURL =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    address +
    '+' +
    city +
    ',' +
    country +
    '&key=AIzaSyBm2fr000GAejpxrGoz6ySrEdWSVlhubfY';
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response);

    latp = response.results[0].geometry.location.lat;
    lngp = response.results[0].geometry.location.lng;
    initMap();
  });
});
//-------------------------------------------------------------------------
// get lan and lat from the geocoding api and use it in function initmap
function initMap() {
  // The location of Uluru
  var uluru = { lat: latp, lng: lngp };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  }); //change the zoom from 4 to 15
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: uluru, map: map });
  console.log(map);
}

// });

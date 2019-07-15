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

$(document).ready(function() {
  //---------------------------------------------------
  var arrayOfRainChances = [];
  var arrayOfDate = [];
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

      console.log(weather);
      arrayOfDate = [];
      arrayOfRainChances = [];

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
        arrayOfRainChances.push(totalChancesOfRainPerDay / hourly.length);
        console.log(arrayOfRainChances);
        $('#chart').css('display', 'block');
        chancesOfRainChart(arrayOfDate, arrayOfRainChances);
      }
    });

    //Charjs implementation

    function chancesOfRainChart(arrayOfDate, arrayOfRainChances) {
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
            data: [...arrayOfRainChances]
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

      waterPlantOnWhichDay(arrayOfDate, arrayOfRainChances);
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
  // Google NEWS API
  var url =
    'https://newsapi.org/v2/everything?' +
    'q=gardening&' +
    'from=2019-07-13&' +
    'sortBy=popularity&' +
    'apiKey=e89f01e7b8194e1192efb1cde86c7a4d';

  $.ajax({
    url: url,
    method: 'GET'
  }).then(updatePage);
});

// get lan and lat from the geocoding api and use it in function initmap
function initMap() {
  // The location of Uluru
  var uluru = {
    lat: latp,
    lng: lngp
  };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  }); //change the zoom from 4 to 15
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
  console.log(map);
}

function waterPlantOnWhichDay(arrayOfDate, arrayOfRainChances) {
  console.log(arrayOfDate.length);
  console.log(arrayOfRainChances.length);

  // while (arrayOfDate.length) {
  //   results.push(arrayOfDate.splice(0, 6));
  //   console.log(results);
  // }
  var sevenDays = arrayOfDate.length / 2;
  console.log(sevenDays);
  var firstWeek = arrayOfDate.slice(0, sevenDays);
  var secondWeek = arrayOfDate.slice(sevenDays);
  console.log(firstWeek);
  console.log(secondWeek);

  var chancesOfRainforAWeek = arrayOfRainChances.length / 2;
  var chancesOfRainforFirstWeek = arrayOfRainChances.slice(
    0,
    chancesOfRainforAWeek
  );
  console.log(chancesOfRainforFirstWeek);
  var chancesOfRainforSecondWeek = arrayOfRainChances.slice(
    chancesOfRainforAWeek
  );
  console.log(chancesOfRainforSecondWeek);

  var dayOfRainOnFirstWeek = indexAtSeventyAboveChanceOfRainForWeek(
    chancesOfRainforFirstWeek
  );
  var dayOfRainOnSecondWeek = indexAtSeventyAboveChanceOfRainForWeek(
    chancesOfRainforSecondWeek
  );

  console.log(dayOfRainOnFirstWeek);

  if (dayOfRainOnFirstWeek === undefined) {
    $('#first-week-result').text(`Seems like the weather Gods are unhappy`);
    var calenderFirstWeek = $('#firstWeekCalenderId');
    calenderFirstWeek.css('display', 'block');
    var firstDateOfFirstWeek;
    var lastDateOfFirstWeek;
    setTimeout(() => {
      firstDateOfFirstWeek = firstWeek[0].replace(/-/g, '');
      lastDateOfFirstWeek = firstWeek[6].replace(/-/g, '');

      var url = `https://calendar.google.com/calendar/r/eventedit?text=WATER+GARDEN+REMINDER&dates=${firstDateOfFirstWeek}T160000Z/${lastDateOfFirstWeek}T010000Z&location=HOME&sf=true`;
      calenderFirstWeek.attr('href', url, '_blank');

      console.log(firstDateOfFirstWeek, lastDateOfFirstWeek);
    }, 4000);
  } else {
    $('#first-week-result').text(
      `There is a high probablity of rain on ${firstWeek[dayOfRainOnFirstWeek]}`
    );
    $('#firstWeekCalenderId').css('display', 'none');
  }

  if (dayOfRainOnSecondWeek === undefined) {
    $('#second-week-result').text(`Seems like the weather Gods are unhappy`);
    var calenderSecondWeek = $('#secondWeekCalenderId');
    calenderSecondWeek.css('display', 'block');
    var firstDateOfSecondWeek;
    var lastDateOfSecondWeek;
    setTimeout(() => {
      firstDateOfSecondWeek = secondWeek[0].replace(/-/g, '');
      lastDateOfSecondWeek = secondWeek[6].replace(/-/g, '');

      var url = `https://calendar.google.com/calendar/r/eventedit?text=WATER+GARDEN+REMINDER&dates=${firstDateOfSecondWeek}T160000Z/${lastDateOfSecondWeek}T010000Z&location=HOME&sf=true`;
      calenderSecondWeek.attr('href', url);

      console.log(firstDateOfSecondWeek, lastDateOfSecondWeek);
    }, 4000);
  } else {
    $('#second-week-result').text(
      `There is a high probablity of rain on ${
        secondWeek[dayOfRainOnSecondWeek]
      }`
    );
    $('#secondWeekCalenderId').css('display', 'none');
  }
}

function indexAtSeventyAboveChanceOfRainForWeek(chancesOfRainforWeek) {
  var indexAthigestChanceOfRain = 0;

  for (var i = 1; i < chancesOfRainforWeek.length; i++) {
    if (chancesOfRainforWeek[i] >= 70) {
      //console.log((max = chancesOfRainforWeek[i]));
      return (indexAthigestChanceOfRain = i);
    }
  }
}

//Function update the "news" section

function updatePage(response) {
  var numArticles = 3;

  //var articleName = response.articles[0].title;
  //$("#news").text(articleName);

  for (var i = 0; i < numArticles; i++) {
    var article = response.articles[i];

    var $articleList = $('#news');

    //var headline = article.title;
    var $articleListItem = $("<li class='list-group-item articleHeadline'>");

    var articleName = article.title;
    $articleListItem.append(articleName);

    $articleListItem.append(
      "<a href='" + article.url + "'>" + article.url + '</a>'
    );

    $articleList.append($articleListItem);
    $('#news').append($articleList);
  }
}

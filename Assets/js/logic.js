
//On-click event handler (clear-button)
$("#clear-all").on("click", clear);

//Clear function
function clear() {
    $("#map-container-google-1").empty();
    
}


//-------------------------------------------------------------------------

//Geting data from the weather api

$("#run-search").click(function(event){

    event.preventDefault();
    
    var apiKey="20f50484ba7080a02c3ba933dcafcc36";
    var zip=$("#zip").val().trim();
    var city="Toronto";
    var Country="Canada";
    var queryUrl= "https://api.openweathermap.org/data/2.5/forecast?q="+city+","+Country+"&zip="+zip+"&appid="+apiKey;
      

    $.ajax({
        url: queryUrl,
        method:"GET",
    }).then(function(response){

            console.log(queryUrl);
            var temp=response.list[0].main.temp;               // temperture 
            var weather=response.list[0].weather[0].main;       // weather: it is rainy, clear,..

            console.log(temp);
            console.log(weather);

    });

});

//-------------------------------------------------------------------------

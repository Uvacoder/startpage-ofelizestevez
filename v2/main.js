function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getWeather);
    }else{
        alert("Geolocation not supported by this browser");
    }
}

function getWeather(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let API_KEY = "3446b1a13bc44115410f12384b45e484";
    let baseURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`;
    console.log(baseURL)

    $.get(baseURL,function(res){
        let data = res.current;
        let temp_2 = Math.round(data.temp);
        let condition = data.weather[0].main;
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        $('#temp').html(`${temp_2}°`);
        $('#condition').html(condition);
        console.log(icon)
    })

    
}

function process()
{
var url="http://reddit.com/r/" + document.getElementById("url").value;
location.href=url;
return false;
}

getLocation();


const outputData = document.querySelector("#outputData");
const saveTrip = document.querySelector("#save");
const deleteTrip = document.querySelector("#delete");
const form = document.querySelector("#form");

//user inputs
const dest = document.querySelector('input[name="destiny"]');
const depDate = document.querySelector('input[name="date"]');

// geo names API credential
const geo = 'http://api.geonames.org/searchJSON?q=';
const username = "rishabhkeshan";

// weatherBit API credentials
const WBAPIURL = "https://api.weatherbit.io/v2.0/forecast/daily?lat=";
const WBAPIkey = "&days=16&key=e29a2361278f4073beea0df49d8b42a6";

//pixabay API credentials
const pixaURL = "https://pixabay.com/api/?key=";
const pixaAPIkey = "1152002-28faf189e53595474e698ee85";

// get data from user inputs
export function getData(event) {
  event.preventDefault();
  const destination = dest.value;
  const depDateText = depDate.value;
  const currentTime = (Date.now()) / 1000;
  const journeyTime = (new Date(depDateText).getTime()) / 1000;
  const daysToGo = Math.round((journeyTime - currentTime) / 86400);
  if(daysToGo<0 || daysToGo>16)
  {
    alert("Enter date within next 16 days");
  }
  else{
  // function checkInput to validate input 
  if(Client.RegexCheck( destination))
    {
    getLongLat(geo, destination, username)
      .then(function(data){
        // we take the details of the first destination returned by the api
        const country = data.geonames[0].countryName;
        const Data = getWeather(data.geonames[0].lat, data.geonames[0].lng)
        return Data;
      })
      .then((Data) => {  
        //here we take the weather forecast by utilizing the no. of days left to go consant.
        const userData = postData('/TravelData', {
          destination,
          depDateText,
          minTemp: Data.data[daysToGo].app_min_temp,
          maxTemp: Data.data[daysToGo].app_max_temp, forecast: Data.data[daysToGo].weather.description,
          daysToGo
        });
        return userData;
      }).then((data) => {
        updateUI(data);
      })
    }
    else{
      alert("Enter valid destination.")
    }
  }
}


//get latitude, longitude of country
export const getLongLat = async (geo, destination, username) => {
  const request = await fetch(geo + destination + "&maxRows=2&username=" + username);
  try {
    const data = await request.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// function getWeather to get weather information from Dark Sky API 

export const getWeather = async (cityLat, cityLong) => {
  const request = await fetch(WBAPIURL+cityLat+"&lon="+cityLong+WBAPIkey);
  try {
    const data = await request.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

// POST user data
export const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      destination : data.destination,
      depDate: data.depDateText,
      maxTemp:data.maxTemp,
      minTemp: data.minTemp,
      forecast: data.forecast,
      daysToGo: data.daysToGo
    })
  })
   try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error", error);
    }
 };

// Adding output from different APIs in the website

export const updateUI = async (data) => {
  outputData.classList.remove("hidden");
  outputData.scrollIntoView({ behavior: "smooth" });
  const request = await fetch(pixaURL + pixaAPIkey + "&q=" + data.destination + "+city&image_type=photo&pretty=true&category=places");

  try {
    const imageLink = await request.json();
    document.querySelector("#city").innerHTML = data.destination;
    document.querySelector("#dest").innerHTML = data.destination;
    document.querySelector("#date").innerHTML = data.depDate.split("-").reverse().join(" / ");
    document.querySelector("#days").innerHTML = data.daysToGo;
    document.querySelector("#summary").innerHTML = data.forecast;
    document.querySelector("#maxtemp").innerHTML = data.maxTemp;
    document.querySelector("#mintemp").innerHTML = data.minTemp;
    document.querySelector("#PixabayImage").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}

// EVENT LISTENER functions

// form submit
form.addEventListener('submit', getData);

// save trip button 
saveTrip.addEventListener('click', function (evt) {
  window.print();
  location.reload();
});

// delete button
deleteTrip.addEventListener('click', function (evt) {
  form.reset();
  outputData.classList.add("hidden");
  location.reload();
})
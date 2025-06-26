const OPENWEATHER_API_KEY = "7a1b23c456example";
const IQAIR_API_KEY = "1234abcd5678example";
const city = "Hyderabad";
const state = "Telangana";
const country = "India";

async function fetchWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`);
  const data = await res.json();
  return {
    temp: (data.main.temp - 273.15).toFixed(1),
    humidity: data.main.humidity
  };
}

async function fetchAQI() {
  const res = await fetch(`https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${IQAIR_API_KEY}`);
  const data = await res.json();
  return {
    aqi: data.data.current.pollution.aqius
  };
}

Promise.all([fetchWeather(), fetchAQI()]).then(([weather, air]) => {
  const label = `Temp: ${weather.temp}°C | Humidity: ${weather.humidity}% | AQI: ${air.aqi}`;
  document.getElementById("envData").innerText = label;

  const ctx = document.getElementById("envChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Temp (°C)", "Humidity (%)", "AQI"],
      datasets: [{
        label: "Environment Data",
        data: [weather.temp, weather.humidity, air.aqi],
        backgroundColor: ["#4caf50", "#2196f3", "#f44336"]
      }]
    }
  });

  // Share message
  const shareText = `In ${city}, it's ${weather.temp}°C with ${weather.humidity}% humidity and AQI of ${air.aqi}. Stay aware!`;
  document.getElementById("twitterShare").href =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  document.getElementById("linkedinShare").href =
    `https://www.linkedin.com/sharing/share-offsite/?url=https://yourdashboard.com`;
}).catch(err => {
  document.getElementById("envData").innerText = "Error loading data.";
  console.error(err);
});

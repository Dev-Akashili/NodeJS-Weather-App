const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const apiKey = apiKey;

  // open weather API
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric&appid=" + apiKey;

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      res.render('404');
      return
    }

    console.log(response.statusCode);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp
      const icon = weatherData.weather[0].icon
      const country = weatherData.sys.country
      const elements = weatherData.weather[0].description
      const status = weatherData.wind.speed
      const humidity = weatherData.main.humidity
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(temp);

        res.render('weather', {
          city: query,
          temp: temp,
          icon: imageURL,
          country: country,
          elements: elements,
          status: status,
          humidity: humidity,
        });

    });

  });

});

// failure page
app.post('/failure', (req, res)=>{
  res.redirect('/');
});

app.listen(process.env.PORT);

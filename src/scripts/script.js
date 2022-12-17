if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  document.getElementById("demo").innerHTML =
    "Geolocation is not supported by this browser.";
}

let weather = {
  apiKey: "351a04d4c36615d6cf9abc08a96b4615",
  getWeather: (city) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},id&appid=${weather.apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => weather.displayWeather(data))
  },
  displayWeather: (data) => {
    const { name } = data
    const { icon, description } = data.weather[0]
    const { temp, humidity } = data.main
    const { speed } = data.wind
    document.querySelector("#city").innerText = name
    document.querySelector("#icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    document.querySelector("#description").innerText = description
    document.querySelector("#temp").innerText = `${temp} °C`
    document.querySelector("#humidity").innerText = `${humidity}%`
    document.querySelector("#speed").innerText = `${speed} km/j`
    document.querySelector("#condition").classList.remove("visually-hidden")
  },
  search: () => {
    weather.getWeather(document.querySelector("#searchInput").value)
  }
};

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  console.log(lat, long);
  generateMap(lat, long);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weather.apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => weather.displayWeather(data))

}

let eraseField = () => {
  document.getElementsByName("searchInput")[0].value = ''
}

document.querySelector("#search").addEventListener("click", () => {
  Swal.fire({
    title: 'Mencari data',
    html: 'Mohon tunggu <b></b> milliseconds.',
    timer: 750,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
  setTimeout(weather.search, 750)
  setTimeout(eraseField, 1000)
})

let map = null,
  marker = null;

function generateMap(lat, long) {
  // Initialize the map and assign it to a variable for later use
  // there's a few ways to declare a VARIABLE in javascript.
  // you might also see people declaring variables using `const` and `let`
  if (!map) {
    map = L.map('map', {
      // Set latitude and longitude of the map center (required)
      center: [lat, long],
      // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
      zoom: 11
    });
  } else {
    map.setView([lat, long], 11);
  }


  // Create a Tile Layer and add it to the map
  var tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '8'
  }).addTo(map);

  marker = L.marker(
    [lat, long],
    {
      draggable: true,
      title: "",
      opacity: 0.75
    });

  marker.addTo(map);
  marker.on('dragend', function (e) {
    lat = e.target._latlng.lat;
    lng = e.target._latlng.lng;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weather.apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => weather.displayWeather(data))
  })
}

const date = new Date()
const year = date.getFullYear()
document.getElementById('date').innerHTML = year
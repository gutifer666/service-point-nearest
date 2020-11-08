var myHeaders = new Headers()
myHeaders.append('DHL-API-Key', 'R9JML1tObzFgF8te7Yzwf6XQyzSvKE38')

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
}

navigator.geolocation.getCurrentPosition(function (position) {
    fetch(
        `https://api.dhl.com/location-finder/v1/find-by-geo?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&locationType=servicepoint&radius=2500&limit=20`,
        requestOptions
    )
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data);
            showMap(position.coords.latitude,position.coords.longitude,data)
        })
        .catch((error) => {
            console.log('Error', error.message)
        })
})

function showMap(latitude, longitude, data) {
    let map = L.map("map").setView([latitude, longitude], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(map);
    let marker1 = L.marker([latitude, longitude])
      .addTo(map)
    let popup = L.popup()
      .setLatLng([data.locations[0].place.geo.latitude, data.locations[0].place.geo.longitude])
      .setContent(`<h3>${data.locations[0].name}</h3>
                    <p>De ${data.locations[0].openingHours[0].opens} a ${data.locations[0].openingHours[0].closes}</p>
                    <p>${data.locations[0].place.address.streetAddress}</p>`)
      .openOn(map);
  }
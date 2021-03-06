let myHeaders = new Headers();
myHeaders.append("DHL-API-Key", "Your Customer Key");
let requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

navigator.geolocation.getCurrentPosition(function (position) {
  fetch(
    `https://api.dhl.com/location-finder/v1/find-by-geo?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&locationType=servicepoint&radius=2500&limit=20`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showMap(position.coords.latitude, position.coords.longitude, data);
    })
    .catch((error) => {
      console.log("Error", error.message);
    });
});

function showMap(latitude, longitude, data) {
  let map = L.map("map").setView([latitude, longitude], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  }).addTo(map);
  
  L.marker([latitude, longitude]).addTo(map);

  let servicePointIcon = L.icon({
    iconUrl: "../img/storefront-24px.svg",
    iconSize: [36, 36],
  });
  L.marker(
    [
      data.locations[0].place.geo.latitude,
      data.locations[0].place.geo.longitude,
    ],
    {
      icon: servicePointIcon,
    }
  ).addTo(map);
  
  document.getElementById("name").innerHTML = data.locations[0].name;
  document.getElementById("openHour").innerHTML = `Abre: ${data.locations[0].openingHours[0].opens}`;
  document.getElementById("closeHour").innerHTML = `Cierra: ${data.locations[0].openingHours[0].closes}`;
  document.getElementById("address").innerHTML = data.locations[0].place.address.streetAddress;
  document.getElementById("distance").innerHTML = `Distancia: ${data.locations[0].distance} metros`;
}

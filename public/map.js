var center = [-10.689457, 142.531821];

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
});
var google = L.tileLayer(
  "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
  {
    attribution: "google",
  }
);

var map = L.map("map").setView(center, 17);
osm.addTo(map);

var drawnItems = new L.FeatureGroup();
drawnItems.addTo(map);
var markerOverlays = new L.FeatureGroup();
markerOverlays.addTo(map);

L.control
  .layers(
    {
      Map: osm,
      Satellite: google,
    },
    { "Show overlays": drawnItems },
    { position: "topleft", collapsed: false }
  )
  .addTo(map);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  },
  draw: {
    polygon: {
      allowIntersection: false,
      allowOverlap: false,
      showArea: true,
    },
  },
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, (e) => {
  switch (e.layerType) {
    case "polyline":
    case "marker":
    case "circlemarker":
      break;
    case "polygon":
    case "rectangle":
    case "circle":
      let polyType = prompt(
        "What is in this area?",
        "fire, water, coral or type another message to show."
      );
      let layerGeo = e.layer.getLatLngs();
      console.log(layerGeo);
      latLng = layerGeo[0].map((x) => [x.lat, x.lng]);
      console.log(latLng);
      $.post("newPoly", { poly: latLng, polyType: polyType }, (response) => {
        console.log(response);
      });
      break;
  }

  updateMap();
});

var fireIcon = L.icon({
  iconUrl: "/assets/images/fireIcon.png",
  iconSize: [48, 65.48], // size of the icon
});

var waterIcon = L.icon({
  iconUrl: "/assets/images/waterIcon.png",
  iconSize: [48, 48], // size of the icon
});

var coralIcon = L.icon({
  iconUrl: "/assets/images/coralIcon.png",
  iconSize: [48, 48], // size of the icon
});

function updateMap() {
  $.post("/getData", (response) => {
    drawnItems.clearLayers();
    markerOverlays.clearLayers();
    response.forEach((poly) => {
      var newPoly, newMarker;
      switch (poly.type) {
        case "fire":
          newPoly = L.polygon(poly.data, {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.5,
          });
          newMarker = L.marker(newPoly.getBounds().getCenter(), {
            icon: fireIcon,
          });
          console.log("here");
          break;
        case "water":
          newPoly = L.polygon(poly.data, {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.5,
          });
          newMarker = L.marker(newPoly.getBounds().getCenter(), {
            icon: waterIcon,
          });
          break;
        case "coral":
          newPoly = L.polygon(poly.data, {
            color: "orange",
            fillColor: "orange",
            fillOpacity: 0.5,
          });
          newMarker = L.marker(newPoly.getBounds().getCenter(), {
            icon: coralIcon,
          });
          break;
        case "seagrass":
          newPoly = L.polygon(poly.data, {
            color: "green",
            fillColor: "green",
            fillOpacity: 0.5,
          });

          break;
        case "plants":
          newPoly = L.polygon(poly.data, {
            color: "yellow",
            fillColor: "yellow",
            fillOpacity: 0.5,
          });
          break;
        default:
          newPoly = L.polygon(poly.data, {
            color: "violet",
            fillColor: "violet",
            fillOpacity: 0.5,
          });
      }
      newPoly.bindPopup(poly.type);

      //TODO: seagrass, plants
      newPoly.addTo(drawnItems);
      newMarker.addTo(markerOverlays);
    });
  });
}

updateMap();
// setTimeout(() => {
//   updateMap();
// }, 1000);

// class polygonWithIcon {
//   constructor(polygon, icon, color) {
//     this.polygon = L.polygon(polygon, {
//       color: color,
//       fillColor: color,
//       fillOpacity: 0.5,
//     });
//     this.marker = L.marker(this.polygon.getBounds().getCenter(), {
//       icon: icon,
//     });
//     this.group = L.featureGroup([this.polygon, this.marker]);
//   }

//   addTo(map) {
//     this.group.addTo(map);
//   }

//   bindPopup(content) {
//     this.group.bindPopup(content);
//   }
// }

// class firePoly extends polygonWithIcon {
//   constructor(polygon) {
//     super(polygon, fireIcon, "red");
//   }
// }

// class waterPoly extends polygonWithIcon {
//   constructor(polygon) {
//     super(polygon, waterIcon, "blue");
//   }
// }

// class coralPoly extends polygonWithIcon {
//   constructor(polygon) {
//     super(polygon, coralIcon, "green");
//   }
// }

// let fire1Pos = [
//   [-10.689277, 142.531764],
//   [-10.689966, 142.53268],
//   [-10.691178, 142.532419],
//   [-10.690155, 142.531786],
// ];
// let fire1 = new firePoly(fire1Pos);
// fire1.bindPopup("<b>Fire!</b><br>Stay away.");
// fire1.addTo(map);

// let water1Pos = [
//   [-10.69013, 142.53339],
//   [-10.69056, 142.53384],
//   [-10.69057, 142.53323],
// ];
// let water1 = new waterPoly(water1Pos);
// water1.bindPopup("Water source");
// water1.addTo(map);

// let coral1Pos = [
//   [-10.68893, 142.53081],
//   [-10.68956, 142.531],
//   [-10.69012, 142.53135],
//   [-10.69083, 142.5316],
//   [-10.69131, 142.53168],
//   [-10.69106, 142.53068],
//   [-10.69033, 142.53052],
// ];
// let coral1 = new coralPoly(coral1Pos);
// coral1.bindPopup("Coral");
// coral1.addTo(map);

// let marker1 = L.marker([-10.68778, 142.53159]);
// marker1.bindPopup("Custom marker");
// marker1.addTo(map);

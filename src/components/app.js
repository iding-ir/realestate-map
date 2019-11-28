import React, { Component } from "react";
import "./app.css";
import $ from "jquery";
import Mapcraft from "../mapcraft";
import Search from "./search";
import Tour from "./tour";
import Page from "./page";

class App extends Component {
  state = {
    types: [
      { slug: "house", name: "House", checked: true },
      { slug: "apartment", name: "Apartment", checked: true },
      { slug: "shared", name: "Shared", checked: true },
      { slug: "dorm", name: "Dorm", checked: true }
    ],
    rooms: [
      { slug: "one", name: "One", checked: false },
      { slug: "two", name: "Two", checked: false },
      { slug: "more", name: "More", checked: false },
      { slug: "any", name: "Any", checked: true }
    ],
    areas: {
      from: 30,
      to: 150
    },
    rents: {
      from: 5000,
      to: 20000
    },
    deposits: {
      from: 10000,
      to: 100000
    },
    places: {
      type: "FeatureCollection",
      features: []
    },
    tourActive: false,
    tourIndex: 0,
    pageVisible: false,
    page: {}
  };

  componentDidMount() {
    this.InitializeMap();
  }

  render() {
    let numberOFPlaces = this.state.places.features.length;
    let lastIndex = numberOFPlaces - 1;

    return (
      <div className="app">
        <div id="app-map"></div>

        <div className="sc-slide">
          <Search
            types={this.state.types}
            rooms={this.state.rooms}
            areas={this.state.areas}
            rents={this.state.rents}
            deposits={this.state.deposits}
            onChangeType={this.handleChangeType}
            onChangeRoom={this.handleChangeRoom}
            onChangeArea={this.handleChangeArea}
            onChangeRent={this.handleChangeRent}
            onChangeDeposit={this.handleChangeDeposit}
            onChangeTour={this.handleChangeTour}
            getPlacesCount={this.getPlacesCount}
            disableTour={numberOFPlaces === 0}
          />
        </div>

        <div className={this.getTourControlsClasses()}>
          <Tour
            disableRestart={this.state.tourIndex <= 0}
            disableNext={this.state.tourIndex >= lastIndex}
            disablePrev={this.state.tourIndex <= 0}
            onChangeTour={this.handleChangeTour}
          />
        </div>

        <div
          className={this.getPageOverlayClasses()}
          onClick={() => {
            this.handleClosePage();
          }}
        >
          <Page page={this.state.page} onClosePage={this.handleClosePage} />
        </div>
      </div>
    );
  }

  handleClosePage = () => {
    let pageVisible = false;

    this.setState({ pageVisible });
  };

  getTourControlsClasses = () => {
    let classes = "app-tour-controls sc-grid-4";

    if (this.state.tourActive) classes += " is-visible";

    return classes;
  };

  getPageOverlayClasses = () => {
    let classes = "app-page-overlay";

    if (this.state.pageVisible) classes += " is-visible";

    return classes;
  };

  getPlacesCount = () => {
    let features = this.state.places.features;

    return features.length ? features.length : "No";
  };

  handleFilter = () => {
    let { types, rooms, areas, rents, deposits } = this.state;

    let filters = [
      "all",
      [">=", "area", areas.from],
      ["<=", "area", areas.to],
      [">=", "rent", rents.from],
      ["<=", "rent", rents.to],
      [">=", "deposit", deposits.from],
      ["<=", "deposit", deposits.to]
    ];

    let typesFilter = types
      .filter(item => item.checked)
      .reduce(
        (total, current) => {
          total.push(["==", "type", current.slug]);

          return total;
        },
        ["any"]
      );

    filters.push(typesFilter);

    let roomsFilter = rooms
      .filter(item => item.checked)
      .reduce(
        (total, current) => {
          if (current.slug === "one") total.push(["==", "rooms", 1]);
          if (current.slug === "two") total.push(["==", "rooms", 2]);
          if (current.slug === "more") total.push([">", "rooms", 2]);
          if (current.slug === "any") total.push([">=", "rooms", 0]);

          return total;
        },
        ["any"]
      );

    filters.push(roomsFilter);

    this.mapcraft.map.setFilter("point-symbol-places", filters);
  };

  handleGeoJson = () => {
    let { types, rooms, areas, rents, deposits } = this.state;

    let selectedTypes = types
      .filter(type => type.checked)
      .map(type => type.slug);

    let selectedRooms = rooms
      .filter(room => room.checked)
      .map(room => room.slug);

    let places = { ...this.mapcraft.geoJsons.places };

    let features = places.features.filter(feature => {
      let { type, rooms, area, rent, deposit } = feature.properties;

      if (
        selectedTypes.includes(type) &&
        area >= areas.from &&
        area <= areas.to &&
        rent >= rents.from &&
        rent <= rents.to &&
        deposit >= deposits.from &&
        deposit <= deposits.to
      ) {
        if (
          (rooms === 1 && selectedRooms.includes("one")) ||
          (rooms === 2 && selectedRooms.includes("two")) ||
          (rooms > 2 && selectedRooms.includes("more")) ||
          selectedRooms.includes("any")
        ) {
          return true;
        }
      }

      return false;
    });

    places.features = features;

    this.setState({ places });

    if (places.features.length)
      this.mapcraft.fitBounds({
        geoJson: places
      });
  };

  handleChangeType = event => {
    let slug = $(event.target).attr("data-type");
    let types = [...this.state.types].map(type => {
      if (type.slug === slug) type.checked = $(event.target).is(":checked");

      return type;
    });

    this.setState({ types });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeRoom = event => {
    let slug = $(event.target).attr("data-room");
    let rooms = [...this.state.rooms].map(room => {
      room.checked = room.slug === slug ? true : false;

      return room;
    });

    this.setState({ rooms });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeArea = value => {
    let areas = { ...this.state.areas };

    areas.from = value.min;
    areas.to = value.max;

    this.setState({ areas });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeRent = value => {
    let rents = { ...this.state.rents };

    rents.from = value.min;
    rents.to = value.max;

    this.setState({ rents });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeDeposit = value => {
    let deposits = { ...this.state.deposits };

    deposits.from = value.min;
    deposits.to = value.max;

    this.setState({ deposits });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeTour = action => {
    let features = this.state.places.features;
    let lastIndex = features.length - 1;
    let tourActive = this.state.tourActive;
    let tourIndex = this.state.tourIndex;

    $(".sc-slide").removeClass("sc-is-open");

    if (action === "start-tour") {
      tourActive = true;

      tourIndex = 0;
    }

    if (action === "end-tour") {
      tourActive = false;

      tourIndex = 0;

      this.mapcraft.closePopup();

      $(".sc-slide").addClass("sc-is-open");
    }

    if (action === "restart") tourIndex = 0;

    if (action === "next" && tourIndex < lastIndex) tourIndex += 1;

    if (action === "prev" && tourIndex > 0) tourIndex -= 1;

    if (tourActive) {
      let feature = features[tourIndex];

      let lnglat = {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1]
      };

      this.mapcraft.flyTo({
        lnglat: lnglat,
        zoom: 15
      });

      this.openPopup(feature.properties, lnglat);
    }

    this.setState({ tourActive, tourIndex });
  };

  InitializeMap = () => {
    this.mapcraft = new Mapcraft({
      env: {
        mapbox: {
          token:
            "pk.eyJ1IjoiYXlkaW5naGFuZSIsImEiOiJjazJpcXB1Zm8xamNvM21sNjlsMG95ejY3In0.jMuteEFuzviEuitJZ-DY2w"
        }
      },
      // useBuiltIn: false,
      // styles: {
      //   light: "mapbox://styles/mapbox/streets-v11"
      // },
      map: {
        container: "app-map",
        center: [5, 60],
        zoom: 5,
        pitch: 50,
        bearing: 0,
        hash: false
      },
      icons: {
        house: "./assets/images/icon-house.png",
        apartment: "./assets/images/icon-apartment.png",
        shared: "./assets/images/icon-shared.png",
        dorm: "./assets/images/icon-dorm.png"
      },
      geoJsons: {
        places: "./data/places.json"
      }
    });

    this.mapcraft.load().then(() => {
      this.handleFilter();

      setTimeout(() => {
        this.handleGeoJson();
      }, 2500);

      setTimeout(() => {
        $(".sc-slide").addClass("sc-is-open");
      }, 4000);

      this.mapcraft.map.on("click", "point-symbol-places", event => {
        let properties = event.features[0].properties;
        let coordinates = event.features[0].geometry.coordinates.slice();

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        this.openPopup(properties, coordinates);
      });
    });
  };

  openPopup = (properties, lnglat) => {
    if (typeof properties.images !== "object")
      properties.images = JSON.parse(properties.images);

    properties.typeName = this.state.types.filter(
      t => t.slug === properties.type
    )[0].name;

    let {
      title,
      images,
      excert,
      typeName,
      rooms,
      area,
      rent,
      deposit
    } = properties;

    let html = `<div class="sc-card sc-borderless">
      <div class="sc-card-header"><h5>${title}</h5></div>
        <div class="sc-card-body">
          <div>
            <img src="${images[0].thumbnail}" class="app-page-trigger" />
          </div>

          <div>
            <table class="sc-table">
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>${typeName}</td>
                </tr>

                <tr>
                  <td>Rooms</td>
                  <td>${rooms}</td>
                </tr>

                <tr>
                  <td>Area</td>
                  <td>${area}</td>
                </tr>

                <tr>
                  <td>Rent</td>
                  <td>${rent}</td>
                </tr>

                <tr>
                  <td>Deposit</td>
                  <td>${deposit}</td>
                </tr>
              </tbody>
            </table>

            <p>${excert}</p>
          </div>
        </div>
      </div>`;

    this.mapcraft.openPopup({
      lnglat: lnglat,
      html: html
    });

    $(".app-page-trigger").on("click", () => {
      let pageVisible = true;
      let page = properties;

      this.setState({ pageVisible, page });
    });
  };
}

export default App;

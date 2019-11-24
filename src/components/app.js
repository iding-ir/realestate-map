import React, { Component } from "react";
import $ from "jquery";
import Mapcraft from "./mapcraft";
import Search from "./search";

class App extends Component {
  state = {
    types: [
      { slug: "apartment", name: "Apartment", checked: true },
      { slug: "commercial", name: "Commercial", checked: true },
      { slug: "studio", name: "Studio", checked: true },
      { slug: "dorm", name: "Dorm", checked: true },
      { slug: "house", name: "House", checked: true },
      { slug: "communal", name: "Communal", checked: true }
    ],
    rooms: [
      { slug: "one", name: "One", checked: false },
      { slug: "two", name: "Two", checked: false },
      { slug: "more", name: "More", checked: false },
      { slug: "any", name: "Any", checked: true }
    ],
    areas: {
      from: 20,
      to: 200
    },
    rents: {
      from: 3000,
      to: 50000
    },
    deposits: {
      from: 10000,
      to: 200000
    },
    places: {}
  };

  componentDidMount() {
    this.mapcraft = new Mapcraft({
      map: {
        container: "app-map",
        center: [0, 0],
        zoom: 3,
        pitch: 50,
        bearing: 0,
        hash: false
      },
      icons: {
        apartment: "./assets/images/icon-apartment.png",
        commercial: "./assets/images/icon-commercial.png",
        studio: "./assets/images/icon-studio.png",
        dorm: "./assets/images/icon-dorm.png",
        house: "./assets/images/icon-house.png",
        communal: "./assets/images/icon-communal.png"
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
        let {
          title,
          description,
          type,
          rooms,
          area,
          rent,
          deposit
        } = event.features[0].properties;
        let coordinates = event.features[0].geometry.coordinates.slice();

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        let html = `<div class="sc-card sc-borderless">
          <div class="sc-card-header"><h6>${title}</h6></div>
            <div class="sc-card-body">
              <table class="sc-table">
                <caption>${description}</caption>

                <tbody>
                  <tr>
                    <td>Type</td>
                    <td>${type}</td>
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
            </div>
          </div>`;

        this.mapcraft.openPopup({
          lnglat: coordinates,
          html: html
        });
      });
    });
  }

  render() {
    return (
      <div className="app">
        <div id="app-map"></div>

        <div className="sc-slide">
          <Search
            state={this.state}
            onFilter={this.handleFilter}
            onChangeType={this.handleChangeType}
            onChangeRoom={this.handleChangeRoom}
            onChangeArea={this.handleChangeArea}
            onChangeRent={this.handleChangeRent}
            onChangeDeposit={this.handleChangeDeposit}
            getPlacesCount={this.getPlacesCount}
          />
        </div>
      </div>
    );
  }

  getPlacesCount = () => {
    let count = this.state.places.features
      ? this.state.places.features.length
      : 0;

    return count;
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

    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeArea = (event, extent) => {
    let value = parseInt($(event.target).val());
    let areas = { ...this.state.areas };

    areas[extent] = value;

    this.setState({ areas });

    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeRent = (event, extent) => {
    let value = parseInt($(event.target).val());
    let rents = { ...this.state.rents };

    rents[extent] = value;

    this.setState({ rents });

    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeDeposit = (event, extent) => {
    let value = parseInt($(event.target).val());
    let deposits = { ...this.state.deposits };

    deposits[extent] = value;

    this.setState({ deposits });

    this.handleFilter();
    this.handleGeoJson();
  };
}

export default App;

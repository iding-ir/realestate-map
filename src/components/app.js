import React, { Component } from "react";
import "./app.css";
import $ from "jquery";
import Mapcraft from "./mapcraft";

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
    rents: {
      from: 7000,
      to: 20000
    },
    deposits: {
      from: 15000,
      to: 40000
    }
  };

  componentDidMount() {
    this.mapcraft = new Mapcraft({
      map: {
        container: "app-map",
        center: [35, 35],
        hash: true
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
      this.mapcraft.map.on("click", "point-symbol-places", event => {
        let {
          title,
          description,
          type,
          area,
          rent,
          deposit
        } = event.features[0].properties;
        let coordinates = event.features[0].geometry.coordinates.slice();

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        let html = `<div class="card">
            <div class="card-header"><h6>${title}</h6></div>
            <div class="card-body">
              <p>${description}</p>
              <p>Type: ${type}</p>
              <p>Area: ${area}</p>
              <p>Rent: ${rent}</p>
              <p>Deposit: ${deposit}</p>
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
    let types = [...this.state.types];

    return (
      <div className="app">
        <main className="app-main">
          <div id="app-map"></div>
        </main>

        <div className="app-sidebar">
          <form className="form">
            <h6>Types</h6>

            <div className="form-group grid grid-2">
              {types.map((type, index) => {
                return (
                  <div className="form-checkbox" key={index}>
                    <input
                      type="checkbox"
                      name="types"
                      id={type.slug}
                      data-type={type.slug}
                      checked={type.checked}
                      onChange={event => {
                        this.handleChangeLayer(event);
                      }}
                    />

                    <label htmlFor={type.slug}>
                      <i className="icon-check"></i>

                      <span>{type.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            <h6>Rent</h6>

            <div className="form-group grid-2">
              <div className="form-range">
                <label htmlFor="app-rent-from">
                  Rent from: {this.state.rents.from}
                </label>

                <input
                  type="range"
                  min="5000"
                  max="30000"
                  step="1000"
                  value={this.state.rents.from}
                  id="app-rent-from"
                  name="app-rent-from"
                  onChange={event => {
                    this.handleChangeRent(event, "from");
                  }}
                />
              </div>

              <div className="form-range">
                <label htmlFor="app-rent-to">
                  Rent to: {this.state.rents.to}
                </label>

                <input
                  type="range"
                  min="5000"
                  max="30000"
                  step="1000"
                  value={this.state.rents.to}
                  id="app-rent-to"
                  name="app-rent-to"
                  onChange={event => {
                    this.handleChangeRent(event, "to");
                  }}
                />
              </div>
            </div>

            <h6>Deposit</h6>

            <div className="form-group grid-2">
              <div className="form-range">
                <label htmlFor="app-deposit-from">
                  Deposit from: {this.state.deposits.from}
                </label>

                <input
                  type="range"
                  min="10000"
                  max="50000"
                  step="1000"
                  value={this.state.deposits.from}
                  id="app-deposit-from"
                  name="app-deposit-from"
                  onChange={event => {
                    this.handleChangeDeposit(event, "from");
                  }}
                />
              </div>

              <div className="form-range">
                <label htmlFor="app-deposit-to">
                  Deposit to: {this.state.deposits.to}
                </label>

                <input
                  type="range"
                  min="10000"
                  max="50000"
                  step="1000"
                  value={this.state.deposits.to}
                  id="app-deposit-to"
                  name="app-deposit-to"
                  onChange={event => {
                    this.handleChangeDeposit(event, "to");
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  handleFilter = () => {
    let { rents, deposits, types } = this.state;

    let filters = [
      "all",
      [">=", "deposit", deposits.from],
      ["<=", "deposit", deposits.to],
      [">=", "rent", rents.from],
      ["<=", "rent", rents.to]
    ];

    let typesFilter = types.reduce(
      (total, current) => {
        if (current.checked) total.push(["==", "type", current.slug]);

        return total;
      },
      ["any"]
    );

    filters.push(typesFilter);

    this.mapcraft.map.setFilter("point-symbol-places", filters);
  };

  handleChangeLayer = event => {
    let slug = $(event.target).attr("data-type");
    let types = [...this.state.types].map(type => {
      if (type.slug === slug) type.checked = $(event.target).is(":checked");

      return type;
    });

    this.setState({ types });

    this.handleFilter();
  };

  handleChangeRent = (event, extent) => {
    let value = parseInt($(event.target).val());
    let rents = { ...this.state.rents };

    rents[extent] = value;

    this.setState({ rents });

    this.handleFilter();
  };

  handleChangeDeposit = (event, extent) => {
    let value = parseInt($(event.target).val());
    let deposits = { ...this.state.deposits };

    deposits[extent] = value;

    this.setState({ deposits });

    this.handleFilter();
  };
}

export default App;

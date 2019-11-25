import React, { Component } from "react";
import $ from "jquery";

class Sreach extends Component {
  state = {};
  render() {
    let {
      state,
      onChangeType,
      onChangeRoom,
      onChangeArea,
      onChangeRent,
      onChangeDeposit,
      getPlacesCount
    } = this.props;

    return (
      <React.Fragment>
        <header className="sc-slide-header">
          <h5>Filters</h5>

          <i
            className="sc-icon-menu sc-slide-toggle"
            onClick={this.handleToggleSidebar}
          ></i>
        </header>

        <div className="sc-slide-body">
          <form className="sc-form">
            <h6>Type</h6>

            <div className="sc-form-group sc-grid-2">
              {state.types.map((type, index) => {
                return (
                  <div className="sc-form-checkbox" key={index}>
                    <input
                      type="checkbox"
                      name="types"
                      id={type.slug}
                      data-type={type.slug}
                      checked={type.checked}
                      onChange={event => {
                        onChangeType(event);
                      }}
                    />

                    <label htmlFor={type.slug}>
                      <i className="sc-icon-checkbox"></i>

                      <span>{type.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            <h6>Rooms</h6>

            <div className="sc-form-group sc-grid-2">
              {state.rooms.map((room, index) => {
                return (
                  <div className="sc-form-radio" key={index}>
                    <input
                      type="radio"
                      name="rooms"
                      id={room.slug}
                      data-room={room.slug}
                      checked={room.checked}
                      onChange={event => {
                        onChangeRoom(event);
                      }}
                    />

                    <label htmlFor={room.slug}>
                      <i className="sc-icon-radio"></i>

                      <span>{room.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            <h6>Area</h6>

            <div className="sc-form-group sc-grid-2">
              <div className="sc-form-range">
                <label htmlFor="app-area-from">{state.areas.from}</label>

                <input
                  type="range"
                  min="30"
                  max="150"
                  step="10"
                  value={state.areas.from}
                  id="app-area-from"
                  name="app-area-from"
                  onChange={event => {
                    onChangeArea(event, "from");
                  }}
                />
              </div>

              <div className="sc-form-range">
                <label htmlFor="app-area-to">{state.areas.to}</label>

                <input
                  type="range"
                  min="30"
                  max="150"
                  step="10"
                  value={state.areas.to}
                  id="app-area-to"
                  name="app-area-to"
                  onChange={event => {
                    onChangeArea(event, "to");
                  }}
                />
              </div>
            </div>

            <h6>Rent</h6>

            <div className="sc-form-group sc-grid-2">
              <div className="sc-form-range">
                <label htmlFor="app-rent-from">{state.rents.from}</label>

                <input
                  type="range"
                  min="3000"
                  max="50000"
                  step="1000"
                  value={state.rents.from}
                  id="app-rent-from"
                  name="app-rent-from"
                  onChange={event => {
                    onChangeRent(event, "from");
                  }}
                />
              </div>

              <div className="sc-form-range">
                <label htmlFor="app-rent-to">{state.rents.to}</label>

                <input
                  type="range"
                  min="3000"
                  max="50000"
                  step="1000"
                  value={state.rents.to}
                  id="app-rent-to"
                  name="app-rent-to"
                  onChange={event => {
                    onChangeRent(event, "to");
                  }}
                />
              </div>
            </div>

            <h6>Deposit</h6>

            <div className="sc-form-group sc-grid-2">
              <div className="sc-form-range">
                <label htmlFor="app-deposit-from">{state.deposits.from}</label>

                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="1000"
                  value={state.deposits.from}
                  id="app-deposit-from"
                  name="app-deposit-from"
                  onChange={event => {
                    onChangeDeposit(event, "from");
                  }}
                />
              </div>

              <div className="sc-form-range">
                <label htmlFor="app-deposit-to">{state.deposits.to}</label>

                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="1000"
                  value={state.deposits.to}
                  id="app-deposit-to"
                  name="app-deposit-to"
                  onChange={event => {
                    onChangeDeposit(event, "to");
                  }}
                />
              </div>
            </div>
          </form>
        </div>

        <footer className="sc-slide-footer">
          <h6>{getPlacesCount()} results found.</h6>

          <div className="sc-form-group sc-grid-1">
            <div className="sc-form-button sc-stretched">
              <button>
                <i className="sc-icon-search"></i>

                <span>Tour through the results</span>
              </button>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }

  handleToggleSidebar = () => {
    $(".sc-slide").toggleClass("sc-is-open");
  };
}

export default Sreach;

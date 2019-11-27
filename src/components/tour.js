import React, { Component } from "react";

class Tour extends Component {
  state = {};
  render() {
    let { disableRestart, disableNext, disablePrev, onChangeTour } = this.props;

    return (
      <React.Fragment>
        <div
          className={
            "app-tour-controls sc-grid-4" + this.getTourAdditionalClasses()
          }
        >
          <div className="sc-form-button sc-stretched">
            <button
              onClick={() => {
                onChangeTour("prev");
              }}
              disabled={disablePrev}
            >
              Prev
            </button>
          </div>

          <div className="sc-form-button sc-stretched">
            <button
              onClick={() => {
                onChangeTour("restart");
              }}
              disabled={disableRestart}
            >
              Restart
            </button>
          </div>

          <div className="sc-form-button sc-stretched">
            <button
              onClick={() => {
                onChangeTour("end-tour");
              }}
            >
              End
            </button>
          </div>

          <div className="sc-form-button sc-stretched">
            <button
              onClick={() => {
                onChangeTour("next");
              }}
              disabled={disableNext}
            >
              Next
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getTourAdditionalClasses = () => {
    let { tourActive } = this.props;

    return tourActive ? " is-visible" : "";
  };
}

export default Tour;

import React, { Component } from "react";
import "./tour.css";

class Tour extends Component {
  state = {};
  render() {
    let { disableRestart, disableNext, disablePrev, onChangeTour } = this.props;

    return (
      <React.Fragment>
        <div className="sc-form-button sc-stretched">
          <button
            disabled={disablePrev}
            onClick={() => {
              onChangeTour("prev");
            }}
          >
            Prev
          </button>
        </div>

        <div className="sc-form-button sc-stretched">
          <button
            disabled={disableRestart}
            onClick={() => {
              onChangeTour("restart");
            }}
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
            disabled={disableNext}
            onClick={() => {
              onChangeTour("next");
            }}
          >
            Next
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Tour;

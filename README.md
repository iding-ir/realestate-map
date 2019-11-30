# About this project

I created this prototype using [React](https://reactjs.org/) and [Mapcraft](https://github.com/iding-ir/mapcraft) (a mini SDK that I'm developing around [Mapbox GL JS](https://mapbox.com/)).

For the UI, I used [Stylecraft](https://github.com/iding-ir/stylecraft), a css framework that I started to develop for this app.

Data structure in this project follows [GeoJSON](https://geojson.org/) standard.

## Demo

[Live demo](http://realestate-map.iding.ir)

## Performance

- This app uses WebGL to render vector tiles which makes use of the graphic processor to provide a better map rendering.

- Raw data is processed and filtered at the client side. This way, app does not need to send a request to server with every change in the filter.

- Using React, map immediately reacts to filter changes and re-renders the results.

## Preview

<img src="https://github.com/iding-ir/realestate-map/blob/master/raw/previews/preview-1.gif" alt="Preview" style="width:100%;">

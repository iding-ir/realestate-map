# About this project

I created this prototype using [React](https://reactjs.org/) and [Mapcraft](https://github.com/iding-ir/mapcraft) (a mini SDK that I'm developing around [Mapbox GL JS](https://mapbox.com/)).

As for the UI, I created a new css framework for this app. Once completed, I will have to test it with a few more projects before I document it and make it public on npm.

Geolocation data in this app follow the standard [GeoJSON](https://geojson.org/) structure.

## Demo

[Live demo](http://realstate-map.iding.ir)

## Performance

- This app uses WebGL to render vector tiles which uses graphic processor to provide a better map rendering.

- Raw data is processed and filtered at the client side. This way, app does not need to send a request to server with every change in the filter.

- Using React, map immediately reacts to filter changes and re-renders the results.

<img src="https://github.com/iding-ir/realstate-map/blob/master/raw/previews/preview-1.gif" alt="Preview" style="width:100%;">

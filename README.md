# About this project

I created this prototype using [React](https://reactjs.org/) and [Mapcraft](https://github.com/iding-ir/mapcraft), a mini SDK that I'm developing around [Mapbox GL JS](https://mapbox.com/).

As for the UI, I created a new css framework for this app. Once completed, I will have to test it with a few more projects before I can document it and make it public on npm.

## Demo

[Live demo](http://realstate-map.iding.ir)

## Performance

This project uses WebGL to render vector tiles which uses graphic processor to provide a better map rendering.

It uses standard GeoJSON data structure and filters data at the client side. This way, app does not need to send a server request every time there is a change in the filter.

Using React, map immediately reacts to filter changes and re-renders the results.

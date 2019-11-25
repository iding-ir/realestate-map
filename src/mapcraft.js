/*
Oct 27 2019
Created by Aydin Ghane to demonstrate ECMA6 skills
Website: http://iding.ir
Email: aydin.ghane.kh@gmail.com
Demo: http://g2ocean.iding.ir
*/

import mapboxgl from "mapbox-gl";
import Terraformer from "terraformer";

export default class Mapcraft {
  constructor(opt) {
    this.options = Object.assign(
      {
        env: {
          mapbox: {
            token: ""
          }
        },
        map: {
          container: "",
          center: [35, 35],
          zoom: 2,
          pitch: 0,
          bearing: 0,
          hash: true
        },
        controls: {
          fullscreen: false,
          geolocation: true,
          navigation: true
        },
        colors: {
          light: {
            primary: "#1976D2",
            secondary: "#FAFAFA"
          },
          dark: {
            primary: "#455A64",
            secondary: "#FFA000"
          }
        },
        defaultMapColors: {
          light: {
            background: "#0D47A1",
            fill: "#EFEBE9",
            line: "#3E2723",
            text: "#3E2723"
          },
          dark: {
            background: "#101518",
            fill: "#263238",
            line: "#E1F5FE",
            text: "#E1F5FE"
          }
        },
        styles: {
          light: "./mapcraft/jsons/styles/light/style.json",
          dark: "./mapcraft/jsons/styles/dark/style.json"
        },
        defaultStyle: "light",
        icons: {
          default: "./mapcraft/images/icon-default.png"
        },
        defaultIcon: "default",
        geoJsons: {},
        layers: {
          polygon: {
            fill: true,
            line: true
          },
          polyline: {
            line: true,
            symbol: false
          },
          point: {
            symbol: true
          }
        },
        sourcePrefix: "",
        layersPrefixes: {
          polygon: {
            fill: "polygon-fill-",
            line: "polygon-line-"
          },
          polyline: {
            line: "polyline-line-",
            symbol: "polyline-symbol-"
          },
          point: {
            symbol: "point-symbol-"
          }
        }
      },
      opt
    );

    this.geoJsons = {};
    this.popup = undefined;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.buildMap()
        .loadIcons({
          icons: this.options.icons
        })
        .then(() => {
          this.fetchGeoJson({
            geoJsons: this.options.geoJsons
          })
            .then(geoJsons => {
              this.renderGeoJson({
                geoJsons: geoJsons
              })
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getAppUrl() {
    const url = new URL(window.location.href);
    const { protocol, host } = url;
    const root = `${protocol}//${host}/`;

    return root;
  }

  buildMap() {
    mapboxgl.accessToken = this.options.env.mapbox.token;

    const { container, center, zoom, pitch, bearing, hash } = this.options.map;

    this.map = new mapboxgl.Map({
      container,
      center,
      zoom,
      pitch,
      bearing,
      minZoom: 2,
      maxZoom: 20,
      hash,
      style: this.options.styles[this.options.defaultStyle]
    });

    const { fullscreen, geolocation, navigation } = this.options.controls;

    this.addControls({
      fullscreen,
      geolocation,
      navigation
    });

    this.map.on("style.load", () => {
      const colors = this.options.defaultMapColors[this.options.defaultStyle];

      this.colorizeDefaultMap({
        colors
      });
    });

    return this;
  }

  loadIcons(opt) {
    const options = Object.assign(
      {
        icons: undefined
      },
      opt
    );

    return new Promise((resolve, reject) => {
      let promises = {};

      for (let key in options.icons) {
        const value = options.icons[key];

        promises[key] = new Promise((resolve, reject) => {
          this.map.loadImage(value, (error, image) => {
            if (error) {
              reject(error);
            } else {
              this.map.addImage(key, image);

              resolve();
            }
          });
        });
      }

      Promise.all(Object.values(promises))
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  fetchGeoJson(opt) {
    const options = Object.assign(
      {
        geoJsons: undefined
      },
      opt
    );

    return new Promise((resolve, reject) => {
      let promises = {};
      let geoJsons = {};

      for (let key in options.geoJsons) {
        const value = options.geoJsons[key];

        promises[key] = new Promise((resolve, reject) => {
          fetch(value)
            .then(response => response.json())
            .then(json => {
              this.geoJsons[key] = json;

              geoJsons[key] = json;

              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      }

      Promise.all(Object.values(promises))
        .then(() => {
          resolve(geoJsons);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  prepareSource(suffix) {
    const prefix = this.options.sourcePrefix;
    const source = prefix + suffix;

    if (this.map.getSource(source)) this.map.removeSource(source);

    return source;
  }

  prepareLayers(suffix) {
    const prefixes = this.options.layersPrefixes;
    const layers = {};

    for (const featureKey in prefixes) {
      const featureValue = prefixes[featureKey];

      layers[featureKey] = {};

      for (const typeKey in featureValue) {
        const layer = featureValue[typeKey] + suffix;

        layers[featureKey][typeKey] = layer;

        if (this.map.getLayer(layer)) this.map.removeLayer(layer);
      }
    }

    return layers;
  }

  renderGeoJson(opt) {
    const options = Object.assign(
      {
        geoJsons: undefined
      },
      opt
    );

    return new Promise((resolve, reject) => {
      for (let key in options.geoJsons) {
        const value = options.geoJsons[key];

        const source = this.prepareSource(key);
        const layers = this.prepareLayers(key);

        const mustRender = this.options.layers;

        const primaryColor = this.options.colors[this.options.defaultStyle]
          .primary;
        const secondaryColor = this.options.colors[this.options.defaultStyle]
          .secondary;

        this.map.addSource(source, {
          type: "geojson",
          data: value
        });

        if (mustRender.polygon.fill)
          this.map.addLayer({
            id: layers.polygon.fill,
            type: "fill",
            minzoom: 1,
            source: source,
            filter: [
              "any",
              ["==", ["geometry-type"], "Polygon"],
              ["==", ["geometry-type"], "MultiPolygon"]
            ],
            paint: {
              "fill-color": [
                "interpolate",
                ["exponential", 1],
                ["zoom"],
                1,
                primaryColor,
                12,
                primaryColor
              ],
              "fill-opacity": [
                "interpolate",
                ["exponential", 0.8],
                ["zoom"],
                0,
                0,
                12,
                0.4
              ]
            }
          });

        this.makeLayerInteractive({
          layer: layers.polygon.fill
        });

        if (mustRender.polygon.line)
          this.map.addLayer({
            id: layers.polygon.line,
            type: "line",
            minzoom: 1,
            source: source,
            filter: [
              "any",
              ["==", ["geometry-type"], "Polygon"],
              ["==", ["geometry-type"], "MultiPolygon"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-width": [
                "interpolate",
                ["exponential", 1],
                ["zoom"],
                0,
                0,
                12,
                4
              ],
              "line-color": [
                "interpolate",
                ["exponential", 1],
                ["zoom"],
                1,
                secondaryColor,
                12,
                secondaryColor
              ],
              "line-opacity": [
                "interpolate",
                ["exponential", 0.8],
                ["zoom"],
                0,
                0,
                12,
                1
              ]
            }
          });

        this.makeLayerInteractive({
          layer: layers.polygon.line
        });

        if (mustRender.polyline.line)
          this.map.addLayer({
            id: layers.polyline.line,
            type: "line",
            minzoom: 1,
            source: source,
            filter: [
              "any",
              ["==", ["geometry-type"], "LineString"],
              ["==", ["geometry-type"], "MultiLineString"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-width": [
                "interpolate",
                ["exponential", 1],
                ["zoom"],
                0,
                1,
                12,
                6
              ],
              "line-color": [
                "interpolate",
                ["exponential", 1],
                ["zoom"],
                1,
                secondaryColor,
                12,
                secondaryColor
              ],
              "line-opacity": [
                "interpolate",
                ["exponential", 0.8],
                ["zoom"],
                0,
                0,
                12,
                1
              ],
              "line-dasharray": [4, 4]
            }
          });

        this.makeLayerInteractive({
          layer: layers.polyline.line
        });

        if (mustRender.polyline.symbol)
          this.map.addLayer({
            id: layers.polyline.symbol,
            type: "symbol",
            minzoom: 1,
            source: source,
            filter: [
              "any",
              ["==", ["geometry-type"], "LineString"],
              ["==", ["geometry-type"], "MultiLineString"]
            ],
            layout: {
              "icon-image": this.options.defaultIcon,
              "icon-size": 1,
              "icon-anchor": "center",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true
            },
            paint: {
              "icon-opacity": [
                "interpolate",
                ["exponential", 0.8],
                ["zoom"],
                0,
                0,
                4,
                1
              ]
            }
          });

        this.makeLayerInteractive({
          layer: layers.polyline.symbol
        });

        if (mustRender.point.symbol)
          this.map.addLayer({
            id: layers.point.symbol,
            type: "symbol",
            minzoom: 1,
            source: source,
            filter: [
              "any",
              ["==", ["geometry-type"], "Point"],
              ["==", ["geometry-type"], "MultiPoint"]
            ],
            layout: {
              "icon-image": [
                "case",
                ["has", "icon"],
                ["get", "icon"],
                ["has", "type"],
                ["get", "type"],
                this.options.defaultIcon
              ],
              "icon-size": 1,
              "icon-anchor": "center",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true
            },
            paint: {
              "icon-opacity": [
                "interpolate",
                ["exponential", 0.8],
                ["zoom"],
                0,
                0,
                4,
                1
              ]
            }
          });

        this.makeLayerInteractive({
          layer: layers.point.symbol
        });
      }

      resolve();
    });
  }

  openPopup(opt) {
    const options = Object.assign(
      {
        lnglat: undefined,
        html: ""
      },
      opt
    );

    this.closePopup();

    this.popup = new mapboxgl.Popup({
      closeButton: false
    })
      .setLngLat(options.lnglat)
      .setHTML(options.html)
      .addTo(this.map);
  }

  closePopup() {
    if (this.popup && this.popup.isOpen()) this.popup.remove();
  }

  switchLayer(opt) {
    const options = Object.assign(
      {
        layer: undefined,
        visibility: undefined
      },
      opt
    );

    this.map.setLayoutProperty(options.layer, "visibility", options.visibility);
  }

  fitBounds(opt) {
    const options = Object.assign(
      {
        geoJson: undefined,
        padding: 100,
        pitch: 0,
        bearing: 0
      },
      opt
    );

    const polygon = new Terraformer.Primitive(options.geoJson);

    const bbox = polygon.bbox();

    this.map.fitBounds(bbox, {
      padding: options.padding,
      pitch: options.pitch,
      bearing: options.bearing
    });
  }

  makeLayerInteractive(opt) {
    const options = Object.assign(
      {
        layer: undefined
      },
      opt
    );

    this.map.on("mousemove", options.layer, event => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    this.map.on("mouseleave", options.layer, event => {
      this.map.getCanvas().style.cursor = "grab";
    });
  }

  addControls(opt) {
    const options = Object.assign(
      {
        fullscreen: false,
        geolocation: false,
        navigation: false
      },
      opt
    );

    if (options.fullscreen) {
      this.fullscreenControl = new mapboxgl.FullscreenControl({});

      this.map.addControl(this.fullscreenControl, "top-right");
    }

    if (options.geolocation) {
      this.geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: false
      });

      this.map.addControl(this.geolocateControl, "bottom-right");
    }

    if (options.navigation) {
      this.navigationControl = new mapboxgl.NavigationControl({});

      this.map.addControl(this.navigationControl, "top-right");
    }
  }

  colorizeDefaultMap(opt) {
    const options = Object.assign(
      {
        colors: undefined
      },
      opt
    );

    this.map.setPaintProperty(
      "background",
      "background-color",
      options.colors.background
    );

    this.map.setPaintProperty(
      "country-fills",
      "fill-color",
      options.colors.fill
    );

    this.map.setPaintProperty(
      "country-lines",
      "line-color",
      options.colors.line
    );

    this.map.setPaintProperty(
      "country-symbols",
      "text-color",
      options.colors.text
    );
  }
}

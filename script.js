// display variables
var displayMap;
let view;
let pricingBuy;
let featureLayers = [];
let geojsons = [
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/Kuwait-Pricing-Map/main/KT.json",
    title: "Kuwait Pricing",
  },
];

function loadModule(moduleName) {
  return new Promise((resolve, reject) => {
    require([moduleName], (module) => {
      if (module) {
        resolve(module);
      } else {
        reject(new Error(`Module not found: ${moduleName}`));
      }
    }, (error) => {
      reject(error);
    });
  });
}

async function initializeMapKuwaitPricing() {
  try {
    const [
      esriConfig,
      Map,
      MapView,
      FeatureLayer,
      Legend,
      GeoJSONLayer,
      ImageElement,
      MediaLayer,
      ExtentAndRotationGeoreference,
      Extent,
    ] = await Promise.all([
      loadModule("esri/config"),
      loadModule("esri/Map"),
      loadModule("esri/views/MapView"),
      loadModule("esri/layers/FeatureLayer"),
      loadModule("esri/widgets/Legend"),
      loadModule("esri/layers/GeoJSONLayer"),
    ]);

    esriConfig.apiKey =
      "AAPTxy8BH1VEsoebNVZXo8HurLDgxtwUHf2eJ8_Yfxvl1f0yZEc6VPdbpf-vMpPcB_AezBGlIoeL79Zf4AgAAxJbNC8-qRP58ibtmQyxRwIp5G0mru3EOScBmwRrIFEFFzX9yLDfxJjfe8Fm7MGgkZpphnKN4kEzwshExAOVijtE9J58OPbjA0t0ukZVZYEwU3kw5GLLBUE_xYMcUrjca_fdat2z77zjqVY2chpzQOrAyes.AT1_Vl7XCd3U"; // Will change it

    const Pricing01 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#ABD0E6",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const Pricing02 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#82BADB",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const Pricing03 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#3787C0",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const region3 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#b1cdc2",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region2 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#38627a",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region1 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#0d2644",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "Average",
      // normalizationField: "EDUCBASECY",
      legendOptions: {
        title: "Kuwait prices",
      },
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "gray",
        // style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: [50, 50, 50, 0.6],
        },
      },
      defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 328000,
          maxValue: 622500,
          symbol: Pricing01,
          label: "< 35%",
        },
        {
          minValue: 622500,
          maxValue: 1222500,
          symbol: Pricing02,
          label: "35 - 50%",
        },
        {
          minValue: 1222500,
          maxValue: 5000000,
          symbol: Pricing03,
          label: "50 - 75%",
        },
      ],
    };

    const template = {
      // autocasts as new PopupTemplate()
      title: "{N_EName}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "OBJECTID",
              label: "OBJECTID",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
            {
              fieldName: "Highest",
              label: "Highest",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
            {
              fieldName: "Lowest",
              label: "Lowest",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
            {
              fieldName: "Average",
              label: "Average",
              format: {
                digitSeparator: true,
                places: 0,
              },
            },
          ],
        },
      ],
    };

    const labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "text", // autocasts as new TextSymbol()
        color: "gray",
        haloColor: "gray",
        // backgroundColor: "black",
        // borderLineColor: "black",
        // borderLineSize: 1,
        // yoffset: 5,
        font: {
          // autocast as new Font()
          // family: "Arial Unicode MS",
          family: "Merriweather",
          size: 10,
          // weight: "bold"
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.N_EName",
      },
    };

    let moveHighlight = null;
    let selectedHighlight = null;
    let selectedGraphic = null;

    function clearSelection() {
      if (selectedHighlight) {
        selectedHighlight.remove();
        selectedHighlight = null;
        selectedGraphic = null;
      }
    }
    
    function openSecondCard() {
      document.getElementById("first-card").style.display = "none";
      document.getElementById("second-card").style.display = "block";
    }

    document.getElementById("backButton").addEventListener('click', closeSecondCard)
    function closeSecondCard() {
      clearSelection()
      view.whenLayerView(pricingBuy).then(function (layerView) {
        view.goTo(
          {
            target: pricingBuy.fullExtent,
            // zoom: 11
          },
          {
            duration: 2000,
          }
        );
      });

      document.getElementById("second-card").style.display = "none";
      document.getElementById("first-card").style.display = "block";
    }

    var areaDetails = document.getElementById("areaDetails");
    var areaNH = document.getElementById("areaNH");
    var H = document.getElementById("H");
    var Av = document.getElementById("Av");
    var L = document.getElementById("L");
    async function createFeatureLayers(geojsons) {
      const arrayFeatures = [];
      for (const geojsonURL of geojsons) {
        const geojsonLayer = new GeoJSONLayer({
          url: geojsonURL.regionsURL,
          title: geojsonURL.title,
        });
        await geojsonLayer.queryFeatures().then(function (results) {
          console.log(results);
          const featureLayer = new FeatureLayer({
            source: results.features,
            outFields: ["*"],
            fields: results.fields,
            objectIdField: results.fields[0].name,
            geometryType: results.geometryType,
            title: geojsonLayer.title,
            renderer: renderer,
          });
          arrayFeatures.push(featureLayer);
        });
        featureLayers = arrayFeatures;
      }
      return featureLayers;
    }

    displayMap = new Map({
      // basemap: "satellite",
      basemap: "arcgis-light-gray",
      // layers: [],
    });

    view = new MapView({
      center: [47.4818, 29.3117], // longitude, latitude, centered on Kuwait
      container: "displayMap",
      map: displayMap,
      zoom: 3,
      // highlightOptions: {
      //   color: "#000000",
      //   fillOpacity: 0,
      //   haloOpacity: 1
      // }

      // highlightOptions: {
      //   color: "#39ff14",
      //   haloOpacity: 0.9,
      //   fillOpacity: 0,
      // },
    });

    await createFeatureLayers(geojsons).then((featureLayers) => {
      console.log(featureLayers);
      if (featureLayers) {
        featureLayers.map((layer) => {
          displayMap.add(layer);
          view.ui.add("first-card", "bottom-left");
          view.ui.add("second-card", "bottom-left");
          if (layer.title === "Kuwait Pricing") {
            pricingBuy = layer;
            console.log(layer, "layereee");
            // layer.labelingInfo = labelClass;
            layer.popupTemplate = template;
            layer.orderBy = [{
              field: "Space",
              order: "descending"  // "descending" | "ascending"
            }];
            // layer.visible = false;
            view.whenLayerView(layer).then(function (layerView) {
              view.goTo(
                {
                  target: layer.fullExtent,
                  // zoom: 11
                },
                {
                  duration: 2000,
                }
              );
            });

            view
              .when()
              .then(() => layer.when())
              .then(() => view.whenLayerView(layer))
              .then((layerView) => {
                // let moveHighlight = null;
                // let selectedHighlight = null;
                // let selectedGraphic = null;

                view.on("pointer-move", (evt) => handleEvent(evt, false));
                view.on("click", (evt) => handleEvent(evt, true));

                function handleEvent(evt, isClick) {
                  view.hitTest(evt).then((response) => {
                    const features = response.results.filter(
                      (result) => result.graphic.layer === layer
                    );
                    if (features.length > 0) {
                      const graphic = features[0].graphic;

                      if (isClick) {
                        if (selectedHighlight) {
                          selectedHighlight.remove();
                        }
                        document.getElementById("first-card").style.display =
                          "none";
                        document.getElementById("second-card").style.display =
                          "block";
                        selectedGraphic = graphic;
                        console.log(graphic, "graphS");
                        areaNH.innerHTML = graphic.attributes.areaName;

                        H.innerHTML = graphic.attributes.Highest;
                        Av.innerHTML = graphic.attributes.Average;
                        L.innerHTML = graphic.attributes.Lowest;
                        view.highlightOptions = {
                          color: "#000000",
                          fillOpacity: 0,
                          haloOpacity: 1,
                          haloColor: "black",
                          shadowColor: "black",
                          shadowOpacity: 1,
                        };
                        selectedHighlight = layerView.highlight(graphic);
                        view.goTo(
                          {
                            target: graphic,
                            // zoom: 11
                          },
                          {
                            duration: 1000,
                          }
                        );
                      } else {
                        if (graphic !== selectedGraphic) {
                          if (moveHighlight) {
                            moveHighlight.remove();
                          }
                          view.highlightOptions = {
                            color: "#000000",
                            fillOpacity: 0,
                            haloOpacity: 1,
                            haloColor: "black",
                            shadowColor: "black",
                            shadowOpacity: 1,
                          };
                          moveHighlight = layerView.highlight(graphic);
                        }
                      }
                    } else {
                      if (isClick) {
                        clearSelection();
                        view.goTo(
                          {
                            target: layer.fullExtent,
                            // zoom: 11
                          },
                          {
                            duration: 2000,
                          }
                        );
                        document.getElementById("second-card").style.display =
                          "none";
                        document.getElementById("first-card").style.display =
                          "block";
                      } else {
                        removeMoveHighlight();
                      }
                    }
                  });
                }

                function removeMoveHighlight() {
                  if (moveHighlight) {
                    moveHighlight.remove();
                    moveHighlight = null;
                  }
                }


              })
              .catch((error) => {
                console.error("Error initializing map:", error);
                throw error;
              });
          }
        });
      }
    });

    // view.on("click", function (event) {
    //   view.hitTest(event).then(function (response) {
    //     if (response.results.length) {
    //       view.highlightOptions = {
    //         color: "#000000",
    //         fillOpacity: 0,
    //         haloOpacity: 1,
    //         haloColor: "black",
    //         shadowColor: "black",
    //         shadowOpacity: 1
    //       }
    //       let graphic = response.results.filter(function (result) {
    //         return (
    //           result.graphic.layer === pricingBuy
    //           // result.graphic.layer === KansasCityBoundaries ||
    //         );
    //       })[0].graphic;
    //       view.goTo(
    //         {
    //           target: graphic,
    //         },
    //         {
    //           duration: 1000,
    //         }
    //       );
    //     }
    //   });
    // });

    await view.when();

    let legend = new Legend({
      view: view,
      // layerInfos: [
      //   {
      //     layer: District1_Neighborhoods,
      //     title: "Region 1"
      //   },
      //   {
      //     layer: District2_Neighborhoods,
      //     title: "Region 2"
      //   },
      // ]
    });
    legend.headingLevel = 2;
    legend.style = {
      type: "classic",
      layout: "auto",
    };
    legend.basemapLegendVisible = true;
    legend.hideLayersNotInCurrentView = true;
    view.ui.add(legend, "bottom-left");

    // view.whenLayerView(KansasCityBoundaries).then(function (layerView) {
    //   view.goTo(
    //     {
    //       target: KansasCityBoundaries.fullExtent,
    //     },
    //     {
    //       duration: 2000,
    //     }
    //   );
    // });

    //add widgets
    addWidgets()
      .then(([view, displayMap]) => {
        console.log(
          "Widgets Returned From Require Scope",
          view,
          displayMap,
          featureLayer
        );
        // You can work with the view object here
      })
      .catch((error) => {
        // Handle any errors here
      });

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

// calling
initializeMapKuwaitPricing()
  .then(() => {
    console.log("Map Returned From Require Scope", displayMap);
    // You can work with the view object here
  })
  .catch((error) => {
    // Handle any errors here
  });

async function addWidgets() {
  try {
    // await initializeMap();

    const [
      Fullscreen,
      BasemapGallery,
      Expand,
      ScaleBar,
      AreaMeasurement2D,
      Search,
      Home,
      LayerList,
    ] = await Promise.all([
      loadModule("esri/widgets/Fullscreen"),
      loadModule("esri/widgets/BasemapGallery"),
      loadModule("esri/widgets/Expand"),
      loadModule("esri/widgets/ScaleBar"),
      loadModule("esri/widgets/AreaMeasurement2D"),
      loadModule("esri/widgets/Search"),
      loadModule("esri/widgets/Home"),
      loadModule("esri/widgets/LayerList"),
    ]);

    var basemapGallery = new BasemapGallery({
      view: view,
    });

    var Expand22 = new Expand({
      view: view,
      content: basemapGallery,
      expandIcon: "basemap",
      group: "top-right",
      // expanded: false,
      expandTooltip: "Open Basmap Gallery",
      collapseTooltip: "Close",
    });
    view.ui.add([Expand22], { position: "top-right", index: 6 });

    var fullscreen = new Fullscreen({
      view: view,
    });
    view.ui.add(fullscreen, "top-right");

    var scalebar = new ScaleBar({
      view: view,
      unit: "metric",
    });
    view.ui.add(scalebar, "bottom-right");

    var search = new Search({
      //Add Search widget
      view: view,
    });
    view.ui.add(search, { position: "top-left", index: 0 }); //Add to the map

    var homeWidget = new Home({
      view: view,
    });
    view.ui.add(homeWidget, "top-left");

    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function (event) {
        var item = event.item;
        // displays the legend for each layer list item
        item.panel = {
          content: "legend",
        };
      },
      showLegend: true,
    });

    layerList.visibilityAppearance = "checkbox";
    var Expand5 = new Expand({
      view: view,
      content: layerList,
      expandIcon: "layers",
      group: "top-right",
      // expanded: false,
      expandTooltip: "Layer List",
      collapseTooltip: "Close",
    });

    view.ui.add([Expand5], { position: "top-left", index: 6 });
    // view.ui.add("controlsWidget", "top-right");

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

async function clickToDownloadScreenshot() {
  try {
    console.log("Hi in Screenshot function...");

    document
      .getElementById("takeScreenshotButton")
      .addEventListener("click", () => {
        view.takeScreenshot().then((screenshot) => {
          console.log(screenshot.dataUrl);
          downloadImage("screenshot.png", screenshot.dataUrl);
        });
      });

    // helper function directly from
    // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=sceneview-screenshot
    function downloadImage(filename, dataUrl) {
      // the download is handled differently in Microsoft browsers
      // because the download attribute for <a> elements is not supported
      if (!window.navigator.msSaveOrOpenBlob) {
        // in browsers that support the download attribute
        // a link is created and a programmatic click will trigger the download
        const element = document.createElement("a");
        element.setAttribute("href", dataUrl);
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        // for MS browsers convert dataUrl to Blob
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // download file
        window.navigator.msSaveOrOpenBlob(blob, filename);
      }
    }

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

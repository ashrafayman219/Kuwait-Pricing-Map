// display variables
var displayMap;
let view;
let pricingBuy;
let featureLayers;
let featureLayersreturned;
let graphicsArr = [];
let GArr;
let pricingGroupLayer;
let layerKuwaitPricing;
let layerviewKuwaitPricing;
let layerInvestments;
let layerviewInvestments;
let investL;
let geojsons = [
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/Kuwait-Pricing-Map/main/Residential%20Houses.json",
    title: "Residential Houses",
  },
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/Kuwait-Pricing-Map/main/Investments.json",
    title: "Investments",
  },
];
const dropdownL = document.getElementById("drop-down");
const dropdownSt = document.getElementById("drop-down-st");
const dropdownSp = document.getElementById("drop-down-sp");

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
      reactiveUtils,
      GroupLayer,
      promiseUtils,
      FeatureFilter
    ] = await Promise.all([
      loadModule("esri/config"),
      loadModule("esri/Map"),
      loadModule("esri/views/MapView"),
      loadModule("esri/layers/FeatureLayer"),
      loadModule("esri/widgets/Legend"),
      loadModule("esri/layers/GeoJSONLayer"),
      loadModule("esri/core/reactiveUtils"),
      loadModule("esri/layers/GroupLayer"),
      loadModule("esri/core/promiseUtils"),
      loadModule("esri/layers/support/FeatureFilter"),
    ]);

    esriConfig.apiKey =
      "AAPTxy8BH1VEsoebNVZXo8HurLDgxtwUHf2eJ8_Yfxvl1f0yZEc6VPdbpf-vMpPcB_AezBGlIoeL79Zf4AgAAxJbNC8-qRP58ibtmQyxRwIp5G0mru3EOScBmwRrIFEFFzX9yLDfxJjfe8Fm7MGgkZpphnKN4kEzwshExAOVijtE9J58OPbjA0t0ukZVZYEwU3kw5GLLBUE_xYMcUrjca_fdat2z77zjqVY2chpzQOrAyes.AT1_Vl7XCd3U"; // Will change it

    const Pricing01 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#455873ff",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const Pricing02 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#3f83a1ff",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const Pricing03 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#00ffffff",
      style: "solid",
      outline: {
        width: 0.2,
        color: "white",
      },
    };

    const Pricing04 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#4d8c8cff",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const Pricing05 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#99c5b6ff",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const Pricing06 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#e3f1d2ff",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "Highest",
      // normalizationField: "EDUCBASECY",
      legendOptions: {
        title: "Properties Areas",
      },
      // defaultSymbol: {
      //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
      //   color: "gray",
      //   // style: "backward-diagonal",
      //   outline: {
      //     width: 0.5,
      //     color: [50, 50, 50, 0.6],
      //   },
      // },
      // defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 150000,
          symbol: Pricing01,
          label: "Lowest: 150,000",
        },
        {
          minValue: 150000,
          maxValue: 659707,
          symbol: Pricing02,
          label: "Average: 659,707",
        },
        {
          minValue: 659707,
          maxValue: 3000000,
          symbol: Pricing03,
          label: "Highest: 2,575,000",
        },
      ],
    };

    const renderer01 = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "Highest",
      // normalizationField: "EDUCBASECY",
      legendOptions: {
        title: "Properties Areas",
      },
      // defaultSymbol: {
      //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
      //   color: "gray",
      //   // style: "backward-diagonal",
      //   outline: {
      //     width: 0.5,
      //     color: [50, 50, 50, 0.6],
      //   },
      // },
      // defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 517500,
          symbol: Pricing04,
          label: "Lowest: 517,500",
        },
        {
          minValue: 517500,
          maxValue: 1384814,
          symbol: Pricing05,
          label: "Average: 1,384,814",
        },
        {
          minValue: 1384814,
          maxValue: 5000000,
          symbol: Pricing06,
          label: "Highest: 4,260,000",
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
        color: "black",
        // haloColor: "gray",
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
      labelPlacement: "above-right",
      labelExpressionInfo: {
        expression: "$feature.areaName",
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
            // renderer: renderer,
          });
          arrayFeatures.push(featureLayer);
        });
      }
      featureLayersreturned = arrayFeatures;
      pricingGroupLayer = new GroupLayer({
        title: "Kuwait Prices",
        visible: true,
        visibilityMode: "exclusive",
        layers: featureLayersreturned,
        opacity: 0.75,
      });
      displayMap.add(pricingGroupLayer);
      console.log(pricingGroupLayer, "hhh");
      return featureLayersreturned;
    }

    displayMap = new Map({
      // basemap: "satellite",
      basemap: "arcgis-light-gray",
      // layers: [],
    });

    try {
      featureLayers = await createFeatureLayers(geojsons);
      // now we have the featureslayers
    } catch (error) {
      // here if not found
    }

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
    view.popupEnabled = false;

    // document.querySelector(".btns").addEventListener("click", (event) => {
    //   /************************************************************
    //    * On a button click, change the map of the View
    //    ************************************************************/
    //   const id = event.target.getAttribute("data-id");
    //   if (id) {
    //     const webmap = webmaps[id];
    //     view.map = webmap;
    //     const nodes = document.querySelectorAll(".btn-switch");
    //     for (let idx = 0; idx < nodes.length; idx++) {
    //       const node = nodes[idx];
    //       const mapIndex = node.getAttribute("data-id");
    //       if (mapIndex === id) {
    //         node.classList.add("active-map");
    //       } else {
    //         node.classList.remove("active-map");
    //       }
    //     }
    //   }
    // });

    let stbtn = document.getElementById('stbtn');
    let spbtn = document.getElementById('spbtn');

    
    const calsiteshell = document.getElementById("calsite-shell");
    calsiteshell.style.display = "none"; // Hide calsite-shell initially

    const flow = document.getElementById("example-flow");
    const items = document.querySelectorAll("calcite-list-item");
    const calciteList = document.getElementById("calcite-list");

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    function createFeatureFlowItems(graphicStatues, isLastLevel) {
      calciteList.innerHTML = "";
      console.log(graphicStatues, "graphicStatues");
      console.log(stbtn.innerHTML, "stbtn");
      
      var featureFirstBlock = document.getElementById("first-flow-item-block");
      featureFirstBlock.description = `${graphicStatues.length} results`;
      graphicStatues?.forEach((graph) => {

        if (stbtn.innerHTML) {
          if (graph.graphic.attributes.streetType === stbtn.innerHTML) {
            const featureFlowListItem = document.createElement("calcite-list-item");

            featureFlowListItem.label = graph.graphic.attributes.areaName;
            featureFlowListItem.description = `Street Type: ${graph.graphic.attributes.streetType} - Space Value: ${graph.graphic.attributes.Space}`;
    
            const featureAction = document.createElement("calcite-action");
            featureAction.slot = "actions-end";
            featureAction.icon = "number-of-territories";
            featureAction.text = "Kuwait Areas";
            featureFlowListItem.append(featureAction);
    
            calciteList.append(featureFlowListItem);
    
            let FHighest = numberWithCommas(graph.graphic.attributes.Highest);
            let FAverage = numberWithCommas(graph.graphic.attributes.Average);
            let FLowest = numberWithCommas(graph.graphic.attributes.Lowest);
            // console.log(numberWithCommas(graph.attributes.Highest));
    
            featureFlowListItem.addEventListener(
              "calciteListItemSelect",
              function () {
                const newFeatureFlowItem =
                  document.createElement("calcite-flow-item");
                newFeatureFlowItem.heading = `${graph.graphic.attributes.areaName}`;
                newFeatureFlowItem.description = `${graph.graphic.attributes.areaName}`;
    
                const calciteAccordion =
                  document.createElement("calcite-accordion");
                calciteAccordion.appearance = "solid";
                calciteAccordion.setAttribute("icon-position", "start");
                calciteAccordion.setAttribute("icon-type", "chevron");
    
                const calciteAccordionItem = document.createElement(
                  "calcite-accordion-item"
                );
                calciteAccordionItem.description =
                  "we can plot any description here";
                calciteAccordionItem.heading = "Highest";
                calciteAccordionItem.setAttribute(
                  "icon-start",
                  "graph-moving-average"
                );
                calciteAccordionItem.setAttribute("expanded", true);
    
                calciteAccordion.append(calciteAccordionItem);
    
                const calciteAccordionItemNotice =
                  document.createElement("calcite-notice");
                calciteAccordionItemNotice.setAttribute("open", true);
                calciteAccordionItem.append(calciteAccordionItemNotice);
    
                const calciteAccordionItemnoticeContent =
                  document.createElement("div");
                calciteAccordionItemnoticeContent.slot = "message";
                calciteAccordionItemnoticeContent.innerHTML = `${FHighest}`;
                calciteAccordionItemNotice.append(
                  calciteAccordionItemnoticeContent
                );
                newFeatureFlowItem.append(calciteAccordion);
    
                //2
                const calciteAccordionItem01 = document.createElement(
                  "calcite-accordion-item"
                );
                calciteAccordionItem01.description =
                  "we can plot any description here";
                calciteAccordionItem01.heading = "Average";
                calciteAccordionItem01.setAttribute(
                  "icon-start",
                  "graph-moving-average"
                );
                calciteAccordionItem01.setAttribute("expanded", true);
    
                calciteAccordion.append(calciteAccordionItem01);
    
                const calciteAccordionItemNotice01 =
                  document.createElement("calcite-notice");
                calciteAccordionItemNotice01.setAttribute("open", true);
                calciteAccordionItem01.append(calciteAccordionItemNotice01);
    
                const calciteAccordionItemnoticeContent01 =
                  document.createElement("div");
                calciteAccordionItemnoticeContent01.slot = "message";
                calciteAccordionItemnoticeContent01.innerHTML = `${FAverage}`;
                calciteAccordionItemNotice01.append(
                  calciteAccordionItemnoticeContent01
                );
    
                //3
                const calciteAccordionItem02 = document.createElement(
                  "calcite-accordion-item"
                );
                calciteAccordionItem02.description =
                  "we can plot any description here";
                calciteAccordionItem02.heading = "Lowest";
                calciteAccordionItem02.setAttribute(
                  "icon-start",
                  "graph-moving-average"
                );
                calciteAccordionItem02.setAttribute("expanded", true);
    
                calciteAccordion.append(calciteAccordionItem02);
    
                const calciteAccordionItemNotice02 =
                  document.createElement("calcite-notice");
                calciteAccordionItemNotice02.setAttribute("open", true);
                calciteAccordionItem02.append(calciteAccordionItemNotice02);
    
                const calciteAccordionItemnoticeContent02 =
                  document.createElement("div");
                calciteAccordionItemnoticeContent02.slot = "message";
                calciteAccordionItemnoticeContent02.innerHTML = `${FLowest}`;
                calciteAccordionItemNotice02.append(
                  calciteAccordionItemnoticeContent02
                );
    
                if (!isLastLevel) {
                  const button = document.createElement("calcite-button");
                  button.slot = "footer";
                  button.width = "full";
                  button.innerText = "Move to a third Flow Item";
                  button.addEventListener("click", (event) => {
                    alert("F");
                  });
                  if (!isLastLevel) newFeatureFlowItem.append(button);
                }
    
                flow.append(newFeatureFlowItem);
              }
            );
          } else {
            if (graph.graphic.attributes.streetType === "General") {
              const featureFlowListItem = document.createElement("calcite-list-item");

              featureFlowListItem.label = graph.graphic.attributes.areaName;
              featureFlowListItem.description = `Street Type: ${graph.graphic.attributes.streetType} - Space Value: ${graph.graphic.attributes.Space}`;
      
              const featureAction = document.createElement("calcite-action");
              featureAction.slot = "actions-end";
              featureAction.icon = "number-of-territories";
              featureAction.text = "Kuwait Areas";
              featureFlowListItem.append(featureAction);
      
              calciteList.append(featureFlowListItem);
      
              let FHighest = numberWithCommas(graph.graphic.attributes.Highest);
              let FAverage = numberWithCommas(graph.graphic.attributes.Average);
              let FLowest = numberWithCommas(graph.graphic.attributes.Lowest);
              // console.log(numberWithCommas(graph.attributes.Highest));
      
              featureFlowListItem.addEventListener(
                "calciteListItemSelect",
                function () {
                  const newFeatureFlowItem =
                    document.createElement("calcite-flow-item");
                  newFeatureFlowItem.heading = `${graph.graphic.attributes.areaName}`;
                  newFeatureFlowItem.description = `${graph.graphic.attributes.areaName}`;
      
                  const calciteAccordion =
                    document.createElement("calcite-accordion");
                  calciteAccordion.appearance = "solid";
                  calciteAccordion.setAttribute("icon-position", "start");
                  calciteAccordion.setAttribute("icon-type", "chevron");
      
                  const calciteAccordionItem = document.createElement(
                    "calcite-accordion-item"
                  );
                  calciteAccordionItem.description =
                    "we can plot any description here";
                  calciteAccordionItem.heading = "Highest";
                  calciteAccordionItem.setAttribute(
                    "icon-start",
                    "graph-moving-average"
                  );
                  calciteAccordionItem.setAttribute("expanded", true);
      
                  calciteAccordion.append(calciteAccordionItem);
      
                  const calciteAccordionItemNotice =
                    document.createElement("calcite-notice");
                  calciteAccordionItemNotice.setAttribute("open", true);
                  calciteAccordionItem.append(calciteAccordionItemNotice);
      
                  const calciteAccordionItemnoticeContent =
                    document.createElement("div");
                  calciteAccordionItemnoticeContent.slot = "message";
                  calciteAccordionItemnoticeContent.innerHTML = `${FHighest}`;
                  calciteAccordionItemNotice.append(
                    calciteAccordionItemnoticeContent
                  );
                  newFeatureFlowItem.append(calciteAccordion);
      
                  //2
                  const calciteAccordionItem01 = document.createElement(
                    "calcite-accordion-item"
                  );
                  calciteAccordionItem01.description =
                    "we can plot any description here";
                  calciteAccordionItem01.heading = "Average";
                  calciteAccordionItem01.setAttribute(
                    "icon-start",
                    "graph-moving-average"
                  );
                  calciteAccordionItem01.setAttribute("expanded", true);
      
                  calciteAccordion.append(calciteAccordionItem01);
      
                  const calciteAccordionItemNotice01 =
                    document.createElement("calcite-notice");
                  calciteAccordionItemNotice01.setAttribute("open", true);
                  calciteAccordionItem01.append(calciteAccordionItemNotice01);
      
                  const calciteAccordionItemnoticeContent01 =
                    document.createElement("div");
                  calciteAccordionItemnoticeContent01.slot = "message";
                  calciteAccordionItemnoticeContent01.innerHTML = `${FAverage}`;
                  calciteAccordionItemNotice01.append(
                    calciteAccordionItemnoticeContent01
                  );
      
                  //3
                  const calciteAccordionItem02 = document.createElement(
                    "calcite-accordion-item"
                  );
                  calciteAccordionItem02.description =
                    "we can plot any description here";
                  calciteAccordionItem02.heading = "Lowest";
                  calciteAccordionItem02.setAttribute(
                    "icon-start",
                    "graph-moving-average"
                  );
                  calciteAccordionItem02.setAttribute("expanded", true);
      
                  calciteAccordion.append(calciteAccordionItem02);
      
                  const calciteAccordionItemNotice02 =
                    document.createElement("calcite-notice");
                  calciteAccordionItemNotice02.setAttribute("open", true);
                  calciteAccordionItem02.append(calciteAccordionItemNotice02);
      
                  const calciteAccordionItemnoticeContent02 =
                    document.createElement("div");
                  calciteAccordionItemnoticeContent02.slot = "message";
                  calciteAccordionItemnoticeContent02.innerHTML = `${FLowest}`;
                  calciteAccordionItemNotice02.append(
                    calciteAccordionItemnoticeContent02
                  );
      
                  if (!isLastLevel) {
                    const button = document.createElement("calcite-button");
                    button.slot = "footer";
                    button.width = "full";
                    button.innerText = "Move to a third Flow Item";
                    button.addEventListener("click", (event) => {
                      alert("F");
                    });
                    if (!isLastLevel) newFeatureFlowItem.append(button);
                  }
      
                  flow.append(newFeatureFlowItem);
                }
              );
            } else {
              return;
            }

          }

        }

      });
      // flow.appendChild(featureFlowItem);
    }



    view.when(() => {
      pricingGroupLayer.layers.items.map(async (layy) => {
        if (layy.visible === true) {
          view.whenLayerView(layy).then(function (layerView) {
            console.log(layerView, "layerViewlayerViewlayerView");
            view.goTo(
              {
                target: layy.fullExtent,
                // zoom: 11
              },
              {
                duration: 2000,
              }
            );
          });
        }

        if (layy.title === "Investments") {
          view.whenLayerView(layy).then(function (layerView) {
            layerInvestments = layy;
            layerviewInvestments = layerView;
            layy.renderer = renderer01;
          });
        } else {
          view.whenLayerView(layy).then(function (layerView) {
            layerKuwaitPricing = layy;
            layerviewKuwaitPricing = layerView;
            layy.renderer = renderer;
          });
        }
      });
    });

    try {
      if (featureLayers) {
        // addareas(featureLayers);
        // const selectedStType = await getAllStreetsTypes(featureLayers);






        const debouncedUpdate = promiseUtils.debounce(
          async (event, isClick) => {
            // console.log(event, "eventt");
            // Perform a hitTest on the View
            const hitTest = await view.hitTest(event);
            // console.log(event, "eventt");
            // Make sure graphic has a popupTemplate
            const results = hitTest.results.filter((result) => {
              if (result.layer.title === "Residential Houses") {
                return result.layer.title === "Residential Houses";
              } else {
                return result.layer.title === "Investments";
              }
            });

            const result = results;
            const graphic = results[0];
            // console.log(result, "result[0]]]]"); // array of graphics
            if (isClick) {
              if (result && graphic) {
                clearSelection();
                calsiteshell.style.display = "block";
                view.ui.add(calsiteshell, "bottom-left");
                view.ui.remove(legend);
                selectedGraphic = graphic.graphic;
                // console.log(selectedGraphic, "selectedGraphic");
                createFeatureFlowItems(result, false);
                view.goTo(
                  {
                    target: selectedGraphic,
                    // zoom: 11
                  },
                  {
                    duration: 1000,
                  }
                );
                view.highlightOptions = {
                  color: "#000000",
                  fillOpacity: 0,
                  haloOpacity: 1,
                  haloColor: "black",
                  shadowColor: "black",
                  shadowOpacity: 1,
                };
                if (selectedGraphic.layer.title === "Investments") {
                  selectedHighlight =
                    layerviewInvestments.highlight(selectedGraphic);
                } else {
                  selectedHighlight =
                    layerviewKuwaitPricing.highlight(selectedGraphic);
                }
              } else {
                // console.log("no results");
                clearSelection();
                if (calsiteshell) {
                  calsiteshell.style.display = "none";
                }
                view.ui.remove(calsiteshell);
                view.ui.add(legend, "bottom-left");
                pricingGroupLayer.layers.items.map(async (layy) => {
                  if (layy.visible === true) {
                    view.whenLayerView(layy).then(function (layerView) {
                      // console.log(layerView, "layerViewlayerViewlayerView");
                      layerView.filter = null;
                      view.goTo(
                        {
                          target: layy.fullExtent,
                          // zoom: 11
                        },
                        {
                          duration: 1000,
                        }
                      );
                    });
                  }
                });
              }
            } else {
              if (result && graphic) {
                let selectedGraphic01 = graphic.graphic;

                // console.log(selectedGraphic01, "hereeeeeeeeeeeeeeeeeeeee")
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
                if (selectedGraphic01.layer.title === "Investments") {
                  moveHighlight =
                    layerviewInvestments.highlight(selectedGraphic01);
                } else {
                  moveHighlight =
                    layerviewKuwaitPricing.highlight(selectedGraphic01);
                }
              } else {
                // console.log("RRRRR")
                removeMoveHighlight();
                function removeMoveHighlight() {
                  if (moveHighlight) {
                    moveHighlight.remove();
                    moveHighlight = null;
                  }
                }
              }
            }
          }
        );

        // Listen for the click event on the View
        view.on("click", (event) => {
          debouncedUpdate(event, true).catch((err) => {
            if (!promiseUtils.isAbortError(err)) {
              throw err;
            }
          });
        });

        // Listen for the pointer-move event on the View
        view.on("pointer-move", (event) => {
          debouncedUpdate(event, false).catch((err) => {
            if (!promiseUtils.isAbortError(err)) {
              throw err;
            }
          });
        });
      }
    } catch (error) {
      // here if not found
    }


    dropdownL.addEventListener('calciteDropdownItemSelect', (event) => {
      clearSelection();
      if (calsiteshell) {
        calsiteshell.style.display = "none";
      }
      view.ui.remove(calsiteshell);
      view.ui.add(legend, "bottom-left");
      stbtn.innerHTML = "Choose street type";
      spbtn.innerHTML = "Choose space value";
      
      let btnval = document.getElementById('areasbtn');
      const selectedItem = event.target.textContent;
      btnval.innerHTML = selectedItem;
      console.log('Selected Item:', selectedItem);
      pricingGroupLayer.layers.items.map(async (layy) => {
        view.whenLayerView(layy).then(async function (layerView) {
          if (layy.title === selectedItem) {
            await getAllStreetsTypes(layy);
            if (layy.visible === false) {
              layy.visible = true;
              layerView.filter = null;
              view.goTo(
                {
                  target: layy.fullExtent,
                  // zoom: 11
                },
                {
                  duration: 1000,
                }
              );
            } else {
              layerView.filter = null;
              view.goTo(
                {
                  target: layy.fullExtent,
                  // zoom: 11
                },
                {
                  duration: 1000,
                }
              );
  
  
            }
          }
        });

      });



    });

    
    function addareas(layers) {
      console.log(layers, "lllllllllllll");
      let calcitedg = document.createElement('calcite-dropdown-group');
      calcitedg.setAttribute('group-title', "Available Areas");
      layers.map(async(l) => {
        let calciteItem = document.createElement('calcite-dropdown-item');
        calciteItem.innerHTML = l.title;
        calcitedg.append(calciteItem);
        dropdownL.append(calcitedg);
      })
    }



    async function getAllStreetsTypes(area) {
      var stTypes = [];
      let calciteItemSt;

      const dropdownItems = dropdownSt.querySelectorAll('calcite-dropdown-item');
      dropdownItems.forEach(item => item.remove());

        area.source.items.map(async(item) => {
          if (item.attributes.streetType === "General") {
            return;
          } else {
            if (!stTypes.includes(item.attributes.streetType)) {
              stTypes.push(item.attributes.streetType)
              calciteItemSt = document.createElement('calcite-dropdown-item');
              calciteItemSt.innerHTML = item.attributes.streetType;
              dropdownSt.append(calciteItemSt);
            }
          }
        })


        if (calciteItemSt) {
          dropdownSt.addEventListener('calciteDropdownItemSelect', (event) => {
            var spValues = [];
            let calciteItemSp;
            const dropdownItemsSp = dropdownSp.querySelectorAll('calcite-dropdown-item');
            dropdownItemsSp.forEach(item => item.remove());


            const selectedStreetType = event.target.textContent;
            console.log('selectedStreetType:', selectedStreetType);
            stbtn.innerHTML = selectedStreetType;
            
            area.source.items.map(async(item) => {
              if (item.attributes.streetType === "General") {
                return;
              } else {
                if (item.attributes.streetType === selectedStreetType) {
                  if (!spValues.includes(item.attributes.Space)) {
                    spValues.push(item.attributes.Space)
                    calciteItemSp = document.createElement('calcite-dropdown-item');
                    calciteItemSp.innerHTML = item.attributes.Space;
                    dropdownSp.appendChild(calciteItemSp);
                  }
                }
              }
            })

            pricingGroupLayer.layers.items.map(async (layy) => {
              if (layy.visible === true) {
                view.whenLayerView(layy).then(function (layerView) {
                  console.log(layy, "JJJ");
                  if (layerView) {
                    layy.source.items.map(async(item) => {
                      if (item.attributes.streetType === selectedStreetType) {
                        const filter = new FeatureFilter({
                          where: "streetType = '"+selectedStreetType+"'"
                        });
                        layerView.filter = filter;

                        const query = {
                          where:  layerView.filter.where,
                          returnGeometry: true,
                        };
                        let {extent, count} = await layerView.queryExtent(query);
                        if (count == 0){
                          let {extent, count} = await layy.queryExtent(query);
                          view.goTo(extent);
                          console.log("layer query extent")
                        } else {
                          view.goTo(extent);
                          console.log("layerview query extent");
                        }
                      }
                    })
                  }
                });
              }
            });

            dropdownSp.addEventListener('calciteDropdownItemSelect', (event) => {
          

              const selectedStreetSpaceval = event.target.textContent;
              console.log('selectedStreetSpaceval:', selectedStreetSpaceval);
              spbtn.innerHTML = selectedStreetSpaceval;
              
              pricingGroupLayer.layers.items.map(async (layy) => {
                if (layy.visible === true) {
                  view.whenLayerView(layy).then(function (layerView) {
                    console.log(layy, "JJJ");
                    if (layerView) {
                      layy.source.items.map(async(item) => {
                        if (item.attributes.Space === selectedStreetSpaceval) {
                          const filter = new FeatureFilter({
                            where: "Space = '" + selectedStreetSpaceval + "' AND streetType = '" + selectedStreetType + "'"
                          });
                          layerView.filter = filter;
  
                          const query = {
                            where:  layerView.filter.where,
                            returnGeometry: true,
                          };
                          let {extent, count} = await layerView.queryExtent(query);
                          if (count == 0){
                            let {extent, count} = await layy.queryExtent(query);
                            view.goTo(extent);
                            console.log("layer query extent")
                          } else {
                            view.goTo(extent);
                            console.log("layerview query extent");
                          }
                        }
                      })
                    }
                  });
                }
              });
  
            });
          });
        }



        // if (calciteItemSp)


    }
    

    // try {
    //   const featureLayers = await createFeatureLayers(geojsons);
    //   // now we have the featureslayers
    // } catch (error) {
    //   // here if not found
    // }

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

    //add widgets
    addWidgets()
      .then(([view, displayMap]) => {
        console.log("Widgets Returned From Require Scope", view, displayMap);
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



    view.ui.add(dropdownL, "top-right");
    view.ui.add(dropdownSt, "top-right");
    view.ui.add(dropdownSp, "top-right");



    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function (event) {
        var item = event.item;
        if (item.layer.type === "group"){
          item.open = true;
        }
        // item.watch("visible", (event) => {
        //   layerList.operationalItems.forEach((layerView) => {
        //     if (layerView.layer.id != item.layer.id) {
        //       layerView.visible = false;
        //     }
        //   });
        // });
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
    layerList.selectionMode = "single";
    Expand5.expanded = true;
    // view.ui.add([Expand5], { position: "top-left", index: 6 });
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

/**
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
export class Action {
    /**
     * @param {*} scene which serves as a container of all visual elements
     */
    constructor(scene) {
        this.canvas = window.interactiveCanvas;
        this.scene = scene;
        this.commands = {
            // AOG Education Global Commands
            AOG_MAIN_MENU_SELECTION: (data) => {
                if (data.selection == "geography") {
                    this.scene.openGeography();
                } else if (data.selection == "language") {
                    this.scene.openLanguage();
                } else if (data.selection == "reading") {
                    this.scene.openReading();
                }
            },

            // AOG Education Geography Commands
            LOAD_STATE_MAP: (data) => {
                if (!this.scene.map) {
                    this.scene.openGeographyMap();
                }

                const coords = data.coords;
                this.scene.map = new google.maps.Map(document.getElementById('map'));
                this.scene.map.setCenter({lat: coords[0].lat, lng: coords[0].lng});
                this.scene.map.setZoom(5);
        
                // Construct the polygon.
                let polygon = new google.maps.Polygon();
                polygon.setOptions({
                    paths: coords,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35
                });
                polygon.setMap(this.scene.map);
        
                const labelsOff = [
                    {
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.province",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "lightness": -100
                            },
                            {
                                "weight": 1
                            }
                        ]
                    }
                ];
                this.scene.map.set('styles', labelsOff);
            },
            LOAD_COUNTRY_MAP: (data) => {
                if (!this.scene.map) {
                    this.scene.openGeographyMap();
                }

                this.scene.map = new google.visualization.GeoChart(document.getElementById('map'));
                const dataTable = google.visualization.arrayToDataTable([
                    ['Country'],
                    [data.country],
                ]);
        
                const options = {
                    backgroundColor: '#81d4fa',
                    datalessRegionColor: '#ffd7e9',
                    defaultColor: '#8b0000',
                    region: data.region,
                    tooltip: {trigger: 'none'},
                };
        
                this.scene.map.draw(dataTable, options);
            },

            // AOG Education Language Commands
            // AOG Education Reading Commands
        };
        this.commands.AOG_MAIN_MENU_SELECTION.bind(this);
        
        // Bind AOG Education Geography Commands
        this.commands.LOAD_COUNTRY_MAP.bind(this);
        this.commands.LOAD_STATE_MAP.bind(this);
    }
    /**
     * Register all callbacks used by Interactive Canvas
     * executed during scene creation time.
     *
     */
    setCallbacks() {
        // declare Interactive Canvas callbacks
        const callbacks = {
            onUpdate: (data) => {
                try {
                    this.commands[data[0].command.toUpperCase()](data[0]);
                } catch (e) {
                    // do nothing, when no command is sent or found
                }
            },
        };
        callbacks.onUpdate.bind(this);
        // called by the Interactive Canvas web app once web app has loaded to
        // register callbacks
        this.canvas.ready(callbacks);
    }
}

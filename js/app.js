mapboxgl.accessToken = 'pk.eyJ1IjoieWlsYXZhbWFwIiwiYSI6ImNqMWd1c2ludDAwNHQzMnAwN3Y3OW9iazYifQ.QpHpRCKr5GyM7rWy6Tnh9Q';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/yilavamap/cjin89r520yud2sqo3jlxh4rb',
        bearing: 0,
        center: [-19.031064350369434,64.78541099852711],
        zoom: 5.00,
        pitch: 0,
        maxZoom: 18
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var hoverId = null;

var expanded = true;

var matchPopup = null;

map.on('load', function() {
    map.addLayer({
        id: 'population',
        type: 'fill-extrusion',
        source: {
            type: 'vector',
            url: 'mapbox://yilavamap.7xbjl1ge'
        },
        'source-layer': 'qualifiers-87phx9',
        layout: {
            visibility: 'none'
        },
        paint: {
            'fill-extrusion-color': {
                property: 'population',
                type: 'interval',
                stops: [
                    [337780, '#ffffd9'],
                    [5754356, '#edf8b1'],
                    [11364372, '#c7e9b4'],
                    [32885991, '#7fcdbb'],
                    [46017766, '#41b6c4'],
                    [66573504, '#1d91c0'],
                    [127185332, '#225ea8'],
                    [143964709, '#253494'],
                    [143964709, '#081d58']
                ]
            },
            'fill-extrusion-height': ['/', ['get', 'population'], 50],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': .9
        }
    }, 'country-large');

    map.addSource('playerData', {
        type: 'geojson',
        data: './data/players.geojson'
    });

    map.addLayer({
        id: 'players',
        type: 'circle',
        source: 'playerData',
        layout: {
            'visibility': 'none'
        },
        paint: {
            'circle-color': '#fff',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000',
            'circle-radius': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                15,
                12
            ]
        }
    });

    map.addLayer({
        id: 'playersCount',
        type: 'symbol',
        source: 'playerData',
        layout: {
            'text-field': '{count}',
            'text-allow-overlap': true,
            'text-ignore-placement': true
        },
        paint: {
            'text-color': '#000'
        }
    });


    map.loadImage('./data/otkritie.png', function(error, image) {
        if (error) throw error;
        map.addImage('otkritie', image);
        map.addLayer({
            id: 'otkritie_arena',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [37.44025, 55.817861]
                        }
                    }]
                }
            },
            maxzoom: 16,
            layout: {
                'icon-image': 'otkritie',
                'icon-size': [
                    'interpolate', ['exponential', 1.25], ['zoom'],
                    12, 0,
                    15, 1
                ]
            }
        });
    });

    map.addSource('stadiumsData', {
        type: 'geojson',
        data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [37.44025, 55.817861]
                    },
                    properties: {
                        stadium: 'Otkritie Arena',
                        short: 'otkritie'
                    },
                    id: 1
                }, {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [44.548611, 48.734444]
                    },
                    properties: {
                        stadium: 'Volgograd Arena',
                        short: 'volgograd'
                    },
                    id: 2
                }, {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [39.737778, 47.209444]
                    },
                    properties: {
                        stadium: 'Rostov Arena',
                        short:'rostov'
                    },
                    id: 3
                }]
            }
    });

    map.addLayer({
        id: 'stadium-halo',
        type: 'circle',
        source: 'stadiumsData',
        paint: {
            'circle-color': '#162026',
            'circle-radius': 10,
            'circle-stroke-color': '#f1dbb9',
            'circle-stroke-width': 1,
            'circle-opacity': 0.25
        }
    });

    map.addLayer({
        id: 'stadium-circle',
        type: 'circle',
        source: 'stadiumsData',
        paint: {
            'circle-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#f1dbb9',
                '#162026'
            ],
            'circle-radius': 10,
            'circle-stroke-color': '#f1dbb9',
            'circle-stroke-width': 1,
            'circle-opacity': 1
        }
    });

    map.addLayer({
        id: 'stadium-icon',
        type: 'symbol',
        source: 'stadiumsData',
        layout: {
            'icon-image': 'star-15',
            'icon-allow-overlap': true
        }
    });

    // When the user moves their mouse over the players layer, we'll update the
    // feature state for the feature under the mouse.
    map.on('mouseenter', 'players', function(e) {
        if (e.features.length) {
            map.getCanvas().style.cursor = 'pointer';
            if (hoverId) {
                map.setFeatureState({source: 'playerData', id: hoverId}, { hover: false});
            }
            hoverId = e.features[0].id;
            map.setFeatureState({source: 'playerData', id: hoverId}, { hover: true});
        }
    });

    // Reset layer's feature state when the mouse leaves the layer.
    map.on('mouseleave', 'players', function() {
        map.getCanvas().style.cursor = '';
        if (hoverId) {
            map.setFeatureState({source: 'playerData', id: hoverId}, { hover: false});
        }
        hoverId =  null;
    });

    map.on('mouseenter', 'stadium-circle', function(e) {
        if (e.features.length) {
            map.getCanvas().style.cursor = 'pointer';
            if (hoverId) {
                map.setFeatureState({source: 'stadiumsData', id: hoverId}, { hover: false});
            }
            hoverId = e.features[0].id;
            map.setFeatureState({source: 'stadiumsData', id: hoverId}, { hover: true});
            $(`#stadium${hoverId}`).mouseenter();
        }
    });

    map.on('mouseleave', 'stadium-circle', function() {
        map.getCanvas().style.cursor = '';
        if (hoverId) {
            map.setFeatureState({source: 'stadiumsData', id: hoverId}, { hover: false});
            $(`#stadium${hoverId}`).mouseleave();
        }
        hoverId =  null;
    });

    map.on('click', 'players', function(e) {
        if (e.features.length) {
            var htmlContent = '';
            htmlContent += `<strong>Country: </strong><span>${e.features[0].properties.country}</span>`;
            var players = JSON.parse(e.features[0].properties.players);
            for (player of players) {
                htmlContent +=
                `   <hr>
                    <p><strong>Name: </strong><span>${player.name}</span></p>
                    <p><strong>Age: </strong><span>${player.age}</span></p>
                    <p><strong>Club: </strong><span>${player.club}</span></p>
                `
            }
            new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(htmlContent)
                .addTo(map);
        }
    });

    // On every scroll event, check which element is on screen
    window.onscroll = function() {
        var chapterNames = Object.keys(chapters);
        for (var i = 0; i < chapterNames.length; i++) {
            var chapterName = chapterNames[i];
            if (isElementOnScreen(chapterName)) {
                setActiveChapter(chapterName);
                break;
            }
        }
    };
    var activeChapterName = 'welcome';
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;
        if (chapters[chapterName].camera) {
            map.flyTo(chapters[chapterName].camera);
        }
        chapters[chapterName].mapFunc();
        document.getElementById(chapterName).setAttribute('class', 'active');
        document.getElementById(activeChapterName).setAttribute('class', '');
        activeChapterName = chapterName;
    }
    function isElementOnScreen(id) {
        var element = document.getElementById(id);
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
    }

    //Animates the above layer forever by at a specific interval (500ms)
    window.setInterval(function(){
        //If the circle is expanded, reduce the size and opacity
        //If the circle is not expanded, increase the size and opacity
        var size = (expanded)? 10 : 20;
        var opacity = (expanded)? 0 : 0.25;

        //Change the radius and opacity of the circles
        if (map.getLayer('stadium-halo')) {
            map.setPaintProperty('stadium-halo', 'circle-radius', size);
            map.setPaintProperty('stadium-halo', 'circle-opacity', opacity);
        }

        //Toggle the value of expanded
        expanded = !expanded;
    },500);
});

$('.match').mouseenter(function() {
    $(this).css('background-color', '#415766');
    map.setFeatureState({source: 'stadiumsData', id: parseInt(this.id.match(/\d+/)[0])}, { hover: true});
});

$('.match').mouseleave(function() {
    $(this).css('background-color', '');
    map.setFeatureState({source: 'stadiumsData', id: parseInt(this.id.match(/\d+/)[0])}, { hover: false});
});


var chapters = {
    'welcome': {
        camera: {
            bearing: 0,
            center: [-19.031064350369434,64.78541099852711],
            zoom: 5.00,
            pitch: 0
        },
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'none');
            map.setLayoutProperty('players', 'visibility', 'none');
            map.setLayoutProperty('playersCount', 'visibility', 'none');
            map.setLayoutProperty('stadium-halo', 'visibility', 'none');
            map.setLayoutProperty('stadium-circle', 'visibility', 'none');
            map.setLayoutProperty('stadium-icon', 'visibility', 'none');
            $('#legend').hide();
        }
    },
    'section1': {
        camera: {
            bearing: 0,
            center: [160,55],
            zoom: 0,
            speed: 0.8,
            pitch: 60
        },
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'visible');
            map.setLayoutProperty('players', 'visibility', 'none');
            map.setLayoutProperty('playersCount', 'visibility', 'none');
            map.setLayoutProperty('stadium-halo', 'visibility', 'none');
            map.setLayoutProperty('stadium-circle', 'visibility', 'none');
            map.setLayoutProperty('stadium-icon', 'visibility', 'none');
            $('#legend').show();
        }
    },
    'section2': {
        camera: null,
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'none');
            map.setLayoutProperty('players', 'visibility', 'visible');
            map.setLayoutProperty('playersCount', 'visibility', 'visible');
            map.setLayoutProperty('stadium-halo', 'visibility', 'none');
            map.setLayoutProperty('stadium-circle', 'visibility', 'none');
            map.setLayoutProperty('stadium-icon', 'visibility', 'none');
            $('#legend').hide();
            map.setPitch(0);
            map.setBearing(0);
            map.fitBounds([[-21.933333, 40.3], [47.7, 64.133333]], {
                padding: 50
            });
        }
    },
    'section3': {
        camera: {
            bearing: -42.4,
            center: [37.44025, 55.817861],
            zoom: 15,
            speed: 1,
            pitch: 43
        },
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'none');
            map.setLayoutProperty('players', 'visibility', 'none');
            map.setLayoutProperty('playersCount', 'visibility', 'none');
            map.setLayoutProperty('stadium-halo', 'visibility', 'none');
            map.setLayoutProperty('stadium-circle', 'visibility', 'none');
            map.setLayoutProperty('stadium-icon', 'visibility', 'none');
            $('#legend').hide();
        }
    },
    'section4': {
        camera: null,
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'none');
            map.setLayoutProperty('players', 'visibility', 'none');
            map.setLayoutProperty('playersCount', 'visibility', 'none');
            map.setLayoutProperty('stadium-halo', 'visibility', 'visible');
            map.setLayoutProperty('stadium-circle', 'visibility', 'visible');
            map.setLayoutProperty('stadium-icon', 'visibility', 'visible');
            $('#legend').hide();
            map.setPitch(0);
            map.setBearing(0);
            map.fitBounds([[37.44025, 47.209444], [44.548611, 55.817861]], {
                padding: 200
            });
        }
    },
    'section5': {
        camera: {
            bearing: 0,
            center: [-19.031064350369434,64.78541099852711],
            zoom: 5.00,
            pitch: 0
        },
        mapFunc: function() {
            map.setLayoutProperty('population', 'visibility', 'none');
            map.setLayoutProperty('players', 'visibility', 'none');
            map.setLayoutProperty('playersCount', 'visibility', 'none');
            map.setLayoutProperty('stadium-halo', 'visibility', 'none');
            map.setLayoutProperty('stadium-circle', 'visibility', 'none');
            map.setLayoutProperty('stadium-icon', 'visibility', 'none');
            $('#legend').hide();
        }
    }
};


// add a vertical bar chart reference: https://www.highcharts.com/demo/bar-basic
Highcharts.chart('container', {
    chart: {
        type: 'bar',
        backgroundColor: '#182025',
        style: {
            fontFamily: '\'Lato\', sans-serif'
        },
    },
    title: {
        text: 'Population in 2017',
        style: {
            color: '#E0E0E3'
        }
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)">Wikipedia</a>',
        style: {
            color: '#E0E0E3'
        }
    },
    xAxis: {
        type: 'category',
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            text: 'Population (millions)',
            style: {
                color: '#A0A0A3'
            }
        }
    },
    legend: {
        enabled: false,
        layout: 'vertical'
    },
    tooltip: {
        formatter: function() {
            return `${this.point.name}: <b>${(this.point.y/1000000).toFixed(1)} million</b>`
        }
    },
    series: [{
        name: 'Population',
        data: [
            ["Iceland",335025],
            ["Uruguay",3456750],
            ["Panama",4098587],
            ["Croatia",4189353],
            ["Costa Rica",4905769],
            ["Denmark",5733551],
            ["Switzerland",8476005],
            ["Serbia",8790574],
            ["Sweden",9910701],
            ["Portugal",10329506],
            ["Belgium",11429336],
            ["Tunisia",11532127],
            ["Senegal",15850567],
            ["Australia",24450561],
            ["Peru",32165485],
            ["Saudi Arabia",32938213],
            ["Morocco",35739580],
            ["Poland",38170712],
            ["Argentina",44271041],
            ["Spain",46354321],
            ["Colombia",49065615],
            ["South Korea",50982212],
            ["France",64979548],
            ["United Kingdom",66181585],
            ["Iran",81162788],
            ["Germany",82114224],
            ["Egypt",97553151],
            ["Japan",127484450],
            ["Mexico",129163276],
            ["Russia",143989754],
            ["Nigeria",190886311],
            ["Brazil",209288278]
        ],
        dataLabels: {
            enabled: false
        }
    }]
});

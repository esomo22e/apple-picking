function Map() {
    var _map;
    var current_position, current_accuracy,
        autoLocate=true;
    var exports = function(selection){
        var _farmData=[];
        //console.log("Set the map");
        //map layer
        //light map https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVybWlvbmV3eSIsImEiOiJjaXZ5OWI1MTYwMXkzMzFwYzNldTl0cXRoIn0.Uxs4L2MP0f58y5U-UqdWrQ
        var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png', {
    attribution: 'Tiles Courtesy of <a href="http://www.esri.com/software/arcgis/arcgisonline/maps/maps-and-map-layers" target="_blank">Esri</a>'
});
        var streetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png', {
    attribution: 'Tiles Courtesy of <a href="http://www.esri.com/software/arcgis/arcgisonline/maps/maps-and-map-layers" target="_blank">Esri</a>'
});

        _map.setView([42.323, -71.572], 8.5);
        satelliteMap.addTo(_map);

        var baseMaps = {
            // "Satellite": satelliteMap
            // "Street": streetMap
        };
        var arr = selection.datum()? selection.datum():[];
        var zoom = 15;
        //ADD ICON

        // var iconStyle= {
        //     iconUrl: './assets/leaf-red.png',
        //     shadowUrl: './assets/leaf-shadow.png',
        //     iconSize:     [19, 47.5], // size of the icon
        //     shadowSize:   [25, 32], // size of the shadow
        //     iconAnchor:   [11, 47], // point of the icon which will correspond to marker's location
        //     shadowAnchor: [2, 31],  // the same for the shadow
        //     popupAnchor:  [-3, -38] // point from which the popup should open relative to the iconAnchor
        // };
        // var orangeZoom= {
        //     iconUrl: './assets/leaf-red.png',
        //     shadowUrl: './assets/leaf-shadow.png',
        //     iconSize:     [38, 95],
        //     shadowSize:   [50, 64],
        //     iconAnchor:   [22, 94],
        //     shadowAnchor: [4, 62],
        //     popupAnchor:  [-3, -76]
        // };

        var iconStyle= {
            iconUrl: './assets/apple6.png',
            //shadowUrl: './assets/leaf-shadow.png',
            iconSize:     [23, 23], // size of the icon
            popupAnchor:  [-1.5, -17.5] // point from which the popup should open relative to the iconAnchor
        };
        var orangeZoom= {
            iconUrl: './assets/apple6.png',
            //shadowUrl: './assets/leaf-shadow.png',
            iconSize:     [50, 50],
            popupAnchor:  [-3, -35]
        };

        var iconSmall = L.icon(iconStyle),
            iconLarge = L.icon(orangeZoom);

        var markersLayer = L.layerGroup();
        //_map.locate();
        var farmMarkers = Array.from(arr,function(d, i){
            // var popUp = L.popup()
            //     .setContent("<p><span> "+ d.LocationName+
            //         " </span></p><p><b>Address:</b> "
            //         +d.addresses+"<br/> <a target='_blank' href='http://"
            //         +d.Website +"'>Website</a> | <a target='_blank' href='http://maps.google.com/maps?f=q&hl=en&q=from:Boston%2c+MA+to:"+encodeURIComponent(d.addresses)+"'> Directions </a><br/><b>TEL:</b> "
            //         + d.Phone+"</br><b>Description:</b> "
            //         +d.Description+" </p>");


            var popUp = L.popup()
                .setContent("<p><span> "+ d.LocationName+
                    " </span></p><p><b>Address:</b> "
                    +d.addresses+"<br/><b>TEL:</b> "
                    + d.Phone+ "<br/><b>Hours:</b> "+ d.hours +" <br/> <a target='_blank' href='http://"
                    +d.Website +"'>Website</a> | <a target='_blank' href='http://maps.google.com/maps?f=q&hl=en&q=from:Boston%2c+MA+to:"+encodeURIComponent(d.addresses)+"'> Directions </a></p>");

            //href="http://maps.google.com/maps?f=q&hl=en&q=from:Boston%2c+MA+to:12%20Lincoln%20Road,%20North%20Brookfield,%20MA%2001535"

            var marker = L.marker([+d.lat, +d.lon],
                {icon: iconSmall, riseOnHover: true})
                .bindPopup(popUp);
            markersLayer.addLayer(marker);
            // var saveLatLng =L.latLng(42.323, -71.072);

            // marker.on('click', function(e){
            //     if (_map.getZoom()<=12){
            //         _map.flyTo(e.latlng, zoom);
            //     } else if (atLng == e.latlng){
            //             _map.flyTo(e.latlng, 8.5);
            //     } else{
            //         iconStyle.iconSize = [40, 40];
            //         _map.panTo(e.latlng);
            //     }
            //     saveLatLng= e.latlng;
            // });

            // _map.on('zoom', function (e) {
            //     if (_map.getZoom()<12){
            //         marker.setIcon(iconSmall);
            //     } else{
            //         marker.setIcon(iconLarge);
            //     }
            //
            // });
        });
        function currentPositionToGoogleQuery(cp) {
            if(cp){return encodeURIComponent (cp);}
            else {
                return "Boston%2c";
            }
        }
        markersLayer.addTo(_map);
       //  var overlay = {'Farms': markersLayer};
       // L.control.layers(baseMaps, overlay).addTo(_map);

        L.easyButton('<img src="https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png" width="15px"/>', function(btn, map){
            _map.locate();
            _map.on('locationerror', onLocationError);
            _map.on('locationfound', onLocationFound);
        }).addTo(_map);

        //______search input:It works but Enter button doesn't
        /*
        var geocoder = new google.maps.Geocoder();

        function googleGeocoding(text, callResponse)
        {
            geocoder.geocode({address: text}, callResponse);
        }

        _map.addControl( new L.Control.Search({
            sourceData: googleGeocoding,
            formatData: formatJSON,
            markerLocation: true,
            autoType: false,
            zoom: 13,
            autoCollapse: true,
            minLength: 2
        }) );

        function formatJSON(rawjson)
        {
            var json = {},
                key, loc, disp = [];

            for(var i in rawjson)
            {
                key = rawjson[i].formatted_address;

                loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );

                json[ key ]= loc; //key,value format
            }

            return json;
        } */

        function onLocationError(e) {
            alert(e.message);
        }


        function onLocationFound(e) {
            if (current_position) {
                _map.removeLayer(current_position);
                _map.removeLayer(current_accuracy);
            }
            var position = [e.latitude, e.longitude];

                var radius = 100;
                // _map.setView(position, zoom);
                current_position = L.marker(e.latlng).addTo(_map)
                    .bindPopup("You are here.").openPopup();
                current_accuracy = L.circle(e.latlng, radius).addTo(_map);
        }

    }
    exports.map = function(_){
        if(!arguments.length) return _map;
        _map = _;
        return this;
    }

    return exports;
}

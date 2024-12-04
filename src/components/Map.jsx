import { useJsApiLoader, GoogleMap, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import trekkingImg from "../assets/trekking.png";


// Custom CSS to hide the close button
const customInfoWindowStyle = `
  .gm-style-iw button.gm-ui-hover-effect {
    display: none !important;
  }
`;

const center = { lat: 48.8584, lng: 2.2945 };

const Map = ({ routeData }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);



  useEffect(() => {
    if (routeData && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      const waypoints = routeData.stops.map(stop => ({ location: stop.location, stopover: true }));

      directionsService.route(
        {
          origin: routeData.start,
          destination: routeData.end,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);

            // Set markers for each stop with a small offset for the final stop
            const newMarkers = [
              { position: result.routes[0].legs[0].start_location, label: "Start your journey here", zIndex: 2, color: "#58A65C" }, // Start point
              ...waypoints.map((wp, index) => ({
                position: result.routes[0].legs[index].end_location,
                label: `Stop ${index + 1}`,
                zIndex: 1,
                color: "#58A65C" // Waypoints
              })),
              { position: {
                  lat: result.routes[0].legs[result.routes[0].legs.length - 1].end_location.lat() + 0.00005, 
                  lng: result.routes[0].legs[result.routes[0].legs.length - 1].end_location.lng() + 0.00005
                },
                label: `Stop ${waypoints.length + 1}`, zIndex: 3, color: "#58A65C" } // End point with offset
            ];

            setMarkers(newMarkers);

            // Set InfoWindows for each stop
            const newInfoWindows = [
              { position: result.routes[0].legs[0].start_location, content: "Start your journey here", color: "#58A65C" }, // Start point
              ...waypoints.map((wp, index) => ({
                position: result.routes[0].legs[index].end_location,
                content: `Stop ${index + 1}`,
                color: "#58A65C" // Number labels for stops
              })),
              { position: {
                  lat: result.routes[0].legs[result.routes[0].legs.length - 1].end_location.lat() + 0.00005, 
                  lng: result.routes[0].legs[result.routes[0].legs.length - 1].end_location.lng() + 0.00005
                },
                content: `Stop ${waypoints.length + 1}`,
                color: "#58A65C" } // End point with offset
            ];

            setInfoWindows(newInfoWindows);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [routeData, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map"
        mapContainerStyle={{ width: "100%", height: "100%" }}
        className="map"
        zoom={15}
        center={center}
      
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position} 
            label={marker.label} 
            icon={{
              url: "https://example.com/my-icon.png", // Your custom icon URL
              scaledSize: new window.google.maps.Size(40, 40), // Your custom icon size
            }} 
            zIndex={marker.zIndex}
          />
        ))}
        {infoWindows.map((info, index) => (
          <InfoWindow key={index} position={info.position}>
            <div style={{ color: info.color, fontSize: '11px', fontWeight: 'bold', padding: '0', margin:"0", display:'flex', alignItems:'center', justifyContent:'center' }}> 
              <img width={20} height={20} src={trekkingImg}/> {info.content}
            </div>
          </InfoWindow>
        ))}
        <style>{customInfoWindowStyle}</style>
      </GoogleMap>

    
  
    </div>
  );
};

export default Map;

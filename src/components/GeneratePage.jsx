import React from "react";
import Form from "./Form";
import Map from "./Map";
import ExpandableMenu from './ExpandableMenu';

const GeneratePage = ({savedRoutes, handleRouteGenerated, setSavedRoutes}) => {
  return (
    <>

    <div className="content-wrapper"> 
    <ExpandableMenu savedRoutes={savedRoutes} setSavedRoutes={setSavedRoutes} />
    
           <div className="form-container">
            
              <Form onRouteGenerated={handleRouteGenerated} />
              
            </div>

            <div className="form-helper-container">

              <p className="trip-notes-header">
              🌍 Explore the World!
              </p>
              <p className="trip-notes">
              Enter your travel details, and our AI will craft a perfect route for your adventure. Just provide the country, city, starting point, duration, and number of stops. Your journey begins here!
              </p>


              
            </div>
           
       <div className="map-container">
      <Map />
      </div>
    </div>
    </>
  );
};

export default GeneratePage;


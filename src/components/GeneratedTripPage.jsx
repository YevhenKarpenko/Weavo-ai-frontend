import React, { useState, useEffect } from "react";
import RouteInfo from './RouteInfo';
import Map from './Map';
import ExpandableMenu from './ExpandableMenu'; 
import {Route, Routes } from "react-router-dom";
import RoutePage from "./RoutePage";

const GeneratedTripPage = ({ formData, mapLink, routeData, savedRoutes, setSavedRoutes }) => {

  return (
    <div className="content-wrapper">
      <ExpandableMenu savedRoutes={savedRoutes} setSavedRoutes={setSavedRoutes} />
      <Routes>

        {savedRoutes.map((route, index) => (
          <Route
            key={index}
            path={`/${index}`}
            element={<RoutePage formData={route.formData} mapLink={route.mapLink} routeData={route.routeData} />}
          />
        
        ))}

        {/* <Route
            path='/0'
            element={<RoutePage formData={formData} mapLink={mapLink} routeData={routeData} />}
          /> */}


      </Routes>

     
    </div>
  );
};

export default GeneratedTripPage;

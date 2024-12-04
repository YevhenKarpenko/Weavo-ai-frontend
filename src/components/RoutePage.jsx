import React from 'react';
import RouteInfo from './RouteInfo';
import Map from './Map';

const RoutePage = ({formData, mapLink, routeData }) => {
  return (
    <>
      <div className="route-info-container">
        <RouteInfo
          formData={formData}
          mapLink={mapLink}
          routeData={routeData}
        />
      </div>

      <div className="map-container-generated">
        <Map routeData={routeData} />
      </div>
    </>
  );
};

export default RoutePage;

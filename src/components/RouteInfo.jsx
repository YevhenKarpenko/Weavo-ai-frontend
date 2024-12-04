import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import timeImg from "../assets/time.png";
import TimerIcon from "@mui/icons-material/Timer";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ExploreIcon from "@mui/icons-material/Explore";
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme
} from "@mui/material";

const RouteInfo = ({ routeData, mapLink, formData }) => {
  const [images, setImages] = useState([]);
  const scrollableContainerRef = useRef(null);


  const apiUrl = 'https://us-central1-airoutegenerator.cloudfunctions.net/api';


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchPlaceImage = async (placeName, index) => {
    try {
      const response = await axios.get(`${apiUrl}/place`, {
        params: { place: placeName },
      });
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = response.data.photoUrl;
        return newImages;
      });
    } catch (error) {
      console.error("Error fetching place image:", error);
    }
  };

  useEffect(() => {
    routeData.stops.forEach((stop, index) => {
      fetchPlaceImage(stop.location, index);
    });

    // Smooth scroll to the top of the container or window when the component mounts
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [routeData.stops, isMobile]);

  const handleMapOpen = () => {
    window.open(mapLink, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="scrollable-container" ref={scrollableContainerRef}>
        <div className="main-header">
          <p>Your {formData.city} walking tour is all set! 🎉</p>
        </div>
        {mapLink && (
          <div className="google-map-btn-container">
            <div className="google-map-helper-text">
              <p className="google-map-helper-header">
                Get ready to explore! 
              </p>
              <p className="google-map-helper-sub-header">
                {" "}
                Open in Google Maps and enjoy the journey!
              </p>
            </div>
            <Button
              type="submit"
              variant="contained"
              onClick={handleMapOpen}
              sx={{
                gap: 1,
              }}
            >
              View Route on Google Map
              <ExploreIcon />
            </Button>
          </div>
        )}
        <div className="trip-notes-container">
          <p className="trip-notes-header">
            <span style={{ color: "#1876D2" }}></span>Journey Tips
          </p>
          <p className="trip-notes">{routeData.notes}</p>
        </div>
        <div className="trip-notes-container">
          <p className="stops-helper-text">Discover Each Stop! 📸</p>
          <p className="trip-notes">➡️ Get ready to explore each stop in detail – we've got all the info you need.</p>
        </div>
        {routeData.stops.map((stop, index) => (
          <div key={index}>
            <div className="stop-detail">
              <div className="stop-blur"></div>
              <p className="stops-counter">Stop {index + 1}</p>
              <div>
                <div className="stop-location">
                  {stop.location.split(",")[0]}{" "}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="stop-duration">
                    <TimerIcon style={{ marginRight: "7px", opacity: "0.8" }} />{" "}
                    {stop.duration}
                  </div>
                </div>
                <div className="stop-description">{stop.description}</div>
              </div>
              {images[index] && (
                <img
                  className="stop-image"
                  src={images[index]}
                  alt={`Image of ${stop.location}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RouteInfo;

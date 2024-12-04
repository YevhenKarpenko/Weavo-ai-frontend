import React, { useState } from "react";
import countries from "../countries.js";
import axios from 'axios';
import { ColorRing } from "react-loader-spinner"; // Importing the spinner
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Button } from "@mui/material";
import {
  TextField,
  Container,
  Slider,
  Box,
  IconButton,
  FormHelperText,
  Divider,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import TimerIcon from "@mui/icons-material/Timer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import MapIcon from "@mui/icons-material/TravelExplore";
import RouteIcon from "@mui/icons-material/Route";


export default function Form({ onRouteGenerated }) {
  const [formData, setFormData] = useState({
    country: "- Select -",
    city: "",
    time: "1 hour",
    stops: "8",
    start: "",
  });

  const [preferences, setPreferences] = useState({
    route_with_no_Museums_User_Dont_like_museums: false,
    user_prefer_outdoor_activities: false,
    prefer_and_enjoy_historical_sites: false,
    user_want_to_try_local_Food: false,
    user_would_like_to_visit_shopping_destinations: false,
    want_to_visit_parks_and_gardens: false,
  });

  const clearInput = (fieldName) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: "" }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked,
    }));
  };

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [responseText, setResponseText] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [routeData, setRouteData] = useState(null);

  const getLocation = () => {
    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          reverseGeocode(latitude, longitude);
          setLocationLoading(false);
        },
        (error) => {
          setError(error.message);
          setLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
      );
      const data = await response.json();
      if (data && data.address) {
        const { road, city, country } = data.address;

        const fullAddress = `${road}, ${city}, ${country}`;
        setLocation((prevState) => ({ ...prevState, fullAddress }));
        setFormData((prevData) => ({
          ...prevData,
          start: road,
          city: city,
          country: country,
        }));
      } else {
        setError("Unable to retrieve address");
      }
    } catch (error) {
      setError("Error fetching address");
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true); // Start loadin
  //   const selectedPreferences = Object.keys(preferences).filter(
  //     (key) => preferences[key]
  //   );
  //   const prompt = `Just only Json format! We are creating the best routes, using gemini and google maps, Generate a touristic walking route for a user in ${formData.city}, ${formData.country} for ${formData.time} hours with ${formData.stops} stops. Start my route from this starting point: ${formData.start}, ${formData.city}, ${formData.country}, Please optimize route to return to the start point.generate a route based on all information. Dont put destination that could be 6+ km walking, please, its only for a walking,analize all destination, and put tham in a right perfect sequence. Please provide the itinerary in the following format JSON:{
  //           "start": "Starting location",
  //           "stops": [
  //               {
  //                   "location": "Stop 1 location, City",
  //                   "duration": "Duration in minutes",
  //                   "description": "Brief description of the stop"
  //               },
  //               {
  //                   "location": "Stop 2 location, City",
  //                   "duration": "Duration in minutes",
  //                   "description": "Brief description of the stop"
  //               },
  //               ...
  //           ],
  //           "end": "Ending location",
  //           "notes": "Any additional advices in 4 sentanses for this walking trip, the best, maybe check the safety of the city, etc,
  //       } , just write JSON, your jull anser shoud be JSON, starting with {, ending with }. example of notes: **Notes: 
  //       - Consider purchasing a Kyiv City Pass for discounts on attractions and transportation.
  //       - Be sure to wear comfortable shoes and bring water, especially during warmer months.
  //       - Kyiv is a relatively safe city, but it's always wise to be aware of your surroundings and take precautions against pickpocketing.`;

  //   try {
  //     // const response = await axios.post('http://localhost:3001/generate', { prompt });
  //     const genAI = new GoogleGenerativeAI(
  //       "AIzaSyCjZPtR4SX8KO7DzME0a7CpNHO4O0hVQPk"
  //     );

  //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  //     const result = await model.generateContent(prompt);

  //     const response = result.response;
  //     const text = response.text();
  //     const itinerary = JSON.parse(text);

  //     setRouteData(itinerary);

  //     // Create Google Maps link
  //     const { start, stops, end } = itinerary;
  //     const baseUrl = "https://www.google.com/maps/dir/?api=1";
  //     const origin = `&origin=${encodeURIComponent(start)}`;
  //     const destination = `&destination=${encodeURIComponent(end)}`;
  //     const waypoints = stops.map((stop) => stop.location).join("|");
  //     const waypointsParam = waypoints
  //       ? `&waypoints=${encodeURIComponent(waypoints)}`
  //       : "";
  //     const googleMapsLink = `${baseUrl}${origin}${destination}${waypointsParam}`;

  //     setResponseText(JSON.stringify(itinerary, null, 2));

  //     onRouteGenerated(itinerary, googleMapsLink, formData);

  //   } catch (error) {
  //     console.error("Error generating route:", error);
  //     setResponseText("Failed to generate route. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     console.log("User Preferences:", selectedPreferences);
  //   }
  // };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
  
    const selectedPreferences = Object.keys(preferences).filter(
      (key) => preferences[key]
    );
  
    // Prepare the data to send to the backend
    const requestData = {
      country: formData.country,
      city: formData.city,
      time: formData.time,
      stops: formData.stops,
      start: formData.start,
      preferences: selectedPreferences
    };
  
    try {
      // Send POST request to the backend Cloud Function
      const response = await axios.post('https://us-central1-airoutegenerator.cloudfunctions.net/api/generate-route', requestData);
  
      const { itinerary, googleMapsLink } = response.data;
  
      setRouteData(itinerary);
  
      // Set the response text and call the callback to handle the generated route
      setResponseText(JSON.stringify(itinerary, null, 2));
      onRouteGenerated(itinerary, googleMapsLink, formData);
  
    } catch (error) {
      console.error("Error generating route:", error);
      setResponseText("Failed to generate route. Please try again.");
    } finally {
      setLoading(false);
      console.log("User Preferences:", selectedPreferences);
    }
  };

  const inputUpdate = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>


      <div className="background-image-aligner">
        
        <div className="form-container">
      
          <div className="form-wrapper">
         

            <form onSubmit={handleSubmit}>
              <div className="input-form">
                <div className="back-blur">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <InputLabel required id="country-select-label">
                        Country
                      </InputLabel>

                      <Select
                        sx={{ minWidth: 170 }}
                        value={formData.country}
                        variant="outlined"
                        required
                        labelId="country"
                        name="country"
                        onChange={inputUpdate}
                      >
                        <MenuItem  value="- Select -" disabled>
                          - Select -
                        </MenuItem>
                        {countries.map((item) => {
                          return (
                            <MenuItem sx={{ 
                             
                              '&::before': { display: 'none' }
                            }} key={item.name} value={item.name}>
                              {item.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                    <Button
                      style={{ marginTop: 23, marginLeft: 0, paddingLeft: 0 }}
                      disabled={locationLoading}
                      variant="text"
                      onClick={getLocation}
                    >
                      {locationLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <MyLocationIcon />
                      )}
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FormHelperText className="formHelperText">
                      Choose the country you are currently in or plan to visit.
                    </FormHelperText>
                  </div>

                  <Container style={{ marginTop: 6 }}>
                    <TextField
                    autoComplete="off"
                      type="text"
                      value={formData.city}
                      onChange={inputUpdate}
                      name="city"
                      label="City"
                      placeholder="Enter a city"
                      required
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => clearInput("city")}
                              edge="end"
                              aria-label="clear"
                            >
                              <Cancel />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FormHelperText className="formHelperText">
                      Enter the full name of the city you wish to visit (e.g.,
                      'New York City').
                    </FormHelperText>
                  </Container>

                  <div />

                  <Container style={{ marginTop: 10 }}>
                    <Divider sx={{ height: 1, margin: 1 }} />

                    <TextField
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      autoComplete="off"
                      type="text"
                      value={formData.start}
                      name="start"
                      label="Starting point"
                      placeholder="Enter starting point"
                      required
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => clearInput("start")}
                            edge="end"
                            aria-label="clear"
                          >
                            <Cancel />
                          </IconButton>
                        ),
                      }}
                    />

                    <FormHelperText className="formHelperText">
                      Enter a landmark for your starting point.
                    </FormHelperText>
                  </Container>

                  <Divider sx={{ height: 1, margin: 2 }} />

                  <Container style={{ marginTop: 15 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <InputLabel id="time-select-label">
                        <Box display="flex" alignItems="center">
                          Duration
                          <TimerIcon style={{ marginLeft: 3 }} />
                        </Box>
                      </InputLabel>

                      <Select
                        style={{ marginLeft: 10 }}
                        sx={{ minWidth: 125 }}
                        required
                        onChange={inputUpdate}
                        name="time"
                        value={formData.time}
                        labelId="time"
                      >
                        <MenuItem  sx={{ 
        
        '&::before': { display: 'none' }
      }} value="1 hour">1 hour</MenuItem>
                        <MenuItem  sx={{ 
       
        '&::before': { display: 'none' }
      }} value="2 hours">2 hours</MenuItem>
                        <MenuItem  sx={{ 
      
        '&::before': { display: 'none' }
      }} value="3 hours">3 hours</MenuItem>
                        <MenuItem  sx={{ 

        '&::before': { display: 'none' }
      }} value="4+ hours">4+ hours</MenuItem>
                      </Select>
                    </div>

                    <FormHelperText className="formHelperText">
                      Choose the total duration of your trip.
                    </FormHelperText>
                  </Container>

                  <Divider sx={{ height: 1, margin: 2 }} />

                  <Container style={{ marginTop: 25 }}>
                    <InputLabel
                      style={{ color: "#1876D2" }}
                      id="time-slider-label"
                      gutterBottom
                    >
                      Number of stops: {formData.stops}
                    </InputLabel>
                    <Slider
                      sx={{ maxWidth: 220 }}
                      onChange={inputUpdate}
                      name="stops"
                      required
                      aria-labelledby="time-slider-label"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={2}
                      max={8}
                      value={formData.stops || 8} // Extract numeric value or default to 1
                    />

                    <FormHelperText className="formHelperText">
                      Specify the number of stops you want to make during your
                      trip.
                    </FormHelperText>
                  </Container>

                  <div />
                </div>

                {/* Check box container */}

                <div className="call-to-action-btn">
                  {loading ? (
                    <div className="spinner-container">
                      <ColorRing
                        className="spinner"
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={[
                          "#ED5230",
                          "#1C77DF",
                          "#32A365",
                          "#F4BA0C",
                          "#1C77DF",
                        ]}
                      />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 3,
                        gap: 1,
                        borderRadius: 2, // Rounded corners
                        minHeight: 60,
                        minWidth: 300,
                        color: "",
                      }}
                    >
                      Get AI-Powered Route
                      <RouteIcon />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

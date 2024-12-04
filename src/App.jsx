import { useState, useEffect } from "react";
import "./App.css";
import Form from "./components/Form";
import Map from "./components/Map";
import RouteInfo from "./components/RouteInfo";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography, Container } from "@mui/material";
import Landing from "./components/Landing";
import HorizontalBar from "./components/HorizontalBar";
import { auth, provider, signInWithPopup, signOut, db } from "./firebase";
import {  onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import Sidebar from "./components/ExpandableMenu";
import {Route, Routes } from "react-router-dom";
import GeneratePage from './components/GeneratePage'
import AboutUs from "./components/AboutUs";
import { useNavigate } from 'react-router-dom';
import GeneratedTripPage from './components/GeneratedTripPage';
import ExpandableMenu from './components/ExpandableMenu';
import Layout from "./components/Layout"


function App() {
  const [routeData, setRouteData] = useState(null);
  const [mapLink, setMapLink] = useState("");
  const [showLanding, setShowLanding] = useState(true);
  const [formData, setFormData] = useState(null);

  const [user, setUser] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadSavedRoutes(user.uid);
        if (location.pathname === '/') {
          navigate('/generate');  // Redirect to /generate only if the user is on the landing page
        }
      } else {
        setShowLanding(true);
      }
    });

    return () => unsubscribe();
  }, [location, navigate]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log(result.user);
     navigate('/generate');
      loadSavedRoutes(result.user.uid); 
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     setUser(null);
  //     setSavedRoutes([]);
  //     setShowLanding(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };



  const handleRouteGenerated = async (data, link, formData) => {

    const routeName = `${formData.country}, ${formData.city} tour`;
    setRouteData(data);
    setMapLink(link);
    setFormData(formData);

    if(user){
      const newRoute = {
        userId: user.uid,
        routeData: data,
        mapLink: link,
        formData: formData,
        createdAt: new Date(),
        routeName: routeName,
      };

      await saveRoute(data, link, formData, user.uid, routeName);
      setSavedRoutes(prevRoutes => [...prevRoutes, newRoute]); 
       navigate(`/generated-trip/new/0`);
    }
    // navigate(`/generated-trip/new/0}`);
  };

  const saveRoute = async (routeData, mapLink, formData, userId, routeName) => {
    try {
      await addDoc(collection(db, "routes"), {
        userId,
        routeData,
        mapLink,
        formData,
        createdAt: new Date(),
        routeName: routeName,
      });
    } catch (error) {
      console.error("Error saving route: ", error);
    }
  };



  const loadSavedRoutes = async (userId) => {
    try {
      const q = query(
        collection(db, 'routes'),
         where('userId', '==', userId),
         orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const routes = [];
      querySnapshot.forEach((doc) => {
        routes.push({ ...doc.data(), id: doc.id });
      });
      setSavedRoutes(routes);
    } catch (error) {
      console.error('Error loading routes: ', error);
    }
  };
  


  return (

    <>


    <div className="main-container">

      <Routes>
      <Route path="/" element={<Landing onGetStarted={handleSignIn} />} />
      <Route path="/generate" element={<GeneratePage savedRoutes={savedRoutes} handleRouteGenerated={handleRouteGenerated} setSavedRoutes={setSavedRoutes}/>} />
      <Route path="/generated-trip/new/*" element={<GeneratedTripPage setSavedRoutes={setSavedRoutes} formData={formData} mapLink={mapLink} routeData={routeData} savedRoutes={savedRoutes} /> } />
      <Route path="/about-us" element={<AboutUs />} />
      </Routes>
     
    </div>


    
    </>
  );
}

export default App;

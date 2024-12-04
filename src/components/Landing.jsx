import React from 'react';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FootprintAnimation from './FootprintAnimation';
import touristImg from '../assets/tourist.png';
import HorizontalBar from './HorizontalBar';



const Landing = ({ onGetStarted }) => {

  return (
    <div>

    <div className='backgroung-landing'> 
    <HorizontalBar /> 
    {/* horizontal bar */}

    <div className='landing-page-container'>
      <div className='main-landing-text-container'>
        <div style={{ margin: 0, padding: 0 }}>
          <span className='walki-text playfair-display-semi-bold'>Weavo</span> <span style={{marginLeft:"7px"}} className='ai-text'>ai</span>
        </div>
        <p className='main-landing-text' style={{ color: "#143A6F", margin: 0, padding: 0 }}>Discover your next adventure <br /> with the leading AI</p>
        <p className='sub-landing-text' style={{ color: "#143A6F", marginTop: "15px", padding: 0 }}>Plan your perfect walking tour with the power of <br /> Gemini AI and Google Maps.</p>
        <button className='explore-btn' onClick={onGetStarted}> Explore</button>
      </div>


      {/* <div className='banner-container'>
        <img className='banner-image' src={touristImg} alt="Tourist" />
      </div> */}


    </div>
    </div>
    </div>
  );
};

export default Landing;

Landing.jsx

import React from 'react';
import './FootprintAnimation.css';
import leftFootPrintIcon from '../assets/left-footprint.png'; // Adjust the path as needed
import rightFootPrintIcon from '../assets/right-footprint.png'; 
import leftFoot from '../assets/left-food.png'; // Adjust the path as needed
import rightFoot from '../assets/rigth-food.png'; 

const FootprintAnimation = () => (
  <div className="footprint-container">
     <img src={leftFoot} className="footprint left" alt="Left Footprint" />
     <img src={rightFoot} className="footprint right" alt="Right Footprint" />
   
  </div>
);

export default FootprintAnimation;

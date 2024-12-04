import React from 'react';
import { useNavigate } from 'react-router-dom';
const HorizontalBar = () => {


  const navigate = useNavigate();

  const handleAboutUsButton = () => {
    navigate("/about-us")
  }
  return (
    
     <div className='horizontal-bar'>
    <div style={{ margin: 0, padding: 0 }}>
        
        </div>
         <button onClick={handleAboutUsButton} style={{ margin: 0 }} className='about-us-btn'>About Us</button>

    </div>
 
  );
};

export default HorizontalBar;

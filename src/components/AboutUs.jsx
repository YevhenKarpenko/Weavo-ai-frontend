// Suggested code may be subject to a license. Learn more: ~LicenseLog:205799438.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './AboutUs.css';


const AboutUs = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="about-us-container">
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        className="back-button"
      >
        Back
      </Button>
  
      
      
      <h2>🚀 Our Mission</h2>
      <p>
        At Weavo AI, our mission is to simplify travel planning by leveraging the power of Google technologies, including Gemini AI and Google Maps. We aim to provide travelers with seamless and personalized travel routes, helping you explore the world effortlessly.
      </p>

      <h2>🌐 What We Offer</h2>
      <p>Our innovative platform offers a range of features designed to enhance your travel experience:</p>
      <ul>
        <li>
          <strong>Custom Travel Routes:</strong> Just enter your trip details – country, city, starting point, duration, and number of stops – and our AI will craft the perfect travel itinerary for you.
        </li>
        <li>
          <strong>Google Maps Integration:</strong> Open your route directly in Google Maps and start your journey with ease.
        </li>
        <li>
          <strong>Detailed Stop Information:</strong> View images, descriptions, and tips for each stop on your route, making your travel experience richer and more informed.
        </li>
      </ul>

      <h2>✨ Unique Features</h2>
      <ul>
        <li>
          <strong>Seamless Integration:</strong> Our routes are fully integrated with Google Maps, allowing you to navigate effortlessly.
        </li>
        <li>
          <strong>Comprehensive Travel Tips:</strong> Get the most out of your trip with detailed information and tips for each stop.
        </li>
        <li>
          <strong>User-Friendly Interface:</strong> Our platform is designed to be intuitive and easy to use, ensuring a smooth trip planning experience.
        </li>
      </ul>

      <h2>📍 Why Choose Us?</h2>
      <p>
        Weavo AI is not just a travel planning tool – it’s your personal travel companion. We harness the best of Google’s technologies to bring you a unique and personalized travel experience. Whether you’re exploring a new city or revisiting a favorite destination, our platform helps you discover the best routes, sights, and tips.
      </p>

      <h2>🌏 Join Our Journey</h2>
      <p>
        Join us on this exciting journey and explore the world with Weavo AI. Start planning your next adventure today and let us make your travel experience unforgettable.
      </p>
    </div>
  );
};

export default AboutUs;

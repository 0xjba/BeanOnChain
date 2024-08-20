import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./Navbar"; 
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const navigateToBuyCoffee = () => {
    navigate("/buy-coffee"); 
  };

  const handleExploreButtonClick = () => {
    navigate("/buy-coffee"); // Adjust the path as needed
  };

  return (
    <div>
      <Navbar navigateToBuyCoffee={navigateToBuyCoffee} />

      <div className="homepage-hero">
        {/* Existing Hero Section */}
        <div className="circle-behind"></div>
        <div className="yellow-strip top-strip">
          <div className="bottom-scrolling-text">
            ENCRYPTED &nbsp; 🔐 &nbsp; TEN &nbsp; 🔐 &nbsp; ENCRYPTED &nbsp; 🔐 &nbsp; TEN &nbsp; 🔐 &nbsp; ENCRYPTED &nbsp; 🔐 &nbsp; TEN
          </div>
        </div>
        <img className="coffee-image" src="/Coffee.png" alt="Coffee" />
        <div className="text-block">
          <p>Support your favorite creator, developer, or fren with crypto - show your gratitude without the spotlight!</p>
        </div>
        <img src="/arrow.png" alt="Arrow" className="svg-arrow" />
        <div className="yellow-strip bottom-strip">
          <div className="scrolling-text">
            SHARE A COFFEE, KEEP IT BETWEEN US &nbsp; ☕ &nbsp;ON-CHAIN &nbsp; ⛓️‍💥 &nbsp; SHARE A COFFEE, KEEP IT BETWEEN US &nbsp; ☕ &nbsp;ON-CHAIN &nbsp; ⛓️‍💥 &nbsp; SHARE A COFFEE, KEEP IT BETWEEN US &nbsp; ☕ &nbsp;ON-CHAIN
          </div>
        </div>
        <h1 className="homepage-title">
          BEAN THERE<br />
          BREWED IT
        </h1>
      </div>

      {/* New Section Below Hero */}
      <div className="homepage-new-section">
        <h2 className="new-section-title">TOP TIPPEEs</h2>
        <div className="coffee-grid">
          <div className="coffee-item">
            <img src="/melon.jpg" alt="Melon" />
            <p>Melon Musk</p>
          </div>
          <div className="coffee-item">
            <img src="/Tailor.png" alt="Tailor" />
            <p>Tailor Shift</p>
          </div>
          <div className="coffee-item">
            <img src="/Shady.png" alt="Shady" />
            <p>Shady Saga</p>
          </div>
          <div className="coffee-item">
            <img src="/Smiley.gif" alt="Smiley" />
            <p>Smiley Virus</p>
          </div>
          <div className="coffee-item">
            <img src="/Benefit.png" alt="Benefit" />
            <p>Benefit Cucumberpatch</p>
          </div>
          <div className="coffee-item">
            <img src="/Banana.png" alt="Banana" />
            <p>Banana</p>
          </div>
        </div>

        {/* Explore Button */}
        <div className="explore-button-container">
          <button className="explore-button" onClick={handleExploreButtonClick}>
            EXPLORE MORE
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
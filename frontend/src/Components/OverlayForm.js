import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

function OverlayForm({ onOverlayAdded }) {
  const [overlay, setOverlay] = useState({
    name: "",
    text: "",
    logo: "",       
    top: "50px",
    left: "50px",
    size: "24px"
  });

  // handle input change
  const handleChange = (e) => {
    setOverlay({ ...overlay, [e.target.name]: e.target.value });
  };

  // save overlay to backend
  const saveOverlay = async () => {
    try {
      await axios.post(`${API_BASE}/overlay`, overlay);
      alert("Overlay saved!");
      onOverlayAdded(); // refresh overlays in parent
    } catch (err) {
      console.error("Error saving overlay:", err);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add Overlay</h3>
      <input className="url-input" name="name" placeholder="Name" onChange={handleChange} />
      <input className="url-input" name="text" placeholder="Text" onChange={handleChange} />
      <input className="url-input" name="logo" placeholder="Logo URL (optional)" onChange={handleChange} /> 
      <input className="url-input" name="top" placeholder="Top (e.g. 50px)" onChange={handleChange} />
      <input className="url-input" name="left" placeholder="Left (e.g. 100px)" onChange={handleChange} />
      <input className="url-input" name="size" placeholder="Font size (e.g. 20px)" onChange={handleChange} />
      <br /><br />
      <button onClick={saveOverlay}>Save Overlay</button>
    </div>
  );
}

export default OverlayForm;

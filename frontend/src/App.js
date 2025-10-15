import React, { useState } from "react";
import HLSPlayer from "./Components/HLSPlayer";
import OverlayForm from "./Components/OverlayForm";

function App() {
  const [url, setUrl] = useState("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
  const [refresh, setRefresh] = useState(false);

  const handleOverlayAdded = () => {
    setRefresh(!refresh); 
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Livestream with Overlays</h1>

      <input
      className="url-input"
        type="text"
        placeholder="Enter HLS URL (.m3u8)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", padding: "8px" }}
      />
      <br /><br />

      {/* Video Player with overlay management */}
      <HLSPlayer url={url} refresh={refresh} />

      {/* Form to create new overlay */}
      <OverlayForm onOverlayAdded={handleOverlayAdded} />
    </div>
  );
}

export default App;

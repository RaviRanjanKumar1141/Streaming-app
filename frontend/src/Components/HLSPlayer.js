import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";
import { Rnd } from "react-rnd";
import "../App.css";

function HLSPlayer({ url, refresh }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [overlays, setOverlays] = useState([]);

  
  const [edit, setEdit] = useState(null);
  

  // Load video stream
  useEffect(() => {
    if (videoRef.current && url) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url;
      }
    }
  }, [url]);

  // Fetch overlays
  const fetchOverlays = async () => {
    try {
      const res = await axios.get(`${API_BASE}/overlay`);
      setOverlays(res.data || []);
    } catch (err) {
      console.error("Error fetching overlays:", err);
    }
  };

  useEffect(() => {
    fetchOverlays();
  }, [refresh]);

  // Save updated overlay position/size
  const updateOverlay = async (name, top, left, size) => {
    try {
      await axios.put(`${API_BASE}/overlay/${encodeURIComponent(name)}`, {
        top: `${top}px`,
        left: `${left}px`,
        size: `${size}px`,
      });
      fetchOverlays();
    } catch (err) {
      console.error("Error updating overlay:", err);
    }
  };

  // Delete Overlay
  const deleteOverlay = async (name) => {
    try {
      await axios.delete(`${API_BASE}/overlay/${encodeURIComponent(name)}`);
      
      setEdit((prev) => (prev && prev.name === name ? null : prev));
      fetchOverlays();
    } catch (err) {
      console.error("Error deleting overlay:", err);
    }
  };

  // Start editing this specific row (keyed by index)
  const startEdit = (o, key) => {
    setEdit({
      key,
      name: o.name,
      text: o.text || "",
      logo: o.logo || "",
    });
  };

  // Save edits (text/logo) for the selected overlay
  const saveEdit = async () => {
    if (!edit) return;
    try {
      await axios.put(`${API_BASE}/overlay/${encodeURIComponent(edit.name)}`, {
        text: edit.text,
        logo: edit.logo,
      });
      setEdit(null);
      fetchOverlays();
    } catch (err) {
      console.error("Error updating overlay:", err);
    }
  };

  // Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  // Volume
  const changeVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
  };

  // Helper: get numeric size for text font & Rnd width fallback
  const getSizeNum = (s) => {
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : 20;
  };

  return (
    <div
      className="video-container"
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Video layer */}
      <video
        ref={videoRef}
        controls
        style={{ width: "640px", height: "360px", zIndex: 1, display: "block" }}
      />

      {/* Overlays on TOP of the video */}
      {overlays.map((o, idx) => {
        const sizeNum = getSizeNum(o.size);
        const hasLogo = !!o.logo;
        const hasText = !!o.text;

        return (
          <React.Fragment key={`${o.name}-${idx}`}>
            {/* Text overlay box */}
            {o.text && (
              <Rnd
                key={`${o.name}-text`}
                default={{
                  x: parseInt(o.left, 10) || 50,
                  y: parseInt(o.top, 10) || 50,
                  width: sizeNum * 10 || 150,
                  height: "auto",
                }}
                bounds="parent"
                onDragStop={(e, d) =>
                  updateOverlay(o.name, d.y, d.x, sizeNum || 20)
                }
                onResizeStop={(e, direction, ref, delta, position) =>
                  updateOverlay(
                    o.name,
                    position.y,
                    position.x,
                    Math.max(10, parseInt(ref.style.width, 10) / 10)
                  )
                }
                style={{
                  position: "absolute",
                  zIndex: 3,
                  border: "1px dashed gray",
                  background: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  cursor: "move",
                }}
              >
                <div
                  style={{
                    fontSize: `${sizeNum}px`,
                    fontWeight: "bold",
                    color: "red",
                    lineHeight: 1.1,
                  }}
                >
                  {o.text}
                </div>
              </Rnd>
            )}

            {/* Logo overlay box */}
            {o.logo && (
              <Rnd
                key={`${o.name}-logo`}
                default={{
                  x: (parseInt(o.left, 10) || 50) + 40, // offset so not stacked directly on text
                  y: (parseInt(o.top, 10) || 50) + 40,
                  width: 120,
                  height: "auto",
                }}
                bounds="parent"
                onDragStop={(e, d) =>
                  updateOverlay(o.name, d.y, d.x, sizeNum || 20)
                }
                onResizeStop={(e, direction, ref, delta, position) =>
                  updateOverlay(
                    o.name,
                    position.y,
                    position.x,
                    Math.max(20, parseInt(ref.style.width, 10) / 10)
                  )
                }
                style={{
                  position: "absolute",
                  zIndex: 3,
                  border: "1px dashed gray",
                  background: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  cursor: "move",
                }}
              >
                <img
                  src={o.logo}
                  alt="overlay-logo"
                  style={{
                    maxWidth: "120px",
                    maxHeight: "120px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Rnd>
            )}
          </React.Fragment>
        );
      })}

      {/* Custom Controls */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button className="controls" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={changeVolume}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Manage Overlays (single-row edit at a time) */}
      <div style={{ marginTop: "20px" }}>
        <h3>Manage Overlays</h3>
        {overlays.map((o, idx) => {
          const isEditing = edit?.key === idx;

          return (
            <div key={`${o.name}-${idx}`} className="overlay-item">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    placeholder="Text"
                    value={edit.text}
                    onChange={(e) => setEdit({ ...edit, text: e.target.value })}
                    style={{ marginRight: 8 }}
                  />
                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={edit.logo}
                    onChange={(e) => setEdit({ ...edit, logo: e.target.value })}
                    style={{ marginRight: 8 }}
                  />
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEdit(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>
                    <strong>{o.name}</strong>:{" "}
                    
                    {o.text || (o.logo ? "(logo)" : "(empty)")}
                  </span>
                  <button onClick={() => startEdit(o, idx)}>Edit</button>
                  <button onClick={() => deleteOverlay(o.name)}>Delete</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HLSPlayer;

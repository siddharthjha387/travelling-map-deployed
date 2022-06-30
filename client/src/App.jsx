import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";

import { format } from "timeago.js";

import { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";

import "./App.css";

import "mapbox-gl/dist/mapbox-gl.css";
import Register from "./components/Register";
import Login from "./components/Login";


import mapboxgl from 'mapbox-gl';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN =
  ""; // Set your mapbox token here

function App() {
  const myStorage=window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));

  const [viewport, setViewport] = useState({
    latitude: 28.7439185,
    longitude: 77.1923635,
    zoom: 4,
  });

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [rating, setRating] = React.useState(0);
  const [viewRegister,setViewRegister]=useState(false);
  const [viewLogin,setViewLogin]=useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };
    try {
      const res = await axios.post("/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
    });
    // console.log(newPlace);
  };

  const handleLogout=()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);

  }
  return (
    <div className="App">
      
      {/* {currentPlaceId == "626f5cb547c045dc5718a4a9" && "Heelo"} */}
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 7}
              offsetRight={-viewport.zoom * 7}
            >
              <LocationOnIcon
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>

            {currentPlaceId === p._id && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                anchor="left"
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label> Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label> Review</label>
                  <p className="desc">{p.desc}</p>
                  <label> Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label> Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            anchor="top"
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div className="reviewForm">
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Write Your Review"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Review
                </button>
              </form>
            </div>
          </Popup>
        )}

        {currentUser?
        (<button className="button logout" onClick={handleLogout}>Log out</button>)
        :
        (<div className="buttons">
        <button className="button login" onClick={ ()=>setViewLogin(true)}>Log in</button>
        <button className="button register" onClick={()=>setViewRegister(true)}>Register</button>
      </div>)
      }
      {viewRegister &&  (<Register setViewRegister={setViewRegister}/>)}
      {viewLogin &&  (<Login setViewLogin={setViewLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>)}
        
      

      </Map>
    </div>
  );
}

export default App;

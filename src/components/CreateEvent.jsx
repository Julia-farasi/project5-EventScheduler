import axios from "axios";
import { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { BsFillSendPlusFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([parseFloat(lat), parseFloat(lng)], map.getZoom());
    }
  }, [lat, lng, map]);

  return null;
};

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // alert("Event wurde erstellt!");
      Swal.fire({
        title: "You created a new event!",
        icon: "success",
      });
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error(error);
      // alert(error.response?.data.error || "failed!");
      Swal.fire({
        title: "No event created!",
        text: "Please fill in all fields.",
        icon: "error",
      });
    }
  };

  const fetchCoordinates = async (location) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          latitude: data[0].lat,
          longitude: data[0].lon,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Fehler bei der Geocoding-Abfrage:", error);
      return null;
    }
  };


  return (
    <>
     <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto mt-12 px-4">
  {/* Formular */}
  <form
    onSubmit={handleSubmit}
    className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full lg:w-1/2 flex flex-col space-y-4"
  >
    <h2 className="text-2xl font-bold text-center text-white">Create Event</h2>

    {/* Date & Time */}
    <div className="flex flex-col">
      <label className="text-gray-300 mb-1">Date & Time:</label>
      <input
        type="datetime-local"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    {/* Title */}
    <div className="flex flex-col">
      <label className="text-gray-300 mb-1">Title:</label>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    {/* Description */}
    <div className="flex flex-col">
      <label className="text-gray-300 mb-1">Description:</label>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    {/* Location */}
    <div className="flex flex-col">
      <label className="text-gray-300 mb-1">Location:</label>
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) =>
          setFormData({ ...formData, location: e.target.value })
        }
        onBlur={async () => {
          const coords = await fetchCoordinates(formData.location);
          if (coords) {
            setFormData((prev) => ({
              ...prev,
              latitude: coords.latitude,
              longitude: coords.longitude,
            }));
          }
        }}
        className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    {/* Latitude & Longitude */}
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-gray-300 mb-1">Latitude:</label>
        <input
          type="text"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) =>
            setFormData({ ...formData, latitude: e.target.value })
          }
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-300 mb-1">Longitude:</label>
        <input
          type="text"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) =>
            setFormData({ ...formData, longitude: e.target.value })
          }
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
    </div>

    <button
      type="submit"
      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:scale-105 transition-all duration-300"
    >
      Send
    </button>
  </form>

  {/* Karte */}
  <div className="w-full lg:w-1/2 bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
    {formData.latitude && formData.longitude ? (
      <MapContainer
        center={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", minHeight: "100%", aspectRatio: "3 / 4" }}
      >
        <RecenterMap
          lat={formData.latitude}
          lng={formData.longitude}
        />
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
      </MapContainer>
    ) : (
      <div className="flex items-center justify-center h-full text-gray-400 italic p-6">
        Gib eine gültige Location ein...
      </div>
    )}
  </div>
</div>


    </>
  );
}

export default CreateEvent;

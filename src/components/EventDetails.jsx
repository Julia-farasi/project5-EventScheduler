import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/events/${id}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Fehler beim Laden des Events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : event ? (
        <>
          <h2 className="text-3xl font-bold text-indigo-400 text-center mb-6">
            Event Details
          </h2>

          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-semibold text-indigo-300">Titel:</span>{" "}
              {event.title}
            </p>
            <p>
              <span className="font-semibold text-indigo-300">Datum:</span>{" "}
              {new Date(event.date).toLocaleString("de-DE")}
            </p>
            <p>
              <span className="font-semibold text-indigo-300">
                Beschreibung:
              </span>{" "}
              {event.description}
            </p>
            <p>
              <span className="font-semibold text-indigo-300">Ort:</span>{" "}
              {event.location}
            </p>
            <p>
              <span className="font-semibold text-indigo-300">
                Breite (S/N):
              </span>{" "}
              {event.latitude}
            </p>
            <p>
              <span className="font-semibold text-indigo-300">
                Länge (O/W):
              </span>{" "}
              {event.longitude}
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all duration-300"
            >
              ⬅ Zurück zur Übersicht
            </Link>
          </div>

          {event.latitude && event.longitude && (
            <div className="mt-8 rounded overflow-hidden">
              <MapContainer
                center={[
                  parseFloat(event.latitude),
                  parseFloat(event.longitude),
                ]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "300px", width: "100%", borderRadius: "12px" }}
              >
                <TileLayer
                  attribution="© OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    parseFloat(event.latitude),
                    parseFloat(event.longitude),
                  ]}
                />
              </MapContainer>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Event nicht gefunden.</p>
      )}
    </div>
  );
}

export default EventDetails;

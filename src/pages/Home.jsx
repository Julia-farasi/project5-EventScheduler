import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const { isAuthenticated } = useAuth();  
  const token = localStorage.getItem("token");

  const deleteEntry = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:3001/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.id !== id)); // Lokalen Zustand aktualisieren
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/events");
        setEvents(response.data.results);
        const eventsWithLike = response.data.results.map((event) => ({
          ...event,
          liked: false,
        }));
        // setEvents(response.data.results);
        setEvents(eventsWithLike);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  console.log(events);

  // function LikeButton() {

  const toggleLike = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, liked: !event.liked } : event
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-r from-blue-300 to-blue-800 text-white rounded-2xl shadow-xl space-y-6">
      <h2 className="text-3xl font-bold text-white text-center mb-6">EVENTS</h2>

      {error && <p className="text-red-200 text-center font-medium">{error}</p>}

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-center text-white bg-indigo-600 px-4 py-2 rounded-xl mb-4 shadow">
                {event.title}
              </h3>

              <div className="space-y-2 text-sm text-indigo-100">
                <p className="flex items-center text-sm text-indigo-100">
                  <span className="font-semibold text-indigo-300">
                    📅 Date:
                  </span>
                  {new Date(event.date).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">
                    📍 Location:
                  </span>{" "}
                  {event.location}
                </p>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 mt-5">
                <Link
                  to={`/events/${event.id}`}
                  className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition-all duration-300"
                >
                  More Details
                </Link>

              {isAuthenticated && (
                <button
                  onClick={() => deleteEntry(event.id)}
                  className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg shadow hover:bg-red-700 transition-all duration-300"
                >
                  Delete Entry
                </button>
              )}

              </div>

              <button
                onClick={() => toggleLike(event.id)}
                className="mt-6 self-center"
                aria-label="Like event"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={event.liked ? "red" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-6 h-6 transition-all duration-300 hover:scale-110"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Home;

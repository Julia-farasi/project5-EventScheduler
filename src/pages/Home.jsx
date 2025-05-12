import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);

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

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="px-8 py-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-400 text-center">
        EVENTS
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className=" bg-gray-400 text-white rounded shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              {/* <Link to={`/products/${product.id}`}></Link> */}
              <h3 className="text-lg text-center font-semibold mb-2">
                {event.title}
              </h3>
              <p className="text-gray-300">Date: {event.date}</p>
              {/* <p className="text-gray-300 ">Description: {event.description}</p> */}
              <p className="text-gray-300 ">Location: {event.location}</p>
              {/* <p className="text-gray-300 ">S || N: {event.latitude}</p> */}
              {/* <p className="text-gray-300 ">O || W: {event.longitude}</p> */}

              {/* <p className="text-gray-300">Datum: {event.date}</p> */}
              {/* <p className="text-gray-300 "> */}
              {/* Beschreibung: {event.description} */}
              {/* </p> */}
              {/* <p className="text-gray-300 ">Location: {event.location}</p> */}
              {/* <p className="text-gray-300 ">S || N: {event.latitude}</p> */}
              {/* <p className="text-gray-300 ">O || W: {event.longitude}</p> */}
              <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                <Link to={`/events/${event.id}`}>More Details...</Link>
              </button>

              <p>
                <button
                  onClick={() => deleteEntry(event.id)}
                  className="btn btn-error cursor-pointer"
                >
                  Delete Entry
                </button>
              </p>

              <p>
                <button
                  className="btn btn-square cursor-pointer"
                  onClick={toggleLike}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={liked ? "red" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="size-[1.2em]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Home;

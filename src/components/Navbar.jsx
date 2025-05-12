import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { TbLogin2 } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { IoCreateOutline } from "react-icons/io5";
import { BsPersonPlusFill } from "react-icons/bs";
import { TbLogin } from "react-icons/tb";
import Swal from "sweetalert2";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    Swal.fire({
      title: "Goodbye!",
      icon: "success",
    });
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-300 to-blue-800 text-white p-4 shadow-lg flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition duration-300">
        <NavLink to="/">Event Scheduler</NavLink>
      </div>

      <div className="flex space-x-4 items-center">
        {isAuthenticated ? (
          <div className="flex space-x-4 items-center">
            <NavLink
              to="/profile"
              className="flex items-center gap-2 relative px-4 py-2 rounded hover:text-indigo-400 transition duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-indigo-400 hover:before:w-full before:transition-all before:duration-300"
            >
              <VscAccount />
              Profile
            </NavLink>
            <NavLink
              to="/createEvent"
              className="flex items-center gap-2 relative px-4 py-2 rounded hover:text-green-400 transition duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-green-400 hover:before:w-full before:transition-all before:duration-300"
            >
              <IoCreateOutline />
              Create Event
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl shadow hover:scale-105 transition-all duration-300"
            >
              <TbLogin />
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex space-x-4 items-center">
            <NavLink
              to="/login"
              className="flex items-center gap-2 relative px-4 py-2 rounded hover:text-indigo-400 transition duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-indigo-400 hover:before:w-full before:transition-all before:duration-300"
            >
              <TbLogin2 />
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="flex items-center gap-2 relative px-4 py-2 rounded hover:text-indigo-400 transition duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-indigo-400 hover:before:w-full before:transition-all before:duration-300"
            >
              <BsPersonPlusFill />
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

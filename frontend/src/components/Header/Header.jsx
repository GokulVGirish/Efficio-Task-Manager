import React from 'react';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import "./header.css"
import logo from "../../images/efficioLogo.png"
function Header() {
    const token = localStorage.getItem("authToken");
    const { user } = useContext(TokenContext);
    console.log("user", user);
    const logout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    }
    const navigate=useNavigate()

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border mt-2  border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-0 md:rounded-3xl lg:max-w-screen-lg">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex shrink-0">
              <span
                aria-current="page"
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/`)}
              >
                <img
                  className="h-14 w-auto"
                  src={logo}
                  alt="Task Manager Pro"
                />
                <p className="sr-only">Task Manager Pro</p>
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              {token ? (
                <div className="flex items-center space-x-4">
                  <p className="text-gray-900">
                    Welcome,{" "}
                    <span className="capitalize font-semibold">
                      {user.name}
                    </span>
                  </p>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    onClick={() => navigate("/register")}
                    className="hidden items-center cursor-pointer justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                  >
                    Sign in
                  </span>
                  <span
                    onClick={() => navigate("/login")}
                    className="hidden items-center cursor-pointer justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                  >
                    Login
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );

}

export default Header;
import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "../Axios/axios.js"
import TokenContext from '../context/TokenContext.js';
import logo from "../images/efficioLogo.png"
import { toast } from 'sonner';
import { FaEyeSlash, FaRegEye } from 'react-icons/fa6';
function Login() {
    const [formData, setFormData] = useState({});
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [error, setError] = useState();
     const [showPassword, setShowPassword] = useState(false);

     const handleTogglePassword = () => {
       setShowPassword((prev) => !prev);
     };
    const navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post("/user/login", formData)
            toast.success("logged in sucessfully",{onAutoClose:()=>{
                  tokenDispatch({ type: "SET_TOKEN", payload: result.data.token })
            userDispatch({ type: "SET_USER", payload: result.data.user })
            localStorage.setItem("authToken",JSON.stringify(result.data.token))
              navigate("/")

            }})
        
        } catch (error) {
            console.log(error);
            setError({ message: error.response.data.message })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r overflow-hidden bg-[#bcd6d6]">
        {userToken && <Navigate to="/" />}
        <section className="login-container w-full max-w-6xl p-6 bg-white rounded-xl shadow-2xl">
          <div className="px-6 h-full text-gray-800">
            <div className="flex flex-wrap items-center justify-center lg:justify-between h-full g-6">
              {/* Image Section */}
              <div className="hidden lg:block lg:w-6/12 xl:w-6/12">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  className="w-full rounded-l-xl"
                  alt="Sample"
                />
              </div>

              <div className="w-full lg:w-5/12 xl:w-5/12 p-8 bg-white rounded-xl lg:rounded-r-xl">
                <form method="post" onSubmit={handleSubmit}>
                  <div className="flex justify-center mb-6">
                    <img className="h-20 w-auto" src={logo} alt="Logo" />
                  </div>

                  {error && (
                    <div className="text-center border border-red-500 p-2 mb-4 rounded-md bg-red-50 text-red-600">
                      {error.message}
                    </div>
                  )}

                  <div className="mb-6">
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-lg text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="mb-6 relative">
                    {" "}
                    {/* Set position to relative for the eye icon */}
                    <input
                      type={showPassword ? "text" : "password"} // Toggle between text and password
                      name="password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
                      placeholder="Password"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2" // Position the icon
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <Link
                      to="/forgotPassword"
                      className="text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded-lg shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      Login
                    </button>
                  </div>

                  <p className="text-sm text-center font-semibold mt-6">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );

}

export default Login;
import React from 'react';
import { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from "../Axios/axios.js"
import TokenContext from '../context/TokenContext.js';
import logo from "../images/efficioLogo.png"
import { FaRegEye,FaEyeSlash } from "react-icons/fa6";
import { toast } from 'sonner';
function Register() {
    const [formData, setFormData] = useState({})
    const {userToken } = useContext(TokenContext);
    const [error, setError] = useState();
      const [showPassword, setShowPassword] = useState(false);

      const handleTogglePassword = () => {
        setShowPassword((prev) => !prev); 
      };
    const navigate=useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/user/otpSignup", formData)
           toast.success("Otp Sucessfully Sent",{onAutoClose:()=>{
             localStorage.setItem("otpEmail", JSON.stringify(formData.email));
             navigate("/otp");
          
           }})
          
        } catch (error) {
            console.log(error);
            setError({ message: error.response?.data?.message })
        }
    }
   return (
     <div>
       {userToken && <Navigate to="/" />}
       <section className="register-container bg-[#bcd6d6] min-h-screen flex items-center justify-center">
         <div className="container mx-auto px-6 py-12 h-full">
           <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
             <div className="hidden md:block md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
               <img
                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                 className="w-full"
                 alt="Phone"
               />
             </div>

             <div className="w-full md:w-8/12 lg:w-5/12 lg:ml-20 bg-white p-10 shadow-lg rounded-2xl">
               <div className="flex justify-center mb-6">
                 <img className="h-20 w-auto" src={logo} alt="Logo" />
               </div>
               <form method="post" onSubmit={handleSubmit}>
                 {error && (
                   <div className="text-center mb-6 bg-red-100 text-red-600 p-4 rounded-lg border border-red-300 shadow-sm">
                     {error.message}
                   </div>
                 )}

                 <div className="mb-6">
                   <input
                     type="text"
                     name="name"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
                     placeholder="Full Name"
                     onChange={handleChange}
                   />
                 </div>

                 <div className="mb-6">
                   <input
                     type="text"
                     name="email"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
                     placeholder="Email Address"
                     onChange={handleChange}
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
                     {showPassword ? (
                       <FaEyeSlash />
                     ) : (
                      <FaRegEye/>

                     )}
                   </button>
                 </div>

                 <button
                   type="submit"
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out hover:shadow-lg transform hover:-translate-y-1"
                 >
                   Register
                 </button>
               </form>

               <div className="mt-6 text-center">
                 <p className="text-sm text-gray-600">
                   Already have an account?{" "}
                   <a href="/login" className="text-blue-600 hover:underline">
                     Login
                   </a>
                 </p>
               </div>
             </div>
           </div>
         </div>
       </section>
     </div>
   );

}

export default Register;
import React from 'react';
import { NavLink,useLocation } from 'react-router-dom';

function TaskIndicator() {
    const location=useLocation()

   return (
     <div className="flex-grow">
       <nav>
         <ul className="flex gap-6 justify-center p-4 bg-gradient-to-r from-blue-500 to-slate-400 rounded-lg shadow-2xl">
           <li>
             <NavLink
               to="/"
               className={
                 `px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 ${
                  location.pathname==="/"
                     ? "bg-white text-white shadow-md "
                     : "hover:bg-blue-600 hover:text-white"
                 }`
               }
             >
               Pending
             </NavLink>
           </li>
           <li>
             <NavLink
               to="/completed"
               className={
                 `px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 ${
                   location.pathname==="/completed"
                     ? "bg-white text-blue-600 shadow-md"
                     : "hover:bg-blue-600 hover:text-white"
                 }`
               }
             >
               Completed
             </NavLink>
           </li>
         </ul>
       </nav>
     </div>
   );

}

export default TaskIndicator;
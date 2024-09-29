import { createContext,  useEffect,useState } from "react";
import {io } from "socket.io-client";


export const socketContext=createContext(null)

const SocketProvider=({children})=>{

  const [socket,setSocket]=useState(null)

  const token = JSON.parse(localStorage.getItem("authToken"));
useEffect(()=>{

      const socketInstance = io("http://localhost:8000", {
        withCredentials: true,
        reconnection: true,
        secure: true,
        auth: {
          token: token,
        },
      });
      setSocket(socketInstance)

      return ()=>{
         setSocket(null);
         socketInstance.disconnect();
      }

},[token])

return (
    <socketContext.Provider value={socket}>
        {children}

    </socketContext.Provider>
)

}
export default SocketProvider
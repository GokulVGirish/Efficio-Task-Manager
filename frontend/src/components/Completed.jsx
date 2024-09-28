import React, {  useEffect ,useState} from "react";
import CompletedTask from "./CompletedTask";
import instance from "../Axios/axios";
function Completed() {

  const [completedTasks,setCompletedTasks]=useState([])
   const token = JSON.parse(localStorage.getItem("authToken"));

  useEffect(()=>{
    const fetchData=async()=>{

        const response = await instance.get("/task/completedTask", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompletedTasks(response.data.data)

    }
    fetchData()

  },[token])

  return (
    <div>
      {completedTasks.length !== 0 ? (
       completedTasks
          .map((task, index) => (
            <CompletedTask key={index} task={task} id={index} />
          ))
      ) : (
        <h1>No Task Found</h1>
      )}
    </div>
  );
}


export default Completed;
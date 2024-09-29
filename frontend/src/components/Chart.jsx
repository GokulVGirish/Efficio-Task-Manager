import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect,useState } from "react";
import instance from "../Axios/axios";
import { socketContext } from "../socket.io/socketIo";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
    const [charData,setChartData]=useState({pendingCount:0,completedCount:0,totalCount:0})
   const token = JSON.parse(localStorage.getItem("authToken"));
   const Socket=useContext(socketContext)
  
    useEffect(()=>{
          const fetchData = async() => {

            const response=await instance.get("/task/chartData",{headers:{
                Authorization:`Bearer ${token}`
            }})
            if(response.data.success){
                setChartData(response.data.data)
            }



          };
          fetchData()

    },[token])
    
    useEffect(() => {
      if (Socket) {
        Socket.on("chartCount", (data) => {
          setChartData((prevData) => {
         
            if (data === "added") {
              return {
                ...prevData,
                totalCount: prevData.totalCount + 1,
                pendingCount: prevData.pendingCount + 1,
              };
            } else if (data === "completed") {
              return {
                ...prevData,
                pendingCount: prevData.pendingCount - 1,
                completedCount: prevData.completedCount + 1,
              };
            } else {
              return {
                ...prevData,
                totalCount: prevData.totalCount - 1,
                pendingCount: prevData.pendingCount - 1,
              };
            }
          });
        });
      }

    
      return () => {
        Socket?.off("chartCount");
      };
    }, [Socket,token]);

  const data = {
    labels: ['total tasks',"completed","pending"],
    datasets: [
      {
        label: "count",
        data: [charData?.totalCount, charData?.completedCount, charData?.pendingCount],
        backgroundColor: "rgba(54, 162, 235, 0.6)", 
        borderColor: "rgba(54, 162, 235, 1)", 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "top", 
      },
      title: {
        display: true,
        text: "Task Completion Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  console.log("chart dat",charData)

  return (
    <div
      className="bar-chart-container"
      style={{ width: "100%", height: "450px" }}
    >
      {" "}
     
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

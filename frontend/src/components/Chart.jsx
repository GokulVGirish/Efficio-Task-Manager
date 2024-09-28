import React from "react";
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

    },[])
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

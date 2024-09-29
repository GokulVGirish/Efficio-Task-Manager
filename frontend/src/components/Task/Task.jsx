import React, { useEffect, useLayoutEffect } from "react";
import moment from "moment";
import "./task.css";
import { useContext, useState } from "react";
import TaskContext from "../../context/TaskContext";
import DeleteIcon from "@mui/icons-material/Delete";
import instance from "../../Axios/axios";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { socketContext } from "../../socket.io/socketIo";

function Task({ task, id }) {
  const { dispatch, editingImage, setEditingImage, tasks } =
    useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = JSON.parse(localStorage.getItem("authToken"));
  const Socket=useContext(socketContext)

  const handleRemove = async (e) => {
    e.preventDefault();

    await instance.delete("/task/removeTask", {
      data: { id: id },
      headers: { Authorization: `Bearer ${token}` },
    });
   
  };

  const handleMarkDone = async (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm done!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await instance.put(
          `/task/completeTask/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
      }
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Give a valid title");
    if (!description.trim()) return toast.error("Give a valid description");

    try {
       await instance.put(
        `/task/edit/${editingImage}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
    } catch (error) {
      toast.error(error.response.data.message);
    } 
  };
  useLayoutEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.title,task.description]);

  useEffect(()=>{

    if(Socket){
      Socket.on("removeTask",({id})=>{

         toast.success("Task Removed Sucessfully");

         dispatch({
           type: "REMOVE_TASK",
           id,
         });

      })
      Socket.on("handleSave",async({title,description})=>{
        console.log("title ",title,description,editingImage)

          toast.success("sucessfully updated");
          const updatedTasks = tasks.map((task) =>
            task._id === editingImage ? { ...task, title, description } : task
          );

          await dispatch({ type: "SET_TASK", payload: updatedTasks });
          setEditingImage(null)

      })
      Socket.on("markDone",({id})=>{
         toast.success("Task Completed Sucessfully");

         dispatch({
           type: "MARK_DONE",
           id,
         });
      })
    }

    return ()=>{
      Socket?.off("removeTask")
      Socket?.off("handleSave")
      Socket?.off("markDone")
    }

  },[Socket,editingImage,dispatch,setEditingImage,tasks])

  console.log("my tasks",editingImage);



  return (
    <div className="bg-white py-4 px-6 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 transition-transform transform hover:scale-105 duration-200">
      {editingImage === id ? null : (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="checkbox w-5 h-5 cursor-pointer text-green-600"
            onChange={handleMarkDone}
            checked={task.completed}
          />
        </div>
      )}

      <div className="task-info text-gray-800 w-full sm:w-9/12">
        {editingImage === id ? (
          <>
            <input
              type="text"
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 mb-4 text-gray-900 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />

            <textarea
              rows={4}
              placeholder="Enter your description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 mb-4 text-gray-900 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300"
            />

            <div className="flex justify-start gap-3 mt-4">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Save
              </button>

              <button
                onClick={() => setEditingImage(null)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h4 className="task-title text-xl font-semibold capitalize text-blue-700 mb-2">
              {task.title}
            </h4>

            <p className="task-description text-sm text-gray-600 mb-4">
              {task.description}
            </p>

            <div className="text-sm text-gray-500">
              <p>
                Created:{" "}
                {task?.createdAt
                  ? moment(task.createdAt).fromNow()
                  : "just now"}
              </p>
            </div>
          </>
        )}
      </div>

      {editingImage === id ? null : (
        <div className="task-actions flex gap-4 items-center justify-end">
          <button
            onClick={() => setEditingImage(id)}
            className="edit-task-btn bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
          >
            <EditIcon style={{ fontSize: 24 }} />
          </button>

          <button
            onClick={handleRemove}
            className="remove-task-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
          >
            <DeleteIcon style={{ fontSize: 24 }} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Task;

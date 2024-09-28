import React from "react";
import Task from "./Task/Task";
import { useContext } from "react";
import TaskContext from "../context/TaskContext";
function AllTask() {
  const { tasks } = useContext(TaskContext);

  return (
    <div  >
      {tasks.length !== 0 ? (
        tasks
          .filter((task) => !task.completed) 
          .map((task) => <Task key={task._id} task={task} id={task._id} />)
      ) : (
        <h1 className="text-black">No Task Is Incomplete</h1>
      )}
    </div>
  );
}

export default AllTask;

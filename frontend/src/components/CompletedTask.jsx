import moment from "moment"
function CompletedTask({task}) {
 return (
   <div className="bg-white py-4 px-6 rounded-lg shadow-lg flex flex-col items-start justify-center gap-4 mb-4 transition-transform transform hover:scale-105 duration-200">
     {/* Task Information */}
     <div className="task-info text-gray-800 text-base w-full">
       {/* Task Title */}
       <h4 className="task-title text-xl font-semibold capitalize text-blue-700 mb-2">
         {task.title}
       </h4>

       {/* Task Description (if available) */}
       {task.description && (
         <p className="task-description text-gray-600 text-sm mb-3">
           {task.description}
         </p>
       )}

       {/* Created Date */}
       <div className="italic text-sm text-gray-500 flex items-center gap-1">
         <span className="font-semibold text-gray-600">Created: </span>
         <p>{moment(task.createdAt).fromNow()}</p>
       </div>

       {/* Completed Date (if task is completed) */}
       {task.completed && (
         <div className="italic text-sm text-green-500 flex items-center gap-1 mt-2">
           <span className="font-semibold">Completed: </span>
           <p>{moment(task.updatedAt).fromNow()}</p>
         </div>
       )}
     </div>
   </div>
 );
}

export default CompletedTask;
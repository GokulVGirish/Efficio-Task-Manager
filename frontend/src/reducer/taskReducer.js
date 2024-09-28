function taskReducer(tasks, action) {
    console.log("taskreducer");
    switch (action.type) {

        case "ADD_TASK": {
            return [
                ...tasks,
              action.data
            ]
        }
        case "SET_TASK": {
            return action.payload
        }
        case "REMOVE_TASK": {
            return tasks.filter((task) => task._id !== action.id)
        }
        case "MARK_DONE": {
            return tasks.filter((task) => {
              
                 return task._id !== action.id;
            })
        }
        default: {
            throw Error("Unknown Action" + action.type)
        }
    }
}

export default taskReducer;
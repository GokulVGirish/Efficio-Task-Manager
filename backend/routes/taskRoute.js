import express from "express"
import { addTask, getTask, removeTask,completeTask,getChartData,editTask,completedTasks} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask",requireAuth, getTask)
router.delete("/removeTask",requireAuth, removeTask)
router.put('/completeTask/:id',requireAuth,completeTask)
router.get("/chartData",requireAuth,getChartData)
router.get("/completedTask",requireAuth, completedTasks);
router.put("/edit/:id",requireAuth,editTask)


export default router;
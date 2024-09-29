import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import { io } from "../server.js";

dotenv.config();
const sendMail = (email, subject, title, description) => {
  var transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: "alok.yadav6000@gmail.com",
    to: email,
    subject: subject,
    html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const addTask = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const user = await userModel.findOne({ _id: userId });
  taskModel
    .create({ title, description, completed: false, userId })
    .then((data) => {
      sendMail(user.email, "Task Added", title, description);
      io.to(userId.toString()).emit("addTask", data);
      io.to(userId.toString()).emit("chartCount", "added");
      return res.status(200).json({ message: "Task added successfully" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: error.message });
    });
};
const removeTask = (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  io.to(userId.toString()).emit("chartCount", "deleted");
  io.to(userId.toString()).emit("removeTask", { id });
  taskModel
    .findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: "Task deleted successfully" }))
    .catch((error) => res.status(501).json({ message: error.message }));
};

const getTask = (req, res) => {
  taskModel
    .find({ userId: req.user.id, completed: false })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(501).json({ message: error.message }));
};
const completeTask = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const result = await taskModel.updateOne(
      { _id: id },
      { $set: { completed: true } }
    );
    if (result.modifiedCount > 0) {
      io.to(userId.toString()).emit("chartCount", "completed");
      io.to(userId.toString()).emit("markDone", {
        id,
      });
      res.status(200).json({ message: "success" });
    } else {
      res.status(500).json({ message: "couldnt complete request" });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

const getChartData = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await taskModel.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                userId: userId,
              },
            },
            {
              $count: "count",
            },
          ],
          pendingCount: [
            {
              $match: {
                userId: userId,
                completed: false,
              },
            },
            {
              $count: "count",
            },
          ],
          completedCount: [
            {
              $match: {
                userId: userId,
                completed: true,
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $addFields: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
          pendingCount: {
            $ifNull: [{ $arrayElemAt: ["$pendingCount.count", 0] }, 0],
          },
          completedCount: {
            $ifNull: [{ $arrayElemAt: ["$completedCount.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          totalCount: 1,
          pendingCount: 1,
          completedCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
const editTask = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { title, description } = req.body;
  const result = await taskModel.updateOne(
    { _id: id },
    { $set: { title: title, description } }
  );
  if (result.modifiedCount > 0) {
    io.to(userId.toString()).emit("handleSave", { title, description });

    return res.status(200).json({ success: true });
  } else res.status(500).json({ success: false });
};

const completedTasks = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await taskModel.aggregate([
      {
        $match: {
          userId,
          completed: true,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
export {
  addTask,
  getTask,
  removeTask,
  completeTask,
  getChartData,
  editTask,
  completedTasks,
};

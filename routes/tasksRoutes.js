const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  createTask,
  getTasks,
  getTasksByStatus,
  deleteTask,
  getSummary,
  updateTask,
} = require("../controllers/tasksController");

router.use(validateToken);

router.route("/createTasks").post(createTask);
router.route("/getTasks").get(getTasks);
router.route("/getTasksByStatus/:status").get(getTasksByStatus);
router.route("/getSummary").get(getSummary);
router.route("/updateTask/:id").patch(updateTask);
router.route("/deleteTask/:id").delete(deleteTask);

module.exports = router;

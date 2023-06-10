const asyncHandler = require("express-async-handler");
const Tasks = require("../models/tasksModel");

/**
 * @desc - Create a new task
 * @private
 * @funtion
 * @route /tasks/createTasks
 * @param {string} title
 * @param {string} body
 * @returns {Promise}
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const task = await Tasks.create({
    title,
    body,
    userId: req.user.id,
  });

  res.status(201).json(task);
});

/**
 * @desc - Get all tasks
 * @private
 * @funtion
 * @route /tasks/getTasks
 * @returns {Promise}
 */
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Tasks.find({ userId: req.user.id });
  if (!tasks) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(tasks);
});

/**
 * @desc - Get task by status
 * @private
 * @funtion
 * @route /tasks/getTasks/:status
 * @param {string} status
 * @returns {Promise}
 */
const getTasksByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const tasks = await Tasks.find({ userId: req.user.id, status });
  if (!tasks) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(tasks);
});

/**
 * @desc - Get task count
 * @private
 * @funtion
 * @route /tasks/getSummary
 * @returns {Promise}
 */
const getSummary = asyncHandler(async (req, res) => {
  const tasks = await Tasks.aggregate([
    { $match: { userId: req.user.id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.status(200).json(tasks);
});

/**
 * @desc - Delete Task
 * @private
 * @funtion
 * @route /tasks/deleteTask/:id
 * @param {string} id
 * @returns {Promise}
 */
const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Tasks.findById(id);
  if (!task) {
    res.status(404);
    throw new Error("task not found");
  }
  if (task.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  await Tasks.deleteOne({ _id: req.params.id });
  res.status(200).json("Delete Successful");
});

/**
 * @desc - Update Task
 * @private
 * @funtion
 * @route /tasks/updateTask/:id
 * @param {string} id
 * @returns {Promise}
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Tasks.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other Task");
  }
  const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedTask);
});

module.exports = {
  createTask,
  getTasks,
  getTasksByStatus,
  getSummary,
  deleteTask,
  updateTask,
};

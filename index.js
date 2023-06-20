const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

connectDb();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/tasksRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

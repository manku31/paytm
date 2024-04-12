const cors = require("cors");
const express = require("express");

const rootRouter = require("./routes/index");

// Variables
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/api/v1", rootRouter);

// Server
app.listen(port, () => console.log(`Server running on port ${port}`));

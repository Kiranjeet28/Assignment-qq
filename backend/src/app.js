const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const productRoutes = require(
    "./routes/product.routes"
);

const errorHandler = require(
    "./middleware/errorHandler"
);

const app = express();

app.use(helmet());
app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);
app.use(cors());

app.use(express.json());

app.use("/api", productRoutes);

app.use(errorHandler);

module.exports = app;
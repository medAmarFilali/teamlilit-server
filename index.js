const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const server = http.createServer(app);
dotenv.config();
const io = require("socket.io")(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    // allowEIO3: true,
    credentials: true,
  },
});

// app.set("transports", ["websocket", "flashsocket", "polling"]);

const userRouter = require("./routes/userRouter");

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use("/user", userRouter);

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`Listening to http://localhost:${port}`);
    })
  )
  .catch((err) => console.log(err.message));
